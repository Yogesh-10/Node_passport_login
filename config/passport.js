const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const User = require('../models/User')

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: 'email' },
      async (email, password, done) => {
        // match user
        try {
          const matchedUser = await User.findOne({ email })

          // if not matched
          if (!matchedUser) {
            // done takes three paramters (error,user, options )
            return done(null, false, { message: 'Email not registered' })
          }
          // if matched
          // match password
          bcrypt.compare(password, matchedUser.password, (err, isMatch) => {
            if (err) throw err

            if (isMatch) {
              return done(null, matchedUser)
            } else {
              return done(null, false, { message: 'Password incorrect' })
            }
          })
        } catch (error) {
          console.log(error)
        }
      }
    )
  )

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user)
    })
  })
}
