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
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    });
  }

}

player()