function player() {
  var tag = document.createElement("script");
  console.log(tag);

  tag.src = "https://www.youtube.com/AIzaSyDjDRv5gGCPnJIHje3XIh4BClc6xdNMJ5U";
  var firstScriptTag = document.getElementsByTagName("script")[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag); /* */

  var player;

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

function searchByKeyword() {
  let results = YouTube.Search.list("id,snippet", {
    q: "",
    maxResults: 25
  });
  for (let i in results.items) {
    let item = results.items[i];
    Logger.log("[%s] Title: %s", item.id.videoId, item.snippet.title);
  }
}

player();
