'use strict';

var Base = require('./base');
var Proxy = require('harmony-proxy');

class ActiveRecord  {
  constructor(){
    var self = this;
    this.changes = {};
    this.errors = [];
    this.validations = {};
    this.base = new Base();
    this.beforeAfterMethods = {};
    var beforeAfterMethodNames = ['beforeCreate', 'afterCreate', 'beforeSave', 'afterSave'];
    beforeAfterMethodNames.forEach(function(method){
      self[method] = function(action){
        if(!self.beforeAfterMethods[method]){
          self.beforeAfterMethods[method] = [];
        }
        self.beforeAfterMethods[method].push(action);
      }
    });
  }

  fireStateActionsFor(method,options){
    if(this.beforeAfterMethods[method]){
      this.beforeAfterMethods[method].forEach(function(action){
        action(options);
      });
    }
  }

  static establishConnection(options){
    var Adapter = require('./lib/adapters/'+options.adapter+'_adapter.js');
    ActiveRecord.prototype.persistance = new Adapter();
  }

  static create(object){
    var instance = new this();
    var proxy = new Proxy(instance,instance.base);
    instance.fireStateActionsFor('beforeCreate',object);
    Object.assign(instance,object);
    if(instance.persistance){
      instance.persistance.create(instance);
    }
    instance.fireStateActionsFor('afterCreate',object);
    return proxy;
  }

  validate(field,options) {
    if(Array.isArray(field)){
      var self = this;
      field.forEach(function(item){
        self.validate(item,options);
      })
    }else{
      this.validations[field] = options;
    }
  }

  save(options){
    if(!this.errors.length){
      this.fireStateActionsFor('beforeSave',options);
      // TODO: validate presence and allow_blank
      if(this.persistance){
        this.persistance.update(this);
      }
      if(!this.errors.length){
        this.changes = {};
      }
      this.fireStateActionsFor('afterSave',options);
    }
  }
}

module.exports = ActiveRecord;
