$(document).ready(function () {

  if(getUrlParameterName() === "share" && getUrlParameterValue('share')) {
    $('#share_' + getUrlParameterValue('share')).trigger('click');
  }

});
