var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';


var config = {
    development: {
        root: rootPath,
        app: ('Cody Barczynski: MyPics'),
        port: 5000,
        db: 'mongodb://127.0.0.1/mypics-dev',
        uploads: rootPath + "/public/uploads/",        
        secret: "secret"
    },


    test: {
        root: rootPath,
        app: ('Cody Barczynski: MyPics'),
        port: 4000,
        db: 'mongodb://127.0.0.1/mypics-dev',
        secret: "secret"
    },

    production: {
        root: rootPath,
        app: ('Cody Barczynski: MyPics'),
        port: 80,
        db: 'mongodb://127.0.0.1/mypics-dev',
        secret: "secret"
    }
};

module.exports = config[env];