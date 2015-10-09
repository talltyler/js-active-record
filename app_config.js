var appPath = require('app-module-path');
appPath.addPath(__dirname);
appPath.addPath(__dirname+'/app/models');
require('active_record').establishConnection({adapter:'memory'});

// loop over all of the models and add them to global?
