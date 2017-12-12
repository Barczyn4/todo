var express = require('express'),
    router = express.Router(),
    logger = require('../../config/logger'),
    // ToDo = require('../models/todos'),
    mongoose = require('mongoose'),
    ToDo = mongoose.model('ToDos'),
    Bcrypt = require('bcryptjs'),
    multer = require('multer'),
    mkdirp = require('mkdirp'),
    passport = require('passport');



User = mongoose.model('User'),
    bcrypt = require('bcryptjs');
var requireAuth = passport.authenticate('jwt', { session: false });


module.exports = function (app, config) {
    app.use('/api', router);

    router.route('/todos').get(function (req, res, next) {
        ToDo.find()
            .then(todos => {
                res.status(200).json(todos)
            })
            .catch(err => {
                return next(err);
            })
    });

    router.route('/todos').post(function (req, res, next) {

        logger.log('Create User', 'verbose');

        var user = new ToDo(req.body);

        user.save()

            .then(result => {

                res.status(201).json(result);

            })

            .catch(err => {

                return next(err);

            });

    })

    router.route('/todos/user/:userId').get(function (req, res, next) {
        logger.log('Get todos ', 'verbose');

        var query = ToDo.find({ user: req.params.userId })
            .sort(req.query.order)
            .exec()
            .then(results => {
                if (results && results.length) {
                    res.status(200).json(results);
                } else {
                    res.status(404).json({ message: "No todos found" });
                }
            })
            .catch(error => {
                return next(error);
            });
    })


    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            var path = config.uploads + req.params.userId + "/";
            mkdirp(path, function (err) {
                if (err) {
                    res.status(500).json(err);
                } else {
                    cb(null, path);
                }
            });
        },
        filename: function (req, file, cb) {
            let fileName = file.originalname.split('.');
            cb(null, fileName[0] + new Date().getTime() + "." + fileName[fileName.length - 1]);
        }
    });



    router.get('/todos', requireAuth, function (req, res, next) {
        logger.log('Get all todos', "verbose");
        User.find()
            .then(result => {
                res.status(200).json(result);
            })
            .catch(err => {
                return next(err);
            });
    });

    router.route('/todos/:todoId').put(function (req, res, next) {
        logger.log('Update todos ' + req.params.todoId, 'verbose');
        ToDo.findOneAndUpdate({ _id: req.params.todoId },
            req.body, { new: true, multi: false })
            .then(todos => {
                res.status(200).json(todos);
            })
            .catch(error => {
                return next(error);
            });
    });

    router.route('/todos/:todoId').delete(function (req, res, next) {
        logger.log('Delete todos ' + req.params.userId, 'verbose');
        User.remove({ _id: req.params.userId })
            .then(todos => {
                res.status(200).json({ msg: "todos Deleted" });
            })
            .catch(error => {
                return next(error);
            });
    });

    var upload = multer({ storage: storage });


    router.post('/todos/upload/:userId/:todoId', upload.any(), function (req, res, next) {
        logger.log('Upload file for todo ' + req.params.todoId + ' and ' + req.params.userId, 'verbose');

        ToDo.findById(req.params.todoId, function (err, todo) {
            if (err) {
                return next(err);
            } else {
                if (req.files) {
                    todo.file = {
                        //might have to change these names
                        filename: req.files[0].filename,
                        originalName: req.files[0].originalname,
                        dateUploaded: new Date()
                    };
                }
                todo.save()
                    .then(todo => {
                        res.status(200).json(todo);
                    })
                    .catch(error => {
                        return next(error);
                    });
            }
        });
    });

};