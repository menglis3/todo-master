var express = require('express'),
    router = express.Router(),
    logger = require('../../config/logger'),
    ToDos = require('../models/todos'),
    passport = require('passport'),
    multer = require('multer'),
    mkdirp = require('mkdirp');
    


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

      var storage = multer.diskStorage({
        destination: function (req, file, cb) {      
              var path = config.uploads + req.params.userId + "/";
            mkdirp(path, function(err) {
                if(err){
                    res.status(500).json(err);
                } else {
                    cb(null, path);
                }
            });
        },
        filename: function (req, file, cb) {
            let fileName = file.originalname.split('.');   
            cb(null, fileName[0] + new Date().getTime() + "." +	fileName[fileName.length - 1]);
        }
      });

      var upload = multer({ storage: storage });
      router.post('/todos/upload/:userId/:todoId', upload.any(), function(req, res, next){
          logger.log('Upload file for todo ' + req.params.todoId + ' and ' + req.params.userId, 'verbose');
          
          Todo.findById(req.params.todoId, function(err, todo){
              if(err){ 
                  return next(err);
              } else {     
                  if(req.files){
                      todo.file = {
                          filename : req.files[0].filename,
                          originalName : req.files[0].originalname,
                          dateUploaded : new Date()
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
      