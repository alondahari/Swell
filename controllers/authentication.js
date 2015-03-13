var passport = require('passport');
var User = require('../models/user');
var _ = require('underscore')

/**
 * A utility function (since we'll use it a couple times)
 * to abstract out the actual login procedure, which can
 * be used during authentication or signup. Because it
 * mirrors the middleware that calls it, the parameter
 * structure matches. We also need to know the user model
 * we want to log in.
 */
var performLogin = function(req, res, next, user){
  // Passport injects functionality into the express ecosystem,
  // so we are able to call req.login and pass the user we want
  // logged in.
  req.login(user, function(err){
    // If there was an error, allow execution to move to the next middleware
    if(err) return next(err);

    // Otherwise, send the user to the homepage.
    var resUser = user.toObject()
    delete resUser.password
    return res.send(resUser)
  });
};

/**
 * Our base authentication controller object
 */
var authenticationController = {

  user: function(req, res){
    if (req.user) {
      var user = req.user.toObject()
      delete user.password
      return res.send(user)
    }
    return res.send({})
  },

  updateUser: function(req, res){
    console.log(req.body)
    var query = User.where({_id: req.body.userId})
    query.findOneAndUpdate({_id: req.body.userId}, {$set: {
      username: req.body.username,
      email: req.body.email
    }}, function(err, user){
      if (err) {
        res.send(err)
      } else {
        var resUser = user.toObject()
        delete resUser.password
        return res.send(resUser)
      }
    })

  },

  // This is the post handler for any incoming login attempts.
  // Passing "next" allows us to easily handle any errors that may occur.
  login: function(req, res, next){

    // Passport's "authenticate" method returns a method, so we store it
    // in a variable and call it with the proper arguments afterwards.
    // We are using the "local" strategy defined (and used) in the
    // config/passport.js file
    var authFunction = passport.authenticate('local', function(err, user, info){

      // If there was an error, allow execution to move to the next middleware
      if(err) return next(err);

      // If the user was not successfully logged in due to not being in the
      // database or a password mismatch, set a flash variable to show the error
      // which will be read and used in the "login" handler above and then redirect
      // to that handler.
      if(!user) {
        return res.send('Wrong email or password. Please try again.');
      }
      
      // If we make it this far, the user has correctly authenticated with passport
      // so now, we'll just log the user in to the system.
      performLogin(req, res, next, user);
    });

    // Now that we have the authentication method created, we'll call it here.
    authFunction(req, res, next);
  },

  // Slightly different from our login procedure, the signup process
  // will allow new users to create an account. It will immediately try to
  // create the new user and rely on mongoose to throw any duplication errors.
  // If none are found, the user is successfully added to the DB, it is safe to
  // assume that they are ready to log in, so we do that as well.
  signup: function(req, res, next){

    // Create a new instance of the User model with the data passed to this
    // handler. By using "param," we can safely assume that this route will
    // work regardless of how the data is sent (post, get).
    // It is safer to send as post, however, because the actual data won't
    // show up in browser history.
    var user = new User({
      password: req.body.password,
      email: req.body.email
    });

    // Now that the user is created, we'll attempt to save them to the
    // database.
    user.save(function(err, user){

      // If there is an error, it will come with some special codes and
      // information. We can customize the printed message based on
      // the error mongoose encounters
      if(err) {
        console.log(err)
        // By default, we'll show a generic message...
        var errorMessage = 'An error occured, please try again';

        // If we encounter this error, the duplicate key error,
        // this means that one of our fields marked as "unique"
        // failed to validate on this object.
        if(err.code === 11000){
          errorMessage = 'This user already exists.';
        }

        return res.send(errorMessage);
      }

      // If we make it this far, we are ready to log the user in.
      performLogin(req, res, next, user);
    });
  },

  // Handle logout requests
  logout: function(req, res){

    // Passport injects the logout method for us to call
    req.logout();

    // Redirect back to the login page
    res.redirect('/');
  }
};

// Export our controller methods
module.exports = authenticationController;
