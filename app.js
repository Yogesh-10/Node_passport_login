const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const dotenv = require('dotenv')
const flash = require('connect-flash')
const session = require('express-session')
const index = require('./routes/index')
const users = require('./routes/users')
const connectDB = require('./config/db')
const passport = require('passport')

dotenv.config()

// Passport config
require('./config/passport')(passport)

// DB config
connectDB()

const app = express()

// EJS
app.use(expressLayouts)
app.set('view engine', 'ejs')

// Body parser
app.use(express.urlencoded({ extended: true }))

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  })
)

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Connect Flash
app.use(flash()) // flash message is used to display while redirecting and we are storing it in the session

// Global variables middleware
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  next()
})

// Routes
app.use('/', index)
app.use('/user', users)

const PORT = process.env.PORT || 5000

app.listen(5000, console.log(`server running on port ${PORT}`))
