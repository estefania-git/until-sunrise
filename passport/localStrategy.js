const passport      = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User          = require('../models/User');
const bcrypt        = require('bcrypt');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENTID);

const util = require("util")

const Strategy = require("passport-strategy")

function CustomStrategy(){
  Strategy.call(this);
}

util.inherits(CustomStrategy, Strategy);
CustomStrategy.prototype.authenticate = function(req, options){
verify(req.body.idtoken).then(foundUser=>{
    (email, done) => {
    User.findOne({ email: foundUser.email })
    .then(foundUser => {
      if (!foundUser) {
        done(User.create(user));
        return;
      }
      done(null, foundUser);
    })
    .catch(err => done(err));
  }

  })
}

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

passport.use(new Strategy({
    usernameField : "email"
  }, verify(req.body.idtoken).then(foundUser=>{
    (email, done) => {
    User.findOne({ email: foundUser.email })
    .then(foundUser => {
      if (!foundUser) {
        done(User.create(user));
        return;
      }
      done(null, foundUser);
    })
    .catch(err => done(err));
  }

  })
  
));

// router.post("/login", (req, res) => {
//   console.log(res)
//   verify(req.body.idtoken).then((user) => {
//     console.log(user.email)

//     User.findOne({email : user.email})
//     .then(userFound => {
//       if(!userFound){
//         User.create(user)
//       .then(userCreated => {
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

