'use strict';

var ActiveRecord = require('./active_record');
ActiveRecord.establishConnection({adapter:'memory'});

class User extends ActiveRecord {
  constructor(){
    super();
    this.addIndex('email');
    this.validate('email',{type:'string', allow_blank:false, length:{min:6,max:128},
      regex:/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}/i});
  }
}

var tyler = User.create();
tyler.email = 'asdf@asdf.com';
if(tyler.save()){
  var asdf = User.findByEmail('asdf@asdf.com');
  console.log(asdf);
}else{
  console.log(tyler.errors);
}

for(var i=0; i < 1000; i++){
  User.create({email: 'e' + Math.floor(Math.random()*5000) + '@gmail.com'});
}

console.log( User.find({limit:10, offset:300}) );
