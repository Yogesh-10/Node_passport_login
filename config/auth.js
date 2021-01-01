module.exports = {
  ensureAuthenticated: function (req, res, next) {
    // isAuthenticated comes from passport
    if (req.isAuthenticated()) {
      return next()
    }
    req.flash('error_msg', 'Please Login')
    res.redirect('/user/login')
  },
}
