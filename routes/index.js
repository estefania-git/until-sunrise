const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.post('/login', (req, res, next) => {
  console.log(req)
});


module.exports = router;
