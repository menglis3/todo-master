var express = require('express'),
    router = express.Router(),
    logger = require('../../config/logger'),
    ToDos = require('../models/todos'),
    passport = require('passport');


//var requireLogin = passport.authenticate('local', { session: false });
var requireAuth = passport.authenticate('jwt', { session: false });

module.exports = function (app, config) {
    app.use('/api', router);

    router.route('todos/user/:userId').get(requireAuth, function(req, res, next){
        logger.log('Get all todos', 'verbose');
    
        var query = User.find()
        .sort(req.query.order)
        .exec()
        .then(result => {
            if(result && result.length) {
            res.status(200).json(result);
        } else {
            res.status(404).json({message: 'No todos'});
        }
        })
        .catch(err => {
            return next(err);
        });
    })

    //Post
    router.post('/todos', function (req, res, next) {
        logger.log('Create User', 'verbose');
        var user = new ToDos(req.body);
        user.save()
        .then(result => {
            res.status(201).json(result);
        })
        .catch( err => {
           return next(err);
        });
      })
}

    //Put Handler 
    router.put('/todos/password/:userId', function(req, res, next){
        logger.log('Update todos ' + req.params.userId, 'verbose');

        User.findById(req.params.userId)
            .exec()
            .then(function (user) {
                if (req.body.password !== undefined) {
                    user.password = req.body.password;
                }

                user.save()
                    .then(function (user) {
                        res.status(200).json(user);
                    })
                    .catch(function (err) {
                        return next(err);
                    });
            })
            .catch(function (err) {
                return next(err);
            });
    });

        //Delete Handler
        router.route('/todos/:userId').delete(function(req, res, next){
            logger.log('Delete todos' + req.params.userId, 'verbose');
            res.status(200).json({message: "Delete user" + req.params.userId});
        });
        
        router.post('/login', function(req, res, next){
            console.log(req.body);
            var email = req.body.email
            var password = req.body.password;
      
            var obj = {'email' : email, 'password' : password};
          res.status(201).json(obj);
      });

