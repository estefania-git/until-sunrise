function initMap() {
  var map = new google.maps.Map(document.getElementById("map"), {
    mapTypeControl: false,
    center: { lat: 41.3977381, lng: 2.190471916 },
    zoom: 13
  });

  new AutocompleteDirectionsHandler(map);
  // locateMe(map);
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
AutocompleteDirectionsHandler.prototype.setupClickListener = function(
  id,
  mode
) {
  var radioButton = document.getElementById(id);
  var me = this;

  radioButton.addEventListener("click", function() {
    me.travelMode = mode;
    me.route();
  });
};

AutocompleteDirectionsHandler.prototype.setupPlaceChangedListener = function(
  autocomplete,
  mode
) {
  var me = this;
  autocomplete.bindTo("bounds", this.map);

  autocomplete.addListener("place_changed", function() {
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

AutocompleteDirectionsHandler.prototype.route = function() {
  if (!this.originPlaceId || !this.destinationPlaceId) {
    return;
  }
  var me = this;

  this.directionsService.route(
    {
      origin: { placeId: this.originPlaceId },
      destination: { placeId: this.destinationPlaceId },
      travelMode: this.travelMode
    },
    function(response, status) {
      if (status === "OK") {
        me.directionsRenderer.setDirections(response);
      } else {
        window.alert("Directions request failed due to " + status);
      }
    }
  );
};

// function locateMe(map) {
//   if (navigator.geolocation) {
//     console.log("hola");
//     axios.get('https://app.ticketmaster.com/discovery/v2/events.json?city=madrid&{latlong:40.416775, -3.703790}&sort=date,asc&apikey=4PkIm4wGJG9ZWAv3XAqPzsWngGoE0GHV')
//     .then(payload => {
//       console.log("hola2");
//       console.log(payload.data._embeded.events[0]._embeded);
  
//       const currentCoords = {
//         lat: payload.data._embeded.events[0]._embeded.venues[0].location.latitude,
//         lng: payload.data._embeded.events[0]._embeded.venues[0].location.longitude
//       };
//           new google.maps.Marker({
//             position: currentCoords,
//             map: map,
//             title: "I am here",
//             marker: marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png')
//           })  
//       });
//   } else {
//     console.log("Browser does not support geolocation.");
//   }
// }

initMap();

// function getEvents() {
//   console.log("hola");
//   axios.get('https://app.ticketmaster.com/discovery/v2/events.json?city=madrid&{latlong:40.416775, -3.703790}&sort=date,asc&apikey=4PkIm4wGJG9ZWAv3XAqPzsWngGoE0GHV')
//   .then(payload => {
//     console.log("hola2");
//     console.log(payload.data);
//     let numberOfEvents = payload.page.totalElements;
//     let showsNear = [];

//     for(var i=0; i < payload.page.size; i++) {
//       let event = {
//         name: payload._embedded.events[i].name,
//         latitude: payload._embedded.venues[0].location.latitude,
//         longitude: payload._embedded.venues[0].location.longitude
//       }
//       showsNear.push(event);
//     }

//     navigator.geolocation.getCurrentPosition(function(position){
//       var map = new google.maps.Map(mapDiv, {
//         center: {lat: position.coords.latitude, lng: position.coords.longitude},
//         zoom: 10
//       });

//       showsNear.forEach(eventNear => {
//         var marker = new google.maps.Marker({
//           position: new google.maps.LatLng(eventNear.latitude, eventNear.longitude),
//           map: map
//         });
//         marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');  
//       });
    
//     });

//   })
// }

// getEvents();

function getEvents(map) {
  axios.get('https://app.ticketmaster.com/discovery/v2/events.json?city=madrid&{latlong:40.416775, -3.703790}&sort=date,asc&apikey=4PkIm4wGJG9ZWAv3XAqPzsWngGoE0GHV')
  .then(payload => {

    payload.data._embedded.events.forEach( (event)=> {
      let currentCoords = {
        lat: +event._embedded.venues[0].location.latitude,
        lng: +event._embedded.venues[0].location.longitude
      };
      new google.maps.Marker({
        position: currentCoords,
        map: map
        // icon:'http://google-maps-icons.googlecode.com/files/sailboat-tourism.png',
      })  
    });

    });
}

// getEvents();