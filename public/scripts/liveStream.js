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

    $('.videoLinks div.active').removeClass('active');
    $('.videoLinks div.livestreamButton').addClass('active');

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
        checkEventsSchedule();
      }
    })
    .fail(function () {
      liveStreamButtonEvent(false);
      $('body').addClass('no_livestream');
      checkEventsSchedule();
    });
});

function closeLiveStream(callback) {
  $('#livestreamVideoContainer')

    .fadeOut(1000, function() {
      $('body').removeClass('liveStreamOpen');
      $('video#bgVideo').fadeTo(1000, 1).get(0).play();
      $('#livestreamVideoContainer .videoContainer iframe').attr('src', '').hide();
      $(this).removeClass('open');

      if (typeof callback === 'function') callback();

    });
}

function checkEventsSchedule() {
  $.getJSON('../livestream.json?v=1.4.0', function (data) {
    var
      dateOffsetInUTC = function (utcOffset) {
        var
          currentDate = new Date(),
          utc = currentDate.getTime() + (currentDate.getTimezoneOffset() * 60000);

        return new Date(utc + (3600000 * utcOffset));
      },
      daySuffix = function (dateNumber) {
        var suffix = "";
        switch(dateNumber) {
          case 1: case 21: case 31: suffix = 'st'; break;
          case 2: case 22: suffix = 'nd'; break;
          case 3: case 23: suffix = 'rd'; break;
          default: suffix = 'th';
        }
        return dateNumber + suffix;
      },
      hourMinute = function(time) {
        return time.split(':')
      },
      monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ],
      currentDateUTC = dateOffsetInUTC("+2");

    $.each(data, function(index, event) {
      var
        eventStartDate = event.date,
        startTime = hourMinute(event.start_time);
      eventStartDate = new Date(eventStartDate);
      eventStartDate.setHours(startTime[0], startTime[1] ? startTime[1] : '');

      var
        eventEndDate = event.date,
        endTime = hourMinute(event.end_time);
      eventEndDate = new Date(eventEndDate);
      // If the end time is lower we assume it's the next day (eg, start 11pm end 12:30)
      if (endTime[0] < startTime[0]) {
        eventEndDate.setDate(eventEndDate.getDate() + 1);
      }
      eventEndDate.setHours(endTime[0], endTime[1] ? endTime[1] : '');
      var eventTitle = event.title ? ' ' + event.title.toUpperCase() + ' ' : '';


      if(eventEndDate >= currentDateUTC <= eventStartDate) {
        if (eventEndDate >= currentDateUTC) {
          $('#livestreamVideoContainer .r').text(
            // $('body').text(
            ' - '
            + daySuffix(eventStartDate.getDate()) +
            ' ' + monthNames[eventStartDate.getMonth()] + ' ' + eventStartDate.getFullYear() + eventTitle);
          // Break on the first one that has a date higher than now.
          return false;
        }
      }
    });
  });
}
