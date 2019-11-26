const express = require('express');
const router = express.Router();

/* GET Map page */
router.get('/', (req, res, next) => {
  res.render('main');
});


module.exports = router;