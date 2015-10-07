'use strict';

var type = require('component-type');
var isBlank = require('is-blank');

var _validations;

class Base {

  constructor(validations){
    _validations = validations;
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
    if(_validations[prop]){
      var validation = _validations[prop];
      var hasIf = validation.hasOwnProperty('if');
      var hasUnless = validation.hasOwnProperty('unless');
      var getMessage = function(key,messageString){
        var message = obj.constructor.name + '.prototype.' + prop + ' was expected to be ' + messageString + ' ' + value;
        return ((validation.message && validation.message[key]) ? validation.message[key] : validation.message) || message;
      };
      if(((hasIf && validation.if(obj, prop, value)) || !hasIf) ||
        ((hasUnless && validation.unless(obj, prop, value)) || !hasUnless)){

        if(isBlank(value) && (validation.hasOwnProperty('allow_blank') && validation.allow_blank) ){
          obj.errors.push(getMessage('allow_blank','not blank but recieved'));
        }

        if(validation.type && type(value) !== validation.type){
          obj.errors.push(getMessage('type','of type ' + validation + ' but recieved'));
        }

        if(!!validation.presence && !value && value !== 0){
          obj.errors.push(getMessage('presence','set but recieved'));
        }

        if(validation.numericality && !isNaN(value)){
          obj.errors.push(getMessage('numericality','a number but recieved'));
        }

        if(validation.regex && !validation.regex.test(value)){
          obj.errors.push(getMessage('regex','to match regex but recieved'));
        }

        if(validation.function && !validation.function(obj, prop, value)){
          obj.errors.push(getMessage('function','a validation function to return true'));
        }

        var valueLength = type(value) === 'number' ? value : value.length;
        if(validation.length){
          if(typeof validation.length === 'number' && validation.length !== valueLength){
            obj.errors.push(getMessage('length',validation.length + ' but was'));
          }else{
            if(validation.length.hasOwnProperty('is') && validation.length.is !== valueLength){
              obj.errors.push(getMessage('length',validation.length.is + ' but was'));
            }

            var min = validation.length.minimum || validation.length.min;
            if(min && min >= valueLength){
              // TODO: take into account other keys
              obj.errors.push(getMessage('min','more than ' + min + ' but was to small'));
            }

            var max = validation.length.maximum || validation.length.max;
            if(max && max <= valueLength){
              // TODO: take into account other keys
              obj.errors.push(getMessage('min','less than ' + max + ' but was to large'));
            }
          }
        }
      }
    }
    obj.changeProp(prop,value);
  }


  get(obj, prop){
    return obj[prop];
  }


}

module.exports = Base;
