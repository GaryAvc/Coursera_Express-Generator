var localStrategy = require('passport-local').Strategy;
var passport = require('passport');
var user = require('./models/user');

passport.use(new localStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());
