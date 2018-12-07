
var errorMessage = {
    email: 'please enter correct email',
    general: 'Oh no! Something went wrong.',
    network: 'ops. network error, email us please.'
}


$(document).ready(function(){

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
        $('.error-message').text('please enter corrent email').show();
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

      var body = {name, email, subject, message, type}
      if(isEmail(email)){
          postToMailer(body, url);
      }else{
          $('.error-message').text(errorMessage.email).show();
      }
  });

});



function postToMailer(body, url){

    var fieldEmpty = false;
    $.each(body, function(key, value) {
        console.log(key, value);
        if(isBlank(value)){
          $(`[name=${key}]`).addClass('error');
          $('input#send').addClass('error');
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
            console.log('POST to subscribe done: ', data)
            if(data.error){
                $('.error-message').text(data.error).show();
            }else{
                $('input#send').addClass('success');
                $('.success-message').show();
                $('input').val('');
                 $('textarea').val('');
            }

       }).fail(function(data){
           console.log('POST to subscribe FAILED: ', data)

           $('input#send').addClass('error');
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
