
var express = require('express'),
    router = express.Router(),
    logger = require('../../config/logger');
    mongoose = require('mongoose')
    User = mongoose.model('User')
    passportService = require('../../config/passport'),
    passport = require('passport')
    


// Why do I uses module.exports here? Why do I need to export these?
    // So we can import them...?
module.exports = function (app, config) {
    app.use('/api', router);
// this passes the req, res, next object


var requireLogin = passport.authenticate('local', { session: false });

router.route('/users/login').post(requireLogin, login);


router.route('/users').get(requireAuth, function(req, res, next){
    logger.log('Get all users', 'verbose');

    var query = User.find()
    .sort(req.query.order)
    .exec()
    .then(result => {
        if(result && result.length) {
        res.status(200).json(result);
    } else {
        res.status(404).json({message: 'No users'});
    }
    })
    .catch(err => {
        return next(err);
    });
})

    router.route('/users/userId').post(function(req, res, next){
        logger.log('Create users' + req.params.userId, 'verbose');
        res.status(200).json({message: "Get user" + req.params.userId});
	});

    router.route('/users/update/userId').put(function(req, res, next){
        logger.log('Update users' + req.params.userId, 'verbose');
        User.findOneAndUpdate({_id: req.params.userId}, 		req.body, {new:true, multi:false})
            .then(user => {
                res.status(200).json(user);
            })
            .catch(error => {
                return next(error);
            });
        }); 
        
    
    /* router.route('/users/password/:userId').put(function(req, res, next){
        logger.log('Update user password' + req.params.userId, 'verbose');
        res.status(200).json({message: "Update user password" + req.params.userId});
    });
    */

    router.put('/users/password/:userId', function(req, res, next){
        logger.log('Update user ' + req.params.userId, 'verbose');
    
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
    
    router.route('/users/:userId').delete(function(req, res, next){
        logger.log('Delete user' + req.params.userId, 'verbose');
        res.status(200).json({message: "Delete user" + req.params.userId});
    });
    
    router.post('/login', function(req, res, next){
        console.log(req.body);
        var email = req.body.email
        var password = req.body.password;
  
        var obj = {'email' : email, 'password' : password};
      res.status(201).json(obj);
  });
  
};
