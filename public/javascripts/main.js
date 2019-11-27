function initMap() {
  var map = new google.maps.Map(document.getElementById("map"), {
    mapTypeControl: false,
    center: {
      lat: 40.4167,
      lng: -3.70325
    },
    zoom: 10
  });

  new AutocompleteDirectionsHandler(map);
  locateMe(map);
  getEvents(map)
}

/**
 * @constructor
 */
function AutocompleteDirectionsHandler(map) {
  this.map = map;
  this.originPlaceId = null;
  this.destinationPlaceId = null;
  this.travelMode = "WALKING";
  this.directionsService = new google.maps.DirectionsService();
  this.directionsRenderer = new google.maps.DirectionsRenderer();
  this.directionsRenderer.setMap(map);

  var originInput = document.getElementById("origin-input");
  var destinationInput = document.getElementById("destination-input");
  var modeSelector = document.getElementById("mode-selector");

  var originAutocomplete = new google.maps.places.Autocomplete(originInput);
  // Specify just the place data fields that you need.
  originAutocomplete.setFields(["place_id"]);

  var destinationAutocomplete = new google.maps.places.Autocomplete(
    destinationInput
  );
  // Specify just the place data fields that you need.
  destinationAutocomplete.setFields(["place_id"]);

  this.setupClickListener("changemode-walking", "WALKING");
  this.setupClickListener("changemode-transit", "TRANSIT");
  this.setupClickListener("changemode-driving", "DRIVING");

  this.setupPlaceChangedListener(originAutocomplete, "ORIG");
  this.setupPlaceChangedListener(destinationAutocomplete, "DEST");

  this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(originInput);
  this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(
    destinationInput
  );
  this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(modeSelector);
}

// Sets a listener on a radio button to change the filter type on Places
// Autocomplete.
AutocompleteDirectionsHandler.prototype.setupClickListener = function (
  id,
  mode
) {
  var radioButton = document.getElementById(id);
  var me = this;

  radioButton.addEventListener("click", function () {
    me.travelMode = mode;
    me.route();
  });
};

AutocompleteDirectionsHandler.prototype.setupPlaceChangedListener = function (
  autocomplete,
  mode
) {
  var me = this;
  autocomplete.bindTo("bounds", this.map);

  autocomplete.addListener("place_changed", function () {
    var place = autocomplete.getPlace();

    if (!place.place_id) {
      window.alert("Please select an option from the dropdown list.");
      return;
    }
    if (mode === "ORIG") {
      me.originPlaceId = place.place_id;
    } else {
      me.destinationPlaceId = place.place_id;
    }
    me.route();
  });
};

AutocompleteDirectionsHandler.prototype.route = function () {
  if (!this.originPlaceId || !this.destinationPlaceId) {
    return;
  }
  var me = this;

  this.directionsService.route({
      origin: {
        placeId: this.originPlaceId
      },
      destination: {
        placeId: this.destinationPlaceId
      },
      travelMode: this.travelMode
    },
    function (response, status) {
      if (status === "OK") {
        me.directionsRenderer.setDirections(response);
      } else {
        window.alert("Directions request failed due to " + status);
      }
    }
  );
};

function locateMe(map) {
  if (navigator.geolocation) {
    // Get current position
    // The permissions dialog will pop up
    navigator.geolocation.getCurrentPosition(
      function (position) {
        debugger;
        // Create an object to match Google's Lat-Lng object format
        const currentCoords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        new google.maps.Marker({
          position: currentCoords,
          map: map,
          title: "I am here"
        });

        map.panTo(currentCoords);

        // User granted permission
        // Center the map in the position we got
      },
      function () {
        // If something goes wrong
        console.log("Error in the geolocation service.");
      }
    );
  } else {
    // Browser says: Nah! I do not support this.
    console.log("Browser does not support geolocation.");
  }
}


initMap();





function player() {
  var tag = document.createElement('script');
  console.log(tag)

  tag.src = "https://www.youtube.com/AIzaSyDjDRv5gGCPnJIHje3XIh4BClc6xdNMJ5U";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag); /* */

  var player;

  function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
      height: '390',
      width: '640',
      videoId: 'M7lc1UVf-VE',
      //aqui va playVars playerVars: { 'autoplay': 0, 'controls': 1, 'playlist':['your_video_id', '...']},
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    });
  }

}

player()






function getEvents(map) {
  axios.get('https://app.ticketmaster.com/discovery/v2/events.json?city=madrid&&sort=date,asc&apikey=4PkIm4wGJG9ZWAv3XAqPzsWngGoE0GHV')
    .then(payload => {
      // console.log(payload.data)
      payload.data._embedded.events.forEach((event) => {
        let currentCoords = {
          lat: +event._embedded.venues[0].location.latitude,
          lng: +event._embedded.venues[0].location.longitude
        };
        new google.maps.Marker({
          position: currentCoords,
          map: map,
          // icon:'https://image.flaticon.com/icons/png/512/122/122320.png',
        })
      });

    });

  getList();

}

function getList() {
  axios.get('https://app.ticketmaster.com/discovery/v2/events.json?city=madrid&&sort=date,asc&apikey=4PkIm4wGJG9ZWAv3XAqPzsWngGoE0GHV')
    .then(payload => {
      var artists = []

      console.log(payload.data._embedded.events[0].name)


      payload.data._embedded.events.forEach((event) => {
        let artistName = event.name;
        artists.push(artistName);
      });

      function printList() {
        let ul = document.createElement('ul');
        document.getElementById('artistList').appendChild(ul);

        artists.forEach((artist) => {
        let li = document.createElement('li');
        ul.appendChild(li);
      
        li.innerHTML += artist;
        })
      }
      printList();
    });
}
