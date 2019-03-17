var liveStream = function() {
  var autoplay = false;
  if ($(window).width() > 480) {
    autoplay = true;
  }

  return lity('<div class="iframe-container"> \
        <svg class="closebtn" onclick="closeNav()" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 18 18"><line class="lines" x2="17.68" y2="17.68"></line><line class="lines" x1="17.68" y2="17.68"></line></svg> \
        <iframe \
        src="https://player.twitch.tv/?client-id=brdrlyou2po431ot4owmi1zzjn6n0x&channel=oceanspaceorg&muted=true&autoplay=' + autoplay + '"\
        frameborder="0" \
        scrolling="no" \
        allowfullscreen="true"> \
        </iframe></div>');
}

$(document).ready(function() {
  $.ajax({
    type: 'GET',
    //url: 'https://api.twitch.tv/helix/streams?user_login=oceanspaceorg',
    url: 'https://api.twitch.tv/helix/streams?user_login=esl_csgo',
    headers: {
      "Accept":"application/vnd.twitchtv.v5+json",
      "Client-ID":"brdrlyou2po431ot4owmi1zzjn6n0x"
    }
  })
    .done( function(response) {
      if (response.data.length > 0) {
        var lity;

        var $liveStreamContainer = $('#livestream');
        if (response.data[0].title) { $('#livestream .title').html(response.data[0].title); }
        $liveStreamContainer.fadeIn();

        $liveStreamContainer.on('click', function () {
          lity = liveStream();
        });

        $(document).on('click', '.lity-content .closebtn', function () {
          lity.close();
        });
      }
    });
});
