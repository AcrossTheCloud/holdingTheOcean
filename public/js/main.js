$(function() {
  OA_Logo_Lucid_Code();
  loadBanners();

  var $collabForm = $('form#collab');
  $collabForm.submit(function (e) {
    e.preventDefault();
    // if($('#collab_agree').prop('checked')) {

      var
        $collab_name = $('#collab_name'),
        $collab_name_value = $collab_name.val(),
        $collab_email = $('#collab_email'),
        $collab_email_value = $collab_email.val(),
        $collab_institution = $('#collab_institution'),
        $collab_institution_value = $collab_institution.val(),
        $collab_location = $('#collab_location'),
        $collab_location_value = $collab_location.val(),
        $collab_message = $('#collab_message'),
        $collab_message_value = $collab_message.val();

      if (isBlank($collab_name.val())) {
        $('#collab_name, label[for="collab_name"]').addClass('shake');
      } else if (!isEmail($collab_email.val())) {
        $('#collab_email, label[for="collab_email"]').addClass('shake');
      } else if (isBlank($collab_institution.val())) {
        $('#collab_institution, label[for="collab_institution"]').addClass('shake');
      } else if (isBlank($collab_location.val())) {
        $('#collab_location, label[for="collab_location"]').addClass('shake');
      } else if (isBlank($collab_message.val())) {
        $('#collab_message, label[for="collab_message"]').addClass('shake');
      } else {
        var body = {
          "name": $collab_name_value,
          "email": $collab_email_value,
          "location": $collab_location_value,
          "institution": $collab_institution_value,
          "message": $collab_message_value,
          "type": "collaboration"
        };

        // Send form
        $.ajax({
          type:'POST',
          url: 'https://api.ocean-archive.org/email',
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
      }

    // } else {
    //   var $agreeBoxContainer = $collabForm.find('.custom-checkbox .col-12');
    //   $agreeBoxContainer.addClass('shake');
    // }

    setTimeout(function () {
      $('.shake').removeClass('shake')
    }, 1500);
  });

  $('form#aboutForm').submit(function (e) {
    e.preventDefault();
    // if($('#about_agree').prop('checked')) {

      var
        $about_email = $('#about_email'),
        about_email_value = $about_email.val(),
        $about_name = $('#about_name'),
        about_name_value = $about_name.val();

    if (isBlank(about_name_value)) {
      $('#about_email, label[for="about_name"]').addClass('shake');
    } else if (!isEmail($about_email.val())) {
      $('#about_email, label[for="about_email"]').addClass('shake');
    } else {
      var body = {
        "name": about_name_value,
        "email": about_email_value,
        "type": "subscription"
      };

      // Send form
      $.ajax({
        type: 'POST',
        url: 'https://api.ocean-archive.org/email',
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
    }

    // } else {
    //   var $agreeBoxContainer = $collabForm.find('.custom-checkbox .col-12');
    //   $agreeBoxContainer.addClass('shake');
    // }

    setTimeout(function () {
      $('.shake').removeClass('shake');

    }, 1500);
  });

  $('form#aboutForm_1').submit(function (e) {
    e.preventDefault();
    // if($('#about_agree').prop('checked')) {

      var
        $about_email = $('#about_email_1'),
        about_email_value = $about_email.val(),
        $about_name = $('#about_name_1'),
        about_name_value = $about_name.val();

    if (isBlank(about_name_value)) {
      $('#about_email_1, label[for="about_name_1"]').addClass('shake');
    } else if (!isEmail($about_email.val())) {
      $('#about_email_1, label[for="about_email_1"]').addClass('shake');
    } else {
      var body = {
        "name": about_name_value,
        "email": about_email_value,
        "type": "subscription"
      };

      // Send form
      $.ajax({
        type: 'POST',
        url: 'https://api.ocean-archive.org/email',
        data: JSON.stringify(body),
        contentType: 'application/json',
      }).done(function (data) {
        if (data.error) {
          $('#about .message p').html('Oops, looks like we\'ve had an issue!');
        }
      }).fail(function (data) {
        $('#about .message p').html('Oops, looks like we\'ve had an issue!');
      });

      $('form#aboutForm_1, #about .receive').animate(
        {
          opacity: 0,
          height: 0
        },
        2000,
        function() {
          $('#about .message').fadeIn('slow');
        }
      );
    }

    // } else {
    //   var $agreeBoxContainer = $collabForm.find('.custom-checkbox .col-12');
    //   $agreeBoxContainer.addClass('shake');
    // }

    setTimeout(function () {
      $('.shake').removeClass('shake')
    }, 1500);
  });

});


function OA_Logo_Lucid_Code() {
  setTimeout(function() {
    $('#logo .left, #logo .right').addClass('init');
  }, 2750);  //2750
}

var bannerIdx;
var bannerSrcs = ['img/Livestream_STM_1920_Tunein_fx.png','img/Livestream_PO_1920_Tunein.png','img/Livestream_OAintro_1920_tunein.png'];

function loadBanners() {
  bannerIdx = Math.floor(Math.random()*bannerSrcs.length);

  var banner = bannerSrcs[bannerIdx];

  $('#bannerContainer img').attr('src', banner);
  $('#bannerContainer .background').attr('style', 'background-image: url(' + banner + ')');

  setInterval(() => {
    bannerIdx = (bannerIdx + 1) % bannerSrcs.length;
    banner = bannerSrcs[bannerIdx];
    $('#bannerContainer img').attr('src', banner);
    $('#bannerContainer .background').attr('style', 'background-image: url(' + banner + ')');
  },30000);
}

function isBlank(str) {
  return (!str || /^\s*$/.test(str));
}

function isEmail(email) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}
