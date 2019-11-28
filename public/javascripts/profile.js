function player() {
  let tag = document.createElement("script");
  console.log(tag);

  tag.src = "https://www.youtube.com/AIzaSyAuKj9DeZEZw9hrK1Z52vCu0YZ2ULGyTSY";
  let firstScriptTag = document.getElementsByTagName("script")[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  function onYouTubeIframeAPIReady() {
    player = new YT.Player("player", {
      height: "390",
      width: "640",
      videoId: "M7lc1UVf-VE",
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange
      }
    });
  }
}

function getArtistName() {
  axios
    .get(
      "https://app.ticketmaster.com/discovery/v2/events.json?city=madrid&&sort=date,asc&apikey=4PkIm4wGJG9ZWAv3XAqPzsWngGoE0GHV"
    )
    .then(payload => {
      payload.data._embedded.events.forEach(eventDetail => {
        let ul = document.createElement("ul"); // lo que vas a hacer

      });
    })
    .catch(err => console.log(err));
}

getArtistName();

// console.log(payload.data._embedded.events[0])
// console.log(payload.data._embedded.events[0].name)
// console.log(payload.data._embedded.events[0].id)
// console.log(payload.data._embedded.events[0].dates.start.localDate)
// console.log(payload.data._embedded.events[0].dates.start.localTime)
// console.log(payload.data._embedded.events[0].url)
// console.log(payload.data._embedded.events[0].images[0].url)
// console.log(payload.data._embedded.events[0]._embedded.venues[0].name)