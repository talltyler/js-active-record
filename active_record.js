'use strict';

var Base = require('./base');
var Proxy = require('harmony-proxy');
var StringUtils = require('./string_utils');

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
    ActiveRecord.persistance = new Adapter();
  }

  static create(props){
    var instance = new this();
    var proxy = new Proxy(instance,instance.base);
    instance.fireStateActionsFor('beforeCreate',props);
    if(this.persistance){
      this.persistance.create(instance,props);
    }
    createFindByMethod(this,'id');
    instance.fireStateActionsFor('afterCreate',props);
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
      if(this.constructor.persistance){
        this.constructor.persistance.update(this);
      }
      if(!this.errors.length){
        this.changes = {};
      }
      this.fireStateActionsFor('afterSave',options);
    }
    return !this.errors.length;
  }

  addIndex(column){
    if(this.constructor.persistance){
      this.constructor.persistance.addIndex(this, column);
    }
    createFindByMethod(this.constructor,column);
  }

  static find(where){
    if(this.persistance){
      return this.persistance.find(this.name,where);
    }
  }

}

var createFindByMethod = function(Model,column){
  Model['findBy' + StringUtils.toTitleCase(column)] = function(value, where){
    where = where || {};
    where[column] = value;
    return Model.find(where);
  };
};

module.exports = ActiveRecord;
