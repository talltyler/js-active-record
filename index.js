'use strict';

var ActiveRecord = require('./active_record');
ActiveRecord.establishConnection({adapter:'memory'});

class User extends ActiveRecord {
  constructor(){
    super();
    this.validate('email',{type:'string', allow_blank:false, length:{min:6,max:128},
    regex:/^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i});
  }
}

var tyler = User.create();
tyler.email = 'asdasdfas@dfasdfa.com';
tyler.save();
console.log(tyler);
