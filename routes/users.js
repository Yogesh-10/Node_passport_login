const express = require('express')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const router = express.Router()
const User = require('../models/User')

router.get('/login', (req, res) => {
  res.render('login')
})

router.get('/register', (req, res) => {
  res.render('register')
})

// register
router.post('/register', async (req, res) => {
  const { name, email, password, password2 } = req.body
  let errors = []
  // required fields
  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please fill in all fields' })
  }

  // password match
  if (password !== password2) {
    errors.push({ msg: 'Passwords do not match' })
  }

  // check pass length
  if (password.length < 6) {
    errors.push({ msg: 'Password should be at least 6 characters long' })
  }

  if (errors.length > 0) {
    // passing in objects because they stay in input even after re render because value is passed in form in register.ejs
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2,
    })
  } else {
    // validation passed
    // user exist
    try {
      const userExist = await User.findOne({ email: email })
      if (userExist) {
        errors.push({ msg: 'User already exist' })
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2,
        })
      } else {
        // create new user
        const newUser = new User({
          name,
          email,
          password,
        })

        // Hash Password
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, async (err, hash) => {
            if (err) throw err
            // set password to hashed
            newUser.password = hash
            // save to DB
            req.flash('success_msg', 'Registered Successfully')
            await newUser.save()
            res.redirect('/user/login')
          })
        })
      }
    } catch (error) {
      console.log(error)
    }
  }
})

// Login

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/user/login',
    failureFlash: true,
  })(req, res, next)
})

// Logout
router.get('/logout', (req, res) => {
  // req.logout comes from passport.js
  req.logOut()
  req.flash('success_msg', 'Logged Out')
  res.redirect('/user/login')
})

module.exports = router
