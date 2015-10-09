'use strict';

var type = require('component-type');
var isBlank = require('is-blank');

class Base {

  constructor(validations,associations){
    this._validations = validations;
    this._associations = associations;
  }
  /**
  * if, unless : function returning boolean
  * type : date, object, null, undefined, string, boolean, boolean, number, function, regexp, arguments, array, element, nan, error
  * presence:
  * allow_blank:
  * numericality: is a number
  * length, {min, max, is}
  * regex
  * function: custom function returning booleaning, simlar to if but wont block other validations
  * on update/create * not currently supported
  * uniqueness * not currently supported
  */
  set(obj, prop, value){
    if(this._validations[prop]){
      var validation = this._validations[prop];
      var hasIf = validation.hasOwnProperty('if');
      var hasUnless = validation.hasOwnProperty('unless');
      var getMessage = function(key,messageString){
        var message = obj.constructor.name + '.prototype.' + prop + ' was expected to be ' + messageString + ' ' + value;
        return ((validation.message && validation.message[key]) ? validation.message[key] : validation.message) || message;
      };
      var addError = function(key,message){
        if(!obj.errors) {
          obj.errors = [];
        }
        obj.errors.push(getMessage(key,message));
      };
      if(((hasIf && validation.if(obj, prop, value)) || !hasIf) ||
        ((hasUnless && validation.unless(obj, prop, value)) || !hasUnless)){

        if(isBlank(value) && (validation.hasOwnProperty('allow_blank') && validation.allow_blank) ){
          addError('allow_blank','not blank but recieved');
        }

        if(validation.type && type(value) !== validation.type){
          addError('type','of type ' + validation + ' but recieved');
        }

        if(!!validation.presence && !value && value !== 0){
          addError('presence','set but recieved');
        }

        if(validation.numericality && !isNaN(value)){
          addError('numericality','a number but recieved');
        }

        if(validation.regex && !validation.regex.test(value)){
          addError('regex','to match regex but recieved');
        }

        if(validation.function && !validation.function(obj, prop, value)){
          addError('function','a validation function to return true');
        }

        var valueLength = type(value) === 'number' ? value : value.length;
        if(validation.length){
          if(typeof validation.length === 'number' && validation.length !== valueLength){
            addError('length',validation.length + ' but was');
          }else{
            if(validation.length.hasOwnProperty('is') && validation.length.is !== valueLength){
              addError('length',validation.length.is + ' but was');
            }

            var min = validation.length.minimum || validation.length.min;
            if(min && min >= valueLength){
              // TODO: take into account other keys
              addError('min','more than ' + min + ' but was to small');
            }

            var max = validation.length.maximum || validation.length.max;
            if(max && max <= valueLength){
              // TODO: take into account other keys
              addError('min','less than ' + max + ' but was to large');
            }
          }
        }
      }
    }
    obj.changeProp(prop,value);
  }


  get(obj, column){
    // TODO: look on the persistance layer if the data isn't on the object
    if(!obj[column]){
      if(column === 'errors'){
        return [];
      }else{
        var foundColumns = this._associations.all.filter(function(association){
          return column === association.column;
        });
        if (foundColumns.length && (foundColumns[0].type === 'hasMany' ||
          foundColumns[0].type === 'hasAndBelongsToMany')){
          obj[column] = [];
        }
      }
    }
    return obj[column];
  }


}

module.exports = Base;
