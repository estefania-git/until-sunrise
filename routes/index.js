const express = require('express');
const router  = express.Router();
const ensureLogin = require("connect-ensure-login");
/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/main', ensureLogin.ensureLoggedIn(), (req, res, next) => {

  res.render('main', req.user);
});

module.exports = router;
