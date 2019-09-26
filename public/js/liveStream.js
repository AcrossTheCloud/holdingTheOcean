var liveStream = function() {
  var autoplay = false;
  if ($(window).width() > 480) {
    autoplay = true;
  }

  $('#livestream .watchnow').fadeIn();
  $('#liveStreamModal').modal(true);
  $('#liveStreamModal iframe').attr('src', 'https://player.twitch.tv/?client-id=brdrlyou2po431ot4owmi1zzjn6n0x&channel=oceanspaceorg&muted=false&autoplay=' + autoplay).fadeIn();
};

$(document).ready(function() {
  $.ajax({
    type: 'GET',
    url: 'https://api.twitch.tv/helix/streams?user_login=acrossthecloud',
    headers: {
      "Accept":"application/vnd.twitchtv.v5+json",
      "Client-ID":"brdrlyou2po431ot4owmi1zzjn6n0x"
    }
  })
    .done( function(response) {
      if (response.data.length > 0) liveStream();
    });

  // On modal hide remove the src from iframe
  $('#liveStreamModal').on('hide.bs.modal', function() {
    $('#liveStreamModal iframe').attr('src', '').hide();
  });


  var $livestream = $('#livestream');

  // Add sticky on ready so we have the correct distance from the top of page.
  $livestream.css({
    position: "sticky"
  });

  var checkDistance = function () {
    var distance = $livestream.offset().top - 20;
    if ($(window).scrollTop() >= distance) {
      $livestream.addClass('stuck');
    } else {
      var timeout;
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(function() {
        $livestream.removeClass('stuck');
      }, 100);
    }
  };

  checkDistance();
  $(window).scroll(function() {
    checkDistance();
  });
});
