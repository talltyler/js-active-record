'use strict';

class User extends require('active_record') {
  constructor(){
    super();
  }
}

User.hasMany('places');
User.addIndex('email');
User.validate('email',{type:'string', allow_blank:false, length:{min:6,max:128},
  regex:/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}/i});

module.exports = User;
