const express = require('express');
const methodOverride = require('method-override')
const app = express();
const mongoose = require('mongoose')
const Tickets = require('./models/tickets-model')
const User = require('./models/user-model')
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const ticketsController = require('./controllers/tickets')
const usersController = require('./controllers/user')



// setting render templating as ejs
app.set('view engine', 'ejs');


app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))
app.use(ticketsController)
app.use(usersController)
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'SECRET' 
}));

app.get('/', function(req, res) {
  res.render('auth');
});

// google autho
var userProfile;
app.use(passport.initialize());
app.use(passport.session());

app.get('/success', (req, res) => res.send(userProfile));
app.get('/error', (req, res) => res.send("error logging in"));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

/*  Google AUTH  */
 
const GOOGLE_CLIENT_ID = '1062898417984-sjcm6c58j6msvru4kgc4f8gpe2h2ajai.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = 'HfbGtiPOUvz4M18i-g3lISHx';
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
      userProfile=profile;
      return done(null, userProfile);
  }
));
 
app.get('/auth/google', 
  passport.authenticate('google', { scope : ['profile', 'email'] }));
 
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/error' }),
  function(req, res) {
    // Successful authentication, redirect success.
    res.redirect('/tickets');
  });









app.use((err, req, res, next) => {
    const statusCode = res.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).send(message);
  });



app.set("port", process.env.PORT || 8000);

// listening on port
app.listen(app.get("port"), () => {
    console.log(`✅ PORT: ${app.get("port")} 🌟`);
});



  










// TODOs
// [x] finsh put and delete route
// [X] connect user and tickets in database
// [X] re-factor routes
// [X] fix heroku 
// [] user login/ authentication
// [] rendering all of a users tickets based on id
// [] passport.js sessios docs
// [] flash message for when picture is to large
// [] style.css or bootstrap
// [] have ticket data display inline
