const express = require("express");
const router = express.Router();
const ensureLogin = require("connect-ensure-login");
const search = require("youtube-search");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/main", ensureLogin.ensureLoggedIn(), (req, res, next) => {
  res.render("main", req.user);
});

router.get("/profile", ensureLogin.ensureLoggedIn(), (req, res, next) => {
  res.render("profile", req.user);
});

router.get("/prueba", ensureLogin.ensureLoggedIn(), (req, res, next) => {
  let opts = {
    maxResults: 10,
    key: "AIzaSyAuKj9DeZEZw9hrK1Z52vCu0YZ2ULGyTSY"
  };

  search("camela", opts, function(err, results) {
    if (err) return console.log(err);

    console.dir(results);
  });
});

module.exports = router;
