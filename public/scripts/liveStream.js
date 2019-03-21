var liveStream = function() {
  var autoplay = false;
  if ($(window).width() > 480) {
    autoplay = true;
  }
  $('#livestreamVideoContainer .videoContainer iframe').attr('src', 'https://player.twitch.tv/?client-id=brdrlyou2po431ot4owmi1zzjn6n0x&channel=oceanspaceorg&muted=true&autoplay=' + autoplay).fadeIn();
  $('#livestreamVideoContainer .overlay').stop().fadeOut();
  $('body').addClass('liveStreamOpen');
};

var liveStreamButtonEvent = function(streaming) {
  $(document).on('click', '#livestream, .livestreamButton', function () {
    $('.videoLinks div.active').removeClass('active');
    $('.videoLinks div.livestreamButton').addClass('active');

    closeJoanJonas(function () {
      closeVideoSection(function () {

        if (streaming) liveStream();

        $('#livestreamVideoContainer')
          .addClass('open')
          .stop()
          .fadeIn(1000);


        $('#livestreamVideoContainer .overlay').stop().fadeOut();
        $('body').addClass('liveStreamOpen');
      });
    });
  });
};

$(document).ready(function() {
  var
    $liveStreamContainer = $('#livestream');

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
        $('#livestreamVideoContainer .placeholder').hide();

        if (response.data[0].title) {
          $('#livestream .streamTitle').html(' | ' + response.data[0].title);
          $('#livestream .titlewrap .wrapper').addClass('marquee');

          // offset body by 31px the Marquee
          $('body').addClass('livestream');
        }
        $liveStreamContainer.stop().fadeIn();

        liveStreamButtonEvent(true);
      } else {
        liveStreamButtonEvent(false);
      }
    })
    .fail(function () {
      liveStreamButtonEvent(false);
    });
});

function closeLiveStream(callback) {
  $('#livestreamVideoContainer')
    .stop()
    .fadeOut(1000, function() {
      $('body').removeClass('liveStreamOpen');
      $('#livestreamVideoContainer .videoContainer iframe').attr('src', '').hide();
      $(this).removeClass('open');

      if (typeof callback === 'function') callback();

    });
}
