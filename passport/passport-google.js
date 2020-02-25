// 'use strict';

// const passport = require('passport');
// const User = require('../models/user');
// const LocalStrategy = require('passport-local').Strategy;

// passport.serializeUser((user, done) => {
//     done(null, user.id);
// });

// passport.serializeUser((id, done) =>{
//     User.findById(id, (err, user) => {
//         done(err, user);
//     });
// });

// passport.use('local.signup', new LocalStrategy({
//     usernameField: 'email',
//     passwordField: 'password',
//     passReqToCallback: true
// }, (req, email, password, done) => {

//     User.findOne({'email' : email}, (err, user) => {
//         if(err){
//             return done(err);
//         }
//         if(user){
//             return done(null, false, req.flash('error', 'User with email already exist'));
//         }

//         const newUser =  new User();
//         newUser.username = req.body.username;
//         newUser.email = req.body.email;
//         newUser.password = newUser.encryptPassword(password);

//         newUser.save((err) => {
//             done(null, newUser);
//         })

//     })


// }));





var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var passport = require('passport');
var User = require('../models/user');
const secret = require('../secret/secretFile');

passport.serializeUser(function (user, done) {
    done(null, user.id);
});
passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

passport.use(new GoogleStrategy({
    clientID: secret.google.clientID,
    clientSecret: secret.google.clientSecret,
    callbackURL: 'http://localhost:3333/auth/google/callback',
    passReqToCallback: true

}, function (req,accessToken, refreshToken, profile, done) {
   
        User.findOne({google:profile.id}, function (err, user) {
            if (err) {
                return done(err);
            }
            
            if(user){
                return done(null, user);

            }else {
                const newUser = new User();
                newUser.google = profile.id;
                newUser.fullname = profile.displayName;
                newUser.email = profile.email;
               // newUser.userImage = profile._json.image.url;

                newUser.save((err) => {
                    if(err){
                        return done(err);
                    }
                    return done(null, newUser);
                })
            }
           
          
        });
}));











