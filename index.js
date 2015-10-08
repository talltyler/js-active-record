'use strict';

var User = require('./app/models/user');
var Place = require('./app/models/place');

require('./active_record').establishConnection({adapter:'memory'});

var brooklyn = Place.create();
brooklyn.name = 'brooklyn';
var tyler = User.create();
tyler.email = 'asdf@asdf.com';
tyler.places.push(brooklyn);
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
