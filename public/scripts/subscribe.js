$(document).ready(function(){

  $('#followForm').submit(function(e){
    e.preventDefault();
    var $form = $(this),
        name = $form.find('input[name="name"]').val(),
        email = $form.find('input[name="email"]').val(),
        url = $form.attr('action'),
        type = $('.option-item.active').data('value');
    var body = { name, email, type}
    postToMailer(body, url);
    });


    $('#contributeForm').submit(function(e){
      e.preventDefault();
      var $form = $(this),
          name = $form.find('input[name="name"]').val(),
          email = $form.find('input[name="email"]').val(),
          url = $form.attr('action'),
          type = $('.option-item.active').data('value');
      var body = { name, email, type}
      postToMailer(body, url);
      });

});




function postToMailer(payload, url){
    console.log('[helloooooo] ------ ', payload);

    var fields = [payload.name, payload.email, payload.type]
    for(var i = 0; i< fields.length; i++){
      var value = fields[i]
      if(isBlank(value)){
        $('input').eq(i).siblings('.marker').eq(i).addClass('marker-error')
        $('input#send').addClass('error');
        $('.error-message').show();
      }
    }
    var fieldEmpty = $('input#send').hasClass('error');
    var validatedEmail = isEmail(payload.email);

    if( validatedEmail && !fieldEmpty){
        $.ajax({
          type:'POST',
          url: url,
          data: JSON.stringify(payload),
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
