$(function(){
  $('#phoneNumber').intlTelInput({
      responsiveDropdown: true,
      autoFormat: true,
      utilsScript: '/intl-phone/libphonenumber/build/utils.js'
  });
  $('label.token_label').hide();
  $('input.token').hide();
  $('.btn_sendcode').click(function(){
    $('label.token_label').show();
    $('input.token').show();return;
    var id = $('#userid').val();
    var countryData = $("#phoneNumber").intlTelInput("getSelectedCountryData");
    var phoneNumber = $("#phoneNumber").val();
    // $('label.token_label').show();
    // $('input.token').show();
    $.ajax({
        url: '/auth/sendAuthyToken',
        type : 'GET',
        dataType: 'json',
        data: {
            userid:id,
            phoneNumber:phoneNumber,
            countryCode:countryData.dialCode
        },
        success:function(json){
          if (json.result){
            $('label.token_label').show();
            $('input.token').show();
            toastr.success(json.msg);
          }else{

            toastr.error(json.msg);
          }
        }
    });

  })
  // Intercept form submission and submit the form with ajax
  $('#contactForm').on('submit', function(e) {
      // Prevent submit event from bubbling and automatically submitting the
      // form

      e.preventDefault();

      // Call our ajax endpoint on the server to initialize the phone call

  });
})
