import passport from 'passport'
import { Strategy, ExtractJwt } from 'passport-jwt'
import LocalStrategy from 'passport-local'
// a strategy in passport is a method of authenticating a user

import config from '../config.js'
import User from '../models/user'

// local strategy for authentication
const localOptions = { usernameField: 'email' } // tells local strategy what field is username in request body
const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
  // verify username, password, call done with user if successful
  User.findOne({ email }, (err, user) => {
    if (err) return done(err)
    if (!user) return done(null, false) // no user found

    // compare pw with the instance function we made
    user.comparePassword(password, (err, isMatch) => {
      if (err) return done(err)
      if (!isMatch) return done(null, false) // no user found

      return done(null, user)
    })
  })
})

// strategy config
const jwtOptions = {
  // tell jwt strategy where token is
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret,
}

//create jwt strategy
const jwtLogin = new Strategy(jwtOptions, (payload, done) => {
  // run on every authentication request
  // payload is decoded jwt token (with sub, iat props)
  // done is callback on success

  // check user id from payload
  // call done with user if exists
  User.findById(payload.sub, (err, user) => {
    if (err) return done(err, false)

    if (user) {
      done(null, user)
    } else {
      done(null, false)
    }

  })
})

// tell passport to use strategies
passport.use(jwtLogin)
passport.use(localLogin)
