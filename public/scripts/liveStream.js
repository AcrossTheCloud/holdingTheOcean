var liveStream = function() {
  var autoplay = false;
  if ($(window).width() > 480) {
    autoplay = true;
  }
  $('video#bgVideo').fadeTo(1000, 0).get(0).pause();
  $('#livestreamVideoContainer .videoContainer iframe').attr('src', 'https://player.twitch.tv/?client-id=brdrlyou2po431ot4owmi1zzjn6n0x&channel=oceanspaceorg&muted=false&autoplay=' + autoplay).fadeIn();
  $('#livestreamVideoContainer .overlay').fadeOut();
  $('body').addClass('liveStreamOpen');
};

var liveStreamButtonEvent = function(streaming) {
  $(document).on('click', '#livestream, .livestreamButton', function () {
    if(!buttonClickTimeout) setButtonClickTimeout();
    else return;

    var shareID = $(this).data('share')
    shareLinks(shareID);
    $('.videoLinks div.active').removeClass('active');
    $('.videoLinks div.livestreamButton').addClass('active');
    $('#shareIcons').delay(1000).show()

    closeJoanJonas(function () {
      closeVideoSection(function () {

        if (streaming) liveStream();

        $('#livestreamVideoContainer')
          .addClass('open')

          .fadeIn(1000);


        $('#livestreamVideoContainer .overlay').fadeOut();
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
        $liveStreamContainer.fadeIn();

        liveStreamButtonEvent(true);
      } else {
        liveStreamButtonEvent(false);
        $('body').addClass('no_livestream');
      }
    })
    .fail(function () {
      liveStreamButtonEvent(false);
      $('body').addClass('no_livestream');
    });
});

function closeLiveStream(callback) {
  $('#livestreamVideoContainer').fadeOut(1000, function() {
      $('body').removeClass('liveStreamOpen');
      $('video#bgVideo').fadeTo(1000, 1).get(0).play();
      $('#livestreamVideoContainer .videoContainer iframe').attr('src', '').hide();
      $(this).removeClass('open');
      $('#shareIcons').hide();

      if (typeof callback === 'function') callback();

    });
}
