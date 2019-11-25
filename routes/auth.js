const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const id = process.env.CLIENTID
const CustomStrategy = new CustomStrategy()
// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
// const {OAuth2Client} = require('google-auth-library');
// const client = new OAuth2Client(process.env.CLIENTID);
// const id = process.env.CLIENTID

router.get("/login", (req, res, next) => {

  res.render("auth/login", {id});
});

// async function verify(token) {
//   const ticket = await client.verifyIdToken({
//     idToken: token,
//     audience: process.env.CLIENTID, // Specify the CLIENT_ID of the app that accesses the backend
//     // Or, if multiple clients access the backend: //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
//   });
//   const payload = ticket.getPayload();
//   const userid = payload['sub'];
//   // If request specified a G Suite domain:
//   //const domain = payload['hd'];
//   return {
//     email: payload['email'],
//     email_verified: payload['email_verified'],
//     name: payload['name'],
//     picture: payload['picture'],
//     given_name: payload['given_name'],
//     family_name: payload['family_name'],
//     locale: payload['locale'],
//     token: token
//   }
// }


// router.post("/login", (req, res) => {
//   console.log(res)
//   verify(req.body.idtoken).then((user) => {
//     console.log(user.email)

//     User.findOne({email : user.email})
//     .then(userFound => {
//       if(!userFound){
//         User.create(user)
//     .then(userCreated => {
//       res.redirect("/"); 
//     })
//     .catch(error => {
//       res.render("/auth/login")
//     }) 
//       } else {
//         res.redirect("/");
//       }
//     })
     
//   }).catch(console.error);
  
// });

router.post("/login", CustomStrategy.authenticate( {
  successRedirect: "/",
  failureRedirect: "/auth/login",
  failureFlash: true,
  passReqToCallback: true
}));

router.get("/signup", (req, res, next) => {
  let client ={
    clientId : process.env.CLIENTID
  };
  
  res.render("auth/signup", client);

});

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  // if (username === "" || password === "") {
  //   res.render("auth/signup", { message: "Indicate username and password" });
  //   return;
  // }

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
