'use strict';

var Base = require('./base');
var Proxy = require('harmony-proxy');
var StringUtils = require('./string_utils');
var Symbol = require('es6-symbol');
var Inflector = require('inflected');

var _base = Symbol('base');
var _changes = Symbol('changes');
var _validations = Symbol('validations');
var _associations = Symbol('associations');
var _proxy = Symbol('proxy');
var _instance = Symbol('instance');

var _defaultAssociations = {all:[],belongsTo:[],hasMany:[],hasOne:[],hasAndBelongsToMany:[]}

class ActiveRecord  {
  constructor(){}

  static establishConnection(options){
    var Adapter = require('./lib/adapters/'+options.adapter+'_adapter.js');
    ActiveRecord.persistance = new Adapter();
  }

  static create(props){
    var instance = new this();
    instance[_changes] = {};
    var proxy = new Proxy(instance, new Base(
      this[_validations] || {},
      this[_associations] || _defaultAssociations));
    if(this.persistance){
      this.persistance.create(instance,instance[_changes],props);
    }
    instance[_proxy] = proxy;
    proxy[_instance] = instance;
    createFindByMethod(this,'id');
    return proxy;
  }

  static find(where){
    if(this.persistance){
      return this.persistance.find(this.name,where);
    }
  }

  static belongsTo(model,options){
    this[_associations] = this[_associations] || _defaultAssociations;
    var Model = require(StringUtils.toUnderscore(model));
    var name = StringUtils.toSnakeCase(model);
    let column = name+'Id';
    let a = {model:Model,options:options,column:column,type:'belongsTo'};
    this[_associations].belongsTo.push(a);
    this[_associations].all.push(a);
  }

  static hasMany(model,options){
    this[_associations] = this[_associations] || _defaultAssociations;
    var Model = require(StringUtils.toUnderscore(Inflector.singularize(model)));
    let column = model;
    let a = {model:Model,options:options,column:column,type:'hasMany'};
    this[_associations].hasMany.push(a);
    this[_associations].all.push(a);
  }

  static hasOne(model,options){
    this[_associations] = this[_associations] || _defaultAssociations;
    var Model = require(StringUtils.toUnderscore(model));
    let column = model;
    let a = {model:Model,options:options,column:column,type:'hasOne'};
    this[_associations].hasMany.push(a);
    this[_associations].all.push(a);
  }

  static hasAndBelongsToMany(model,options){
    this[_associations] = this[_associations] || _defaultAssociations;
    var Model = require(StringUtils.toUnderscore(Inflector.singularize(model)));
    let column = model;
    let a = {model:Model,options:options,column:column,type:'hasAndBelongsToMany'};
    this[_associations].hasAndBelongsToMany.push(a);
    this[_associations].all.push(a);
  }

  static validate(field,options) {
    this[_validations] = this[_validations] || {};
    if(Array.isArray(field)){
      var self = this;
      field.forEach(function(item){
        self.validate(item,options);
      })
    }else{
      this[_validations][field] = options;
    }
  }

  static addIndex(column){
    if(this.persistance){
      this.persistance.addIndex(this, column);
    }
    createFindByMethod(this,column);
  }

  save(options){
    if(!this.errors.length){
      // TODO: validate presence and allow_blank
      if(this.constructor.persistance){
        this.constructor.persistance.update(this,this[_changes],null);
      }
      if(!this.errors.length){
        this[_changes] = {};
      }
    }
    return !this.errors.length;
  }

  changeProp(prop,value){
    this[prop] = this[_changes][prop] = value;
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
