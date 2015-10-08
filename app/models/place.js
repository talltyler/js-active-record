'use strict';

class Place extends require('active_record') {
  constructor(){
    super();
    this.belongsTo('user');
  }
}

module.exports = Place;
