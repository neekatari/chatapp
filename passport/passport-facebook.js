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





var FacebookStrategy = require('passport-facebook').Strategy;
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

passport.use(new FacebookStrategy({
    clientID: secret.facebook.clientID,
    clientSecret: secret.facebook.clientSecret,
    profileFields: ['email', 'displayName', 'photos'],
    callbackURL: 'http://localhost:3333/auth/facebook/callback',
    passReqToCallback: true

}, function (req,token, refreshToken, profile, done) {
   
        User.findOne({facebook:profile.id}, function (err, user) {
            if (err) {
                return done(err);
            }
            if (user) {
                return done(null, user);
            }else {
                const newUser = new User();
                newUser.facebook = profile.id;
                newUser.fullname = profile.displayName;
                newUser.username = profile.displayName;
                newUser.email = profile._json.email;
                newUser.userImage = 'https://graph.facebook.com/'+profile.id+'/picture?type=large';
                newUser.fbTokens.push({token:token});

                newUser.save((err) =>{
                    return done(null, user);
                })
            }
           
          
        });
}));











