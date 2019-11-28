const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/User");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

// ${process.env.HURL}

passport.use(
  new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: `/auth/google/callback`
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({
          googleID: profile.id
        })
        .then(user => {
          if (user) {
            done(null, user);
            return;
          }

          const newUser = {
            googleID: profile.id,
            email: profile.emails[0].value,
            email_verified: profile.emails[0].verified,
            name: profile.displayName,
            picture: profile.photos[0].value,
            given_name: profile.name.givenName,
            family_name: profile.name.familyName,
            access_token: accessToken,
            locale: profile.locale,
            refresh_token: refreshToken
          };

          User.create(newUser)
            .then(newUser => {
              done(null, newUser);
            })
            .catch(err => done(err)); // closes User.create()
        })
        .catch(err => done(err)); // closes User.findOne()
    }
  )
);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email"
    ]
  })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/main",
    failureRedirect: "/" // here you would redirect to the login page using traditional login approach
  })
);

router.get("/login", (req, res, next) => {
  res.render("auth/login", {
    message: req.flash("error")
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});


router.get("/", (req, res, next) => {
  res.render("map");


});
router.get("/profile", (req, res, next) => {
  res.render("profile");


});

module.exports = router;