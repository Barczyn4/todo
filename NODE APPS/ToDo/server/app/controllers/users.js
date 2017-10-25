var express = require('express'),
  router = express.Router(),
  logger = require('../../config/logger');
mongoose = require('mongoose');
User = mongoose.model('User')

module.exports = function(app, config) {
    
    app.use('/api', router);
    
    
    
    router.route('/users').post(function(req, res, next){
    
    logger.log('Create User', 'verbose');
    
    var user = new User(req.body);
    
    user.save()
    
    .then(result => {
    
    res.status(201).json(result);
    
    })
    
    .catch( err => {
    
    return next(err);
    
    });
    
    })
    
    
    
    
    router.get('/users', function(req, res, next){
    
    logger.log('Get all uses', "verbose");
    
    
    User.find()
    
    .then(result => {
    
    res.status(200).json(result);
    
    })
    
    .catch(err => {
    
    return next(err);
    
    });
    
    
    
    });
    
    
    
    router.route('/users/:userId').get(function(req, res, next){
    
            logger.log('Get user ' + req.params.userId, 'verbose');
    
            User.findById(req.params.userId)
    
                .then(user => {
    
                    if(user){
    
                        res.status(200).json(user);
    
                    } else {
    
                        res.status(404).json({message: "No user found"});
    
                    }
    
                })
    
                .catch(error => {
    
                    return next(error);
    
                });
    
        }); 
    
    
    
    router.route('/users/:userId').put(function(req, res, next){
    
        logger.log('Update user ' + req.params.userId, 'verbose');
    
        User.findOneAndUpdate({_id: req.params.userId},        req.body, {new:true, multi:false})
    
            .then(user => {
    
                res.status(200).json(user);
    
            })
    
            .catch(error => {
    
                return next(error);
    
            });
    
    }); 
    
    
    
    router.route('/users/:userId').delete(function(req, res, next){
    
        logger.log('Delete user ' + req.params.userId, 'verbose');
    
        User.remove({ _id: req.params.userId })
    
            .then(user => {
    
                res.status(200).json({msg: "User Deleted"});
    
            })
    
            .catch(error => {
    
                return next(error);
    
            });
    
    });
    
    };
    