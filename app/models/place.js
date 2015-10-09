'use strict';

class Place extends require('active_record') {
  constructor(){
    super();
  }
}

Place.belongsTo('user');

module.exports = Place;
