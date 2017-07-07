const express = require('express');
const session = require('express-session');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const config = require('./config');

const app = express();
const port = 3000;

app.use(session({
    secret: 'H3dd0Fwendz'
}))

app.use(passport.initialize())

app.use(passport.session());

passport.use(new Auth0Strategy({
  domain: config.domain,
  clientID: config.clientID,
  clientSecret: config.clientSecret,
  callbackURL: config.callbackURL
}, function(accessToken, refreshToken, extraParams, profile, done) {
    console.log("Logged In:", profile);
  return done(null, profile);
}));


app.get('/auth', passport.authenticate('auth0'));

app.get('/auth/callback',
  passport.authenticate('auth0', {
      successRedirect: '/me',
      failureRedirect: '/login'
}))

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj); 
});

app.get('/me', function(req, res) {
    res.send(req.user)
})

app.listen( port, () => { console.log(`Server listening on port ${port}.`); } );