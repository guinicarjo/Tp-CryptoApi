var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var passport	= require('passport');
var config      = require('./config/database'); // get db config file
var User        = require('./app/models/user'); // get the mongoose model
var Message     = require('./app/models/message'); // get the mongoose model
var port        = process.env.PORT || 8080;
var jwt         = require('jwt-simple');

// get our request parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// log to console
app.use(morgan('dev'));

// Use the passport package in our application
app.use(passport.initialize());

// demo Route (GET http://localhost:8080)
app.get('/', function(req, res) {
  res.send('Hello! The API is at http://localhost:' + port + '/api');
});

// Start the server
app.listen(port);
console.log('There will be dragons: http://localhost:' + port);
// connect to database
mongoose.connect(config.database);

// pass passport for configuration
require('./config/passport')(passport);

// bundle our routes
var apiRoutes = express.Router();
apiRoutes.post('/message/send', passport.authenticate('jwt', { session: false}), function(req, res){
  console.log(req);
  var token = getToken(req.headers);
  console.log(token);
  var name = "";
  if (token) {
    console.log(token);
    var decoded = jwt.decode(token, config.secret);
    console.log(decoded);
    User.findOne({
      name: decoded.name
    }, function(err, user) {
      console.log(name);
        if (err) throw err;

        if (!user) {
          return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
        } else {
          var test = new Message ({
            dest: req.body.dest,
            exp: decoded.name,
            message: req.body.message
          });

          test.save(function(err){
            if (err) throw err;

            else{
              res.json({success: true, msg: 'Message envoyé!'});
            };
          })

        }
    });
  } else {
    return res.status(403).send({success: false, msg: 'No token provided.'});
  }


});
// create a new user account (POST http://localhost:8080/api/signup)
apiRoutes.post('/signup', function(req, res) {
  newUser(req,res)
});
function newUser(req,res){
  var ran = random(1, 10000);
  nameRan = 'bob'+ran;
  publickey= req.body.publickey
  if (!req.body.password) {
    res.json({nameRan:nameRan, success: false, msg: 'Please pass name and password.'});
  } else {
    var newUser = new User({
      name: nameRan,
      password: req.body.password,
      publickey: req.body.publickey
    });
    // save the user
    newUser.save(function(err) {
      if (err) {
        newUser(req,res)
      }
      res.json({publickey: publickey, name: nameRan, success: true, msg: 'Successful created new user.'});
    });
  }
}
// connect the api routes under /api/*
app.use('/api', apiRoutes);

// route to authenticate a user (POST http://localhost:8080/api/authenticate)
apiRoutes.post('/authenticate', function(req, res) {
  User.findOne({

    name: req.body.name
  }, function(err, user) {
    if (err) throw err;

    if (!user) {
      res.send({success: false, msg: 'Authentication failed. User not found.'});
    } else {
      // check if password matches
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          var token = jwt.encode(user, config.secret);
          // return the information including token as JSON
          res.json({success: true, token: 'JWT ' + token});
        } else {
          res.send({success: false, msg: 'Authentication failed. Wrong password.'});
        }
      });
    }
  });
});

apiRoutes.get('/memberinfo', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    var decoded = jwt.decode(token, config.secret);
    User.findOne({
      name: decoded.name
    }, function(err, user) {
        if (err) throw err;

        if (!user) {
          return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
        } else {
          res.json({success: true, msg: 'Welcome in the member area ' + user.name + '!'});
        }
    });
  } else {
    return res.status(403).send({success: false, msg: 'No token provided.'});
  }
});


function random (low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}
getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};
