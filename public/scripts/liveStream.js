var liveStream = function() {
  var autoplay = false;
  if ($(window).width() > 480) {
    autoplay = true;
  }

  $('#livestreamVideoContainer .videoContainer iframe').attr('src', 'https://player.twitch.tv/?client-id=brdrlyou2po431ot4owmi1zzjn6n0x&channel=oceanspaceorg&muted=true&autoplay=' + autoplay);
};

$(document).ready(function() {
  var
    $liveStreamContainer = $('#livestream'),
    $livestreamVideoContainer = $('#livestreamVideoContainer');

  $('#livestreamVideoContainer .videoContainer iframe').on('load', function() {
    $('#livestreamVideoContainer .loader').fadeOut(function() {
      $('#livestreamVideoContainer .videoContainer iframe').fadeIn();

    });
  });

  $.ajax({
    type: 'GET',
    url: 'https://api.twitch.tv/helix/streams?user_login=oceanspaceorg',
    headers: {
      "Accept":"application/vnd.twitchtv.v5+json",
      "Client-ID":"brdrlyou2po431ot4owmi1zzjn6n0x"
    }
  })
    .done( function(response) {
      if (response.data.length > 0) {

        if (response.data[0].title) {
          $('#livestream .streamTitle').html(' | ' + response.data[0].title);
          $('#livestream .titlewrap .wrapper').addClass('marquee');

          // offset body by 31px the Marquee
          $('body').addClass('livestream');
        }
        $liveStreamContainer.fadeIn();

        $liveStreamContainer.on('click', function () {
          liveStream();

          $livestreamVideoContainer
            .addClass('open')
            .fadeIn(1000);
        });

        $('#livestreamVideoContainer .backTo').on('click', function () {
          closeLiveStream();
        });
      }
    });
});

function closeLiveStream() {
  $('#livestreamVideoContainer')
    .fadeOut(1000, function() {
      $('#livestreamVideoContainer .loader').show();
      $('#livestreamVideoContainer .videoContainer iframe').attr('src', '').hide();
      $(this).removeClass('open');
    });
}
