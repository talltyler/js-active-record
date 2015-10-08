'use strict';

var ActiveRecord = require('./../../active_record');

class Place extends ActiveRecord {
  constructor(){
    super();
    this.belongsTo('user');
  }
}

module.exports = Place;
