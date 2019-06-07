$(function() {
  OA_Logo_Lucid_Code();
  loadVideos();

  var $collabForm = $('form#collab');
  $collabForm.submit(function (e) {
    e.preventDefault();
    if($('#collab_agree').prop('checked')) {

      var
        $collab_name = $('#collab_name'),
        $collab_name_value = $collab_name.val();
      if (isBlank($collab_name.val())) {
        $('#collab_name, label[for="collab_name"]').addClass('shake');
        return;
      }

      var
        $collab_email = $('#collab_email'),
        $collab_email_value = $collab_email.val();
      if (!isEmail($collab_email.val())) {
        $('#collab_email, label[for="collab_email"]').addClass('shake');
        return;
      }

      var
        $collab_institution = $('#collab_institution'),
        $collab_institution_value = $collab_institution.val();
      if (isBlank($collab_institution.val())) {
        $('#collab_institution, label[for="collab_institution"]').addClass('shake');
        return;
      }

      var
        $collab_location = $('#collab_location'),
        $collab_location_value = $collab_location.val();
      if (isBlank($collab_location.val())) {
        $('#collab_location, label[for="collab_location"]').addClass('shake');
        return;
      }
      var
        $collab_message = $('#collab_message'),
        $collab_message_value = $collab_message.val();
      if (isBlank($collab_message.val())) {
        $('#collab_message, label[for="collab_message"]').addClass('shake');
        return;
      }

      var body = {
        "name": $collab_name_value,
        "email": $collab_email_value,
        "location": $collab_location_value,
        "institution": $collab_message_value,
        "message": $collab_message_value,
        "type": 'collaboration'
      };

      // Send form
      $.ajax({
        type:'POST',
        url: 'https://zey5d25xk6.execute-api.eu-central-1.amazonaws.com/dev/email',
        data: JSON.stringify(body),
        contentType: 'application/json'
      }).done(function(data){
        if(data.error){
          $('#collabform .message p').html('Oops, looks like we\'ve had an issue!');
        }
      }).fail(function(data){
        $('#collabform .message p').html('Oops, looks like we\'ve had an issue!');
      });

      $('form#collab').animate(
        {
          opacity: 0,
          height: 0
        },
        2000,
        function() {
          $('#collabform .message').fadeIn('slow');
        }
      );

    } else {
      var $agreeBoxContainer = $collabForm.find('.custom-checkbox .col-12');
      $agreeBoxContainer.addClass('shake');
    }

    setTimeout(function () {
      $('.shake').removeClass('shake')
    }, 1000);
  });

  var $aboutForm = $('form#aboutForm');
  $aboutForm.submit(function (e) {
    e.preventDefault();
    if($('#about_agree').prop('checked')) {

      var
        $about_email = $('#about_email'),
        $about_email_value = $about_email.val();
      if (!isEmail($about_email.val())) {
        $('#about_email, label[for="about_email"]').addClass('shake');
        return;
      }

      var body = {
        "name": "",
        "email": $about_email_value,
        "location": "",
        "institution": "",
        "message": "",
      };

      // Send form
      $.ajax({
        type: 'POST',
        url: 'https://zey5d25xk6.execute-api.eu-central-1.amazonaws.com/dev/email',
        data: JSON.stringify(body),
        contentType: 'application/json',
      }).done(function (data) {
        if (data.error) {
          $('#about .message p').html('Oops, looks like we\'ve had an issue!');
        }
      }).fail(function (data) {
        $('#about .message p').html('Oops, looks like we\'ve had an issue!');
      });

      $('form#aboutForm, #about .receive').animate(
        {
          opacity: 0,
          height: 0
        },
        2000,
        function() {
          $('#about .message').fadeIn('slow');
        }
      );

    } else {
      var $agreeBoxContainer = $collabForm.find('.custom-checkbox .col-12');
      $agreeBoxContainer.addClass('shake');
    }

    setTimeout(function () {
      $('.shake').removeClass('shake')
    }, 1000);
  });

});


function OA_Logo_Lucid_Code() {
  setTimeout(function() {
    $('#logo .left, #logo .right').addClass('init');
  }, 2750);  //2750
}

function loadVideos() {
  var
    windowWidth = $(window).width(),
    $video = $('#video video');

  if (windowWidth >= 768 && windowWidth < 992) {

    $('#video .mp4').attr('src', 'https://streaming.ocean-archive.org/media/720_OA_trailer.mp4');
    $('#video .webm').attr('src', 'https://streaming.ocean-archive.org/media/720_OA_trailer.webm');
  } else if (windowWidth >= 992 ) {

    $('#video .mp4').attr('src', 'https://streaming.ocean-archive.org/media/OA_trailer.mp4');
    $('#video .webm').attr('src', 'https://streaming.ocean-archive.org/media/OA_trailer.webm');

  }

  $video[0].load();
  $video[0].play();
}

function isBlank(str) {
  return (!str || /^\s*$/.test(str));
}

function isEmail(email) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}
