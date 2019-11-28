const express = require("express");
const router = express.Router();
const ensureLogin = require("connect-ensure-login");
const search = require("youtube-search");
const axios = require("axios");
const Event = require("../models/Event");
const User = require("../models/User");

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

router.get("/prueba/:name", ensureLogin.ensureLoggedIn(), (req, res, next) => {
  let opts = {
    maxResults: 10,
    key: "AIzaSyAuKj9DeZEZw9hrK1Z52vCu0YZ2ULGyTSY"
  };

  search(req.params.name, opts, function (err, results) {
    if (err) return console.log(err);

    console.dir(results[0].id);
  });
});

router.get("/details/:id", (req, res) => {
  axios
    .get(
      `https://app.ticketmaster.com/discovery/v2/events.json?id=${req.params.id}&apikey=4PkIm4wGJG9ZWAv3XAqPzsWngGoE0GHV`
    )
    .then(event =>
      res.render("event-detail", {
        eventDetail: event.data._embedded.events[0]
      })
    )
    .catch(err => console.log(err));
});
router.post("/create-event", (req, res) => {
  console.log(req.body.name)
  let newEvent = {
    name: req.body.name,
    id: req.body.id,
    localDate: req.body.localDate,
    localTime: req.body.localTime,
    url: req.body.url,
    image: req.body.image,
    venues_name: req.body.venues_name
  }
  Event.create(newEvent)
    .then(createdEvent => {
      User.findByIdAndUpdate(req.user._id, {
          $push: {
            favourites: createdEvent._id
          }
        })
        .then(() => res.redirect("/"))
    })
    .catch(err => console.log(err))
})

router.get("/myfavourites", (req, res) => {
  User.findById(req.user._id)
    .populate("favourites")
    .then(foundUser => {
      res.render("my-favourites", {
        foundUser
      })

    })
    .catch(err => console.log(err))
})

module.exports = router;