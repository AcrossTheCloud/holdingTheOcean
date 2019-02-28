
var errorMessage = {
    email: 'Please enter a valid email address',
    general: 'Oh no! Something went wrong.',
    network: 'Pps. network error, email us please.'
};

$(document).ready(function(){
  // Check if we're opting into the mailing list
  if(getUrlParameterName() === "key" && getUrlParameterValue('key')) {
    openFullScreen('doubleOptIn');
  }
  // Check if we're unsubscribeing
  if(getUrlParameterName() === "unsubscribe" || getUrlParameterName() === "email" || getUrlParameterValue('email')) {
    openFullScreen('unsubscribe');
    $('#unsubscribe input').val(getUrlParameterValue('email'));
  }

  $.ajaxSetup({
    headers:{
      "Content-Type": "application/json",
    }
  });

  $('#followForm').submit(function(e){
    e.preventDefault();
    $('.message span').hide();
    var $form = $(this),
        name = $form.find('input[name="name"]').val(),
        email = $form.find('input[name="email"]').val(),
        url = $form.attr('action'),
        type = $('.option-item.active').data('value');
    var body = {name, email, type};

    if(isEmail(email)){
        postToMailer(body, url);
    }else{
        $('.error-message').text(errorMessage.email).show();
    }

    });


    $('#contributeForm').submit(function(e){
      e.preventDefault();
      $('.message span').hide();
      var $form = $(this),
          name = $form.find('input[name="name"]').val(),
          email = $form.find('input[name="email"]').val(),
          subject = $form.find('input[name="subject"]').val(),
          message = $form.find('textarea[name="message"]').val(),
          url = $form.attr('action'),
          type = $('.option-item.active').data('value');

      var body = {name, email, subject, message, type};
      if(isEmail(email)){
          postToMailer(body, url);
      }else{
          $('.error-message').text(errorMessage.email).show();
      }
  });

});

function optIn(name, email, callback) {
  $.ajax({
    type:'POST',
    url: 'https://ryuga4srzh.execute-api.ap-southeast-2.amazonaws.com/prod/optIn',
    data: JSON.stringify({
      name: name,
      email: email
    }),
    contentType: 'application/json'
  }).done(function(response) {
    if(response.message === "OK") {
      callback(true);
    }
  }).fail(function() {
    callback(false);
  });
}


function openFullScreen(id) {
  var $element = $('#' + id);
  $element.show();
  $element.animate({'opacity' : 1}, 'slow', '', function () {
    $(this).css('z-index', 999);
    $('header').removeClass('open');
  });
}
function closeFullScreen(id) {
  var $element = $('#' + id);
  $element.animate({'opacity' : 0}, 'slow','', function () {
    $(this).css('z-index', 0);
    $('header').removeClass('open');
  });
}

function doubleOptIn() {
  var hideContents = function(callback) {
    $('#doubleOptIn h2').fadeOut();
    $('#doubleOptIn .button.confirm').fadeOut(function () {
      if (typeof callback === "function") { return callback(); }
    });
  };

  hideContents(function () {
    $.ajax({
      type:'POST',
      url: 'https://ryuga4srzh.execute-api.ap-southeast-2.amazonaws.com/prod/doubleOptIn?key=' + getUrlParameterValue('key'),
      data: '',
      contentType: 'application/json'
    }).done(function(response) {
      if(response.message === "OK") {
        $('#doubleOptIn h2.title').html("You've successfully subscribed to our mailing list!").fadeIn();
        $('#doubleOptIn .button.backto').fadeIn(5000);

        // Remove the key from the URL
        window.history.replaceState({}, document.title, "/");
      }
    }).fail(function() {
      $('#doubleOptIn h2.error').fadeIn();

      setTimeout(function () {
        $('#doubleOptIn h2.error').fadeOut(function () {
          $('#doubleOptIn h2.title').fadeIn();
          $('#doubleOptIn .button.confirm').fadeIn();
        });
      },2000);
    });
  });
}

function unsubscribe() {
  var hideContents = function(callback) {
    $('#unsubscribe h2').fadeOut();
    $('#unsubscribe input').fadeOut();
    $('#unsubscribe .message span.error-message').fadeOut();
    $('#unsubscribe .button').fadeOut(function () {
      if (typeof callback === "function") { return callback(); }
    });
  };

  var email = $('#unsubscribe input').val();

  if(isBlank(email)) {
    $('#unsubscribe .message span.error-message').text('Please enter your email address').fadeIn();
    return;
  }

  if(!isEmail(email)) {
    $('#unsubscribe .message span.error-message').text('Please enter a valid email address').fadeIn();
    return;
  }


  hideContents(function () {
    $.ajax({
      type:'POST',
      url: 'https://ryuga4srzh.execute-api.ap-southeast-2.amazonaws.com/prod/unsubscribe',
      data: JSON.stringify({
        'email': email
      }),
      contentType: 'application/json'
    }).done(function(response) {
      if(response.message === "OK") {
        $('#unsubscribe h2.success').fadeIn(2000);
        $('#unsubscribe .button.backto').fadeIn(5000);

        // Remove the email param from the URL
        window.history.replaceState({}, document.title, "/");
      }
    }).fail(function() {
      $('#unsubscribe h2.error').fadeIn();
    });
  });
}

function postToMailer(body, url){

    var fieldEmpty = false;
    $.each(body, function(key, value) {
        console.log(key, value);
        if(isBlank(value)){
          $(`[name=${key}]`).addClass('error');
          $('input.send').addClass('error');
          $('.error-message').text(errorMessage.general).show();
          fieldEmpty = true;
        }
    });


    if( !fieldEmpty ){
        $.ajax({
          type:'POST',
          url: url,
          data: JSON.stringify(body),
          contentType: 'application/json'
        }).done(function(data){
            console.log('POST to subscribe done: ', data);
            if(data.error){
                $('.error-message').text(data.error).show();
            }else{
                $('input.send').addClass('success');
                $('.success-message').show();
                $('input[type="text"]').val('');
                $('input[type="email"]').val('');
                 $('textarea').val('');
            }

       }).fail(function(data){
           console.log('POST to subscribe FAILED: ', data);

           $('input.send').addClass('error');
           $('.error-network').show();
       })
   }
}



function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}

function isEmail(email) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}

function getUrlParameterValue(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  var results = regex.exec(location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}
function getUrlParameterName(name) {
  var regex = new RegExp('^[\\?&]([a-zA-Z0-9_.+-]+)');
  return regex.exec(location.search)[1];
}
