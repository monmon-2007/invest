var User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
var robinhood = require('robinhood');
var Robinhood = robinhood();

module.exports = (router) => {

  router.post('/user', function (req, res) {
    var user = new User();
    user.username = req.body.username;
    user.password = req.body.password;
    user.email = req.body.email;
    user.fname = req.body.fname;
    user.lname = req.body.lname;
    user.bday = req.body.bday;
    user.profession = req.body.profession;
    user.address = req.body.address;
    user.country = req.body.country;
    user.state = req.body.state;
    user.zip = req.body.zip;

    if (req.body.username == null || req.body.username == '' || req.body.password == null || req.body.password == '' || req.body.email == null || req.body.email == '') {
      res.send('Ensure Username, email and password were provided');
    }
    else {
      user.save(function (err) {
        if (err) {
          res.send({
            message: 'Username or email already exist',
            status: false
          });
        } else {
          res.send({
            message: 'User Created',
            status: true
          });
        }
      });
    }
  });

  router.get('/checkEmail/:email', (req, res) => {
    if (!req.params.email) {
      res.json({ status: false, message: 'Email was not provided' });
    } else {
      User.findOne({ email: req.params.email }, (err, user) => {
        if (err) {
          res.json({ success: false, message: err });
        } else {
          if (user) {
            res.json({ success: false, message: 'This email is already registered' });
          } else {
            res.json({ success: true, message: 'Email is availble' });
          }
        }
      });
    }
  });

  router.post('/login', (req, res) => {
    if (!req.body.username) {
      res.json({ success: false, message: 'No username was provided' });
    } else {
      if (!req.body.password) {
        res.json({ success: false, message: 'No password was provided' });
      } else {
        User.findOne({ username: req.body.username.toLowerCase() }, (err, user) => {
          if (err) {
            res.json({ success: false, message: err });
          } else {
            if (!user) {
              res.json({ success: false, message: 'User Not found' });
            } else {
              const validPassword = user.comparePassword(req.body.password)
              if (!validPassword) {
                res.json({ success: false, message: 'password Invalid' });
              } else {
                const token = jwt.sign({
                  userId: user._id
                }, config.secret, { expiresIn: '24h' })
                res.json({ success: true, message: 'Success!!', token: token, user: { username: user.username } });
              }
            }
          }
        });
      }
    }
  });

  router.get('/checkUsername/:username', (req, res) => {
    if (!req.params.username) {
      res.json({ status: false, message: 'Username was not provided' });
    } else {
      User.findOne({ username: req.params.username }, (err, user) => {
        if (err) {
          res.json({ success: false, message: err });
        } else {
          if (user) {
            res.json({ success: false, message: 'This Username is already registered' });
          } else {
            res.json({ success: true, message: 'Username is availble' });
          }
        }
      });
    }
  });

  router.post('/hello', function (req, res) {
    Robinhood.quote_data(req.body.ticker, function (error, response, body) {
      if (error) {
        console.log(error);
        process.exit(1);
      }
      res.send(body);
    });
  });

  //****************************************Auth
  router.use((req, res, next) => {
    const token = req.headers['authorization']
    if (!token) {
      res.json({ success: false, message: 'No token provided' });
    } else {
      jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
          res.json({ success: false, message: 'token Invalid' });
        } else {
          req.decoded = decoded;
          next();
        }
      });
    }
  });

  router.get('/profile', (req, res) => {
    User.findOne({ _id: req.decoded.userId }).select('username email fname fname bday country state profession').exec((err, user) => {
      if (err) {
        res.json({ success: false, message: err });
      } else {
        if (!user) {
          res.json({ success: false, message: 'user not found' });
        } else {
          res.json({ success: true, user: user });
        }
      }
    });
  });

  return router;
}
