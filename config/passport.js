const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const passport = require('passport')
const User = require('../models/user-model')

module.exports = (passport) => {
    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });
    passport.use(new  LocalStrategy({usernameField: "name"}, 
    (name, password, done) =>{
        User.findOne({name}, (err, data) => {
            if(err) throw err;
            if(!data){
                return done(null, false)
            }
            bcrypt.compare(password, data.password, (err, match) =>{
                if(err) throw err;
                if (!match){
                    return done(null, false)
                }
                if (match) {
                    done(null, data)
                }
            })
        })
    }
    ))
}