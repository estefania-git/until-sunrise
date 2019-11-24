const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const client = new OAuth2Client(process.env.CLIENTID);

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


router.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENTID, // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend: //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  const userid = payload['sub'];
  // If request specified a G Suite domain:
  //const domain = payload['hd'];
  return {
    email: payload['email'],
    email_verified: payload['email_verified'],
    name: payload['name'],
    picture: payload['picture'],
    given_name: payload['given_name'],
    family_name: payload['family_name'],
    locale: payload['locale'],
    token: token
  }
}

router.post("/login", (req, res) => {
  verify(req.body.idtoken).then((user) => {
    
    p2.create(user)
    .then(userCreated => {
      res.redirect("/index"); //review this adress later
    })
    .catch(error => {
      res.render("/auth/login")
    })

    p2.findOne(email) // findAndModify()

    /* TODO
    * 1. Check if user exists in MongoDB by looking the email. 
    * 2. If user exists update token.
    * 3. If user doesn't exists save new user in database (MongoDB)
    * 4. render welcome page 
    */
     
  }).catch(console.error);
  
});

router.get("/signup", (req, res, next) => {
  let client ={
    clientId : process.env.CLIENTID
  };
  
  res.render("auth/signup", client);

});

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass
    });

    newUser.save()
    .then(() => {
      res.redirect("/");
    })
    .catch(err => {
      res.render("auth/signup", { message: "Something went wrong" });
    })
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
