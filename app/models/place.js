'use strict';

class Place extends require('active_record') {}

Place.belongsTo('user');

module.exports = Place;
