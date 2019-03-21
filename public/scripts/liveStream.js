var liveStream = function() {
  var autoplay = false;
  if ($(window).width() > 480) {
    autoplay = true;
  }
  $('#livestreamVideoContainer .videoContainer iframe').attr('src', 'https://player.twitch.tv/?client-id=brdrlyou2po431ot4owmi1zzjn6n0x&channel=oceanspaceorg&muted=true&autoplay=' + autoplay);
  $('#livestreamVideoContainer .overlay').fadeOut();
  $('body').addClass('liveStreamOpen');
};

$(document).ready(function() {
  var
    $liveStreamContainer = $('#livestream'),
    $livestreamVideoContainer = $('#livestreamVideoContainer');

  $('#livestreamVideoContainer .videoContainer iframe').on('load', function() {
    $('#livestreamVideoContainer .overlay').fadeOut(function() {
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
        $('#livestreamVideoContainer .placeholder').hide();

        if (response.data[0].title) {
          $('#livestream .streamTitle').html(' | ' + response.data[0].title);
          $('#livestream .titlewrap .wrapper').addClass('marquee');

          // offset body by 31px the Marquee
          $('body').addClass('livestream');
        }
        $liveStreamContainer.fadeIn();

        $(document).on('click', '#livestream, .livestreamButton', function () {
          closeJoanJonas( function() {
            closeVideoSection(function () {
              liveStream();
              $livestreamVideoContainer
                .addClass('open')
                .fadeIn(1000);
            });
          });
        });
      } else {
        $(document).on('click', '#livestream, .livestreamButton', function () {
          closeJoanJonas(function () {
            closeVideoSection(function () {
              $livestreamVideoContainer
                .addClass('open')
                .fadeIn(1000);


              $('#livestreamVideoContainer .overlay').fadeOut();
              $('body').addClass('liveStreamOpen');
            });
          });
        });
      }
    });
});

function closeLiveStream(callback) {
  $('#livestreamVideoContainer')
    .fadeOut(1000, function() {
      $('body').removeClass('liveStreamOpen');
      $('#livestreamVideoContainer .videoContainer iframe').attr('src', '').hide();
      $(this).removeClass('open');

      if (typeof callback === 'function') callback();

    });
}
