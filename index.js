'use strict';

require('./app_config');

var User = require('user');
var Place = require('place');

var home = Place.create();
home.name = 'brooklyn';

var tyler = User.create();
tyler.email = 'asdf@asdf.com';
tyler.places.push(home);

if(tyler.save()){
  console.log(tyler);
  var asdf = User.findByEmail('asdf@asdf.com');
  console.log(asdf);
}else{
  console.log(tyler.errors);
}

// for(var i=0; i < 1000; i++){
//   User.create({email: 'e' + Math.floor(Math.random()*5000) + '@gmail.com'});
// }

// console.log( User.find({limit:3, offset:300}) );
