'use strict';
require('./app_config');

var User = require('user');
var Place = require('place');

var tyler = User.create({ name: 'Tyler', email: 'tyler@paperlesspost.com' });
tyler.places.push( Place.create({name:'nyc'}) );

if(tyler.save()){
  console.log(tyler);
  var asdf = User.findByEmail('tyler@paperlesspost.com');
  console.log(asdf);
}else{
  console.log(tyler.errors);
}

for(var i=0; i < 1000; i++){
  var randName = Math.floor(Math.random()*0xFFFFF).toString(16);
  User.create({ name: randName,  email: randName + '@gmail.com' });
}

console.log( User.find({limit:3, offset:300}) );
