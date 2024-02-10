( function($) {

  let ValidateCaptchaValue = false;

  /* Refferral redirection*/
  function getMentor(){
    let curUrl = window.location.href;
    let tempUrl = curUrl.indexOf('?') >=0 ? curUrl.split('?')[1] : '';
    tempUrl = tempUrl.indexOf('#') >=0 ? tempUrl.replace("#", "") : tempUrl;
    if(tempUrl.indexOf("utm_source=") !== -1){
      let regex = new RegExp('utm_source=');
      let newStr = tempUrl.replace(regex, '');
      tempUrl = newStr;
    }
    return tempUrl;
  }
  console.log(getMentor());

  let currentMentor = getMentor();
  if (currentMentor) {
    let newUrlLaunch = `https://launchpad.artyfact.art/noauth/?login&${currentMentor}`;
    $('#open-reg-launch').attr("href", newUrlLaunch);
    $('#open-reg-launch2').attr("href", newUrlLaunch);
  }

  function validateEmail(email) {
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,6})$/;
    if(reg.test(email) == false) {
      return false;
    } else {
      return true;
    }
  }

  registerModal.addEventListener("keydown", function(event) {
    if (event.keyCode == 13) {
      getRegister();
    }
  });

  loginModal.addEventListener("keydown", function(event) {
    if (event.keyCode == 13) {
      getajax();
    }
  });

  $(function() {
    $('#loginModal').on('shown.bs.modal', function () {
      $('#email-log').focus();
    }); 
    $('#registerModal').on('shown.bs.modal', function () {
      $('#name-reg').focus();
    }); 
  });
  
  function CheckPassword(pass) {
    let newPass = pass;
    if (pass.indexOf('&') != -1) {
      newPass = pass.replaceAll('&', '#777');
    }
    return newPass;
  }

  function CheckPasswordSymbol(pass) {
    var regExp = /.*[!,%,&,@@,#,$,^,*,?,_,~,+,=,',(,),|,\,.,/,{,},:,;,", ,',[\]]/;
    if(regExp.test(pass) === false) {
      return true;
    } else {
      return false;
    }
  }

  function ResetForm() {
    $('#email-log').val('');
    $('#password-log').val('');
    $('#name-reg').val('');
    $('#surname-reg').val('');
    $('#email-reg').val('');
    $('#pass-reg').val('');
    $('#passconf-reg').val('');
    $('#fp-email').val('');
    $('#yourname').val('');
    $('#youremail').val('');
    $('#yourmessage').val('');
    $('#DataCheck').prop('checked', false);
    $('#DepositCheck').prop('checked', false);
    $('#password-err').removeClass('has-error');
    $('#password-err').addClass('hidden');

    $('#name-err').addClass('hidden');
    $('#name-err').removeClass('has-error');
    $('#check-err').addClass('hidden');
    $('#check-err').removeClass('has-error');
    $('#surname-err').addClass('hidden');
    $('#surname-err').removeClass('has-error');
    $('#email-err').addClass('hidden');
    $('#email-err').removeClass('has-error');
    $('#password-err').addClass('hidden');
    $('#passconf-err').addClass('hidden');
    $('#validation-err').removeClass('has-error');
    $('#validation-err').addClass('hidden');

    $('#alert-log').addClass('hidden');
  }
  

  $(function() {
     $('#open-recovery').on('click', () => {
       $('#loginModal').modal('hide');
       $('#forgotModal').modal('show');
     });
     $('#open-reg').on('click', () => {
      $('#loginModal').modal('hide');
      $('#forgotModal').modal('hide');
      $('#registerModal').modal('show');
    });
  });

  /*LOGIN PROCESSING*/
  function getajax(){
    console.log('SEND Login');
    let sending = false;
    let LowEmail = $('#email-log').val();
    let LoginData = {
      Email: LowEmail.toLowerCase(),
      Bonus: $('#bonus-log').val(),
      BonusN: $('#bonus-num').val(),
      Password: $('#password-log').val()
    };
    if (LoginData.Email && LoginData.Password) {sending = true;}
    else {
      $('#alert-log').removeClass('hidden');
      $('#alert-log').html('Please fill the login form!');
    }

    if (sending) {
      $('#alert-log').addClass('hidden');

      xhr = new XMLHttpRequest();
      url = "https://artyfact.art/api-login.php";
      xhr.open("POST", url, true);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr.setRequestHeader("Access-Control-Allow-Origin", "*");

      let query = "email=" + LoginData.Email + "&password=" + LoginData.Password + "&bonus=" + LoginData.Bonus + "&bonusN=" + LoginData.BonusN;

      xhr.send(query);
      xhr.onreadystatechange = function () {
        console.log('result', xhr.responseText)
        if (xhr.readyState != 4) {
          return
        }

        if (xhr.status === 200) {
          console.log('result', xhr.responseText)
          if (xhr.responseText.indexOf('errors') >=0) {
            //let errorRes = JSON.parse(xhr.responseText);
            //console.log(errorRes);
            $('#alert-log').removeClass('hidden');
            $('#alert-log').html('User not found or password incorrect!');
          } else
            if (xhr.responseText.indexOf('token') >=0) {
              //console.log('TOKEN!');
              let start = xhr.responseText.indexOf('{"token"') + 10;
              let stop = xhr.responseText.indexOf('","__typename":"Token"');
              let token = xhr.responseText.slice(start, stop);
              //console.log(token);
              //localStorage.setItem('token', token);
              window.location = "https://launchpad.artyfact.art/token/" + token;
            }
        } else {
          console.log('err', xhr.responseText);
          //console.log(res);
        }
      };

    }
  }

  function GetGoogleCaptcha() {
    if (!grecaptcha.getResponse()) {
      ValidateCaptchaValue = false;
      return false; // возвращаем false и предотвращаем отправку формы
    } else {
      ValidateCaptchaValue = true;
      return true;
    }
  }

  /*REGISTER PROCESSING*/
  function getRegister() {
    
    console.log('SEND Register');
    $('#alert-reg').addClass('hidden');
    let sending = false;
    let sending2 = false;
    let sending3 = false;
    let LowEmail = $('#email-reg').val();
    let RegData = {
      Name: $('#name-reg').val(),
      Surname: $('#surname-reg').val(),
      Email: LowEmail.toLowerCase(),
      validateEmail: validateEmail($('#email-reg').val()),
      Password: $('#pass-reg').val(),
      PasswordConfirm: $('#passconf-reg').val(),
      Agent: getMentor(),
      Referrer: document.referrer ? document.referrer : '',
      DepositCheck: document.getElementById('DepositCheck'),
      DataCheck: document.getElementById('DataCheck'),
      //OfertaCheck: document.getElementById('OfertaCheck'),
      Validate: GetGoogleCaptcha()
    };
    console.log(RegData);

    if (!RegData.Name){
      $('#name-err').addClass('has-error');
      $('#name-err').removeClass('hidden');
      $('#name-err').html('Please enter Name!');
      sending = false;
    } else {
      $('#name-err').addClass('hidden');
      $('#name-err').removeClass('has-error');
      sending = true;
    }

    if (RegData.DepositCheck.checked && RegData.DataCheck.checked ){ //&& RegData.OfertaCheck.checked
      $('#check-err').addClass('hidden');
      $('#check-err').removeClass('has-error');
      sending = true;
    } else {
      $('#check-err').addClass('has-error');
      $('#check-err').removeClass('hidden');
      $('#check-err').html('Please checked terms!');
      sending = false;
    }

    if (!RegData.Surname){
      $('#surname-err').addClass('has-error');
      $('#surname-err').removeClass('hidden');
      $('#surname-err').html('Please enter Surname!');
      sending = false;
    } else {
      $('#surname-err').addClass('hidden');
      $('#surname-err').removeClass('has-error');
      sending = true;
    }

    if (!RegData.Email){
      $('#email-err').removeClass('hidden');
      $('#email-err').addClass('has-error');
      $('#email-err').html('Please enter Email!');
      sending = false;
    } else {
      $('#email-err').addClass('hidden');
      $('#email-err').removeClass('has-error');
      sending = true;
    }

    if (!RegData.validateEmail){
      $('#email-err').removeClass('hidden');
      $('#email-err').addClass('has-error');
      $('#email-err').html('Please enter valid Email!');
      sending = false;
    } else {
      $('#email-err').addClass('hidden');
      $('#email-err').removeClass('has-error');
      sending = true;
    }

    if (!RegData.Password){
      $('#password-err').removeClass('hidden');
      $('#password-err').addClass('has-error');
      $('#password-err').html('Please enter Password!');
      sending = false;
    } else {
      $('#password-err').addClass('hidden');
      sending = true;
    }

    if (!RegData.PasswordConfirm){
      $('#passconf-err').removeClass('hidden');
      $('#passconf-err').addClass('has-error');
      $('#passconf-err').html('Please enter Password Confirm!');
      sending = false;
    } else {
      $('#passconf-err').addClass('hidden');
      sending = true;
    }

    console.log(RegData);
    console.log(ValidateCaptchaValue);

    if (!ValidateCaptchaValue) {
      $('#validation-err').removeClass('hidden');
      $('#validation-err').addClass('has-error');
      $('#validation-err').html('Please fill the Captcha!');
      sending = false;
    } else {
      $('#validation-err').removeClass('has-error');
      $('#validation-err').addClass('hidden');
      sending = true;
    }
    //&& RegData.OfertaCheck.checked
    if ((RegData.Password == RegData.PasswordConfirm) && RegData.Password && RegData.PasswordConfirm && RegData.validateEmail && ValidateCaptchaValue && RegData.Surname && RegData.Name && RegData.DepositCheck.checked && RegData.DataCheck.checked) {
      sending = true;
    } else {
      sending = false;
    }

    if (RegData.Password && RegData.PasswordConfirm) {
      if (RegData.Password != RegData.PasswordConfirm) {
        $('#password-err').removeClass('hidden');
        $('#passconf-err').removeClass('hidden');
        $('#password-err').addClass('has-error');
        $('#passconf-err').addClass('has-error');
        $('#password-err').html('The passwords entered don\'t match!');
        $('#passconf-err').html('The passwords entered don\'t match!');
        sending2 = false;
      } else {
        $('#password-err').removeClass('has-error');
        $('#passconf-err').removeClass('has-error');
        $('#password-err').addClass('hidden');
        $('#passconf-err').addClass('hidden');
        sending2 = true;
      }
    }

    if(CheckPasswordSymbol(RegData.Password) && CheckPasswordSymbol(RegData.PasswordConfirm)) {
      $('#password-err').removeClass('has-error');
      $('#password-err').addClass('hidden');
      sending3 = true;      
    } else {
      $('#password-err').removeClass('hidden');
      $('#password-err').addClass('has-error');
      $('#password-err').html('Please enter correct password symbols!');
      sending3 = false;
    }

    if (sending && sending2 && sending3) {
      $('#alert-reg').addClass('hidden');

      xhr = new XMLHttpRequest();
      url = "https://artyfact.art/api-reg.php";
      xhr.open("POST", url, true);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr.setRequestHeader("Access-Control-Allow-Origin", "*");

      let query = "email=" + RegData.Email + "&password=" + RegData.Password + "&name=" + RegData.Name + "&surname=" + RegData.Surname + "&agent=" + RegData.Agent + "&referrer=" + RegData.Referrer;

      xhr.send(query);
      xhr.onreadystatechange = function () {
        if (xhr.readyState != 4) {
          return
        }

        if (xhr.status === 200) {
          console.log('result', xhr.responseText)
          if (xhr.responseText.indexOf('errors') >=0) {
            $('#alert-reg').removeClass('hidden');
            $('#alert-reg').html('User already exist!');
          } else
            if (xhr.responseText.indexOf('token') >=0) {
              console.log('TOKEN!');
              LoginUser(RegData.Email,RegData.Password);
              //window.location = "https://client.creditunion.group/";
            }
        } else {
          console.log('err', xhr.responseText);
        }
      };

    }

  }


  /*Login function*/
  function LoginUser(email, password){
    console.log('SEND Login');
    let sending = false;

    let LoginData = {
      Email: email.toLowerCase(),
      Password: password
    };
    if (LoginData.Email && LoginData.Password) {sending = true;}
    else {
      $('#alert-log').removeClass('hidden');
      $('#alert-log').html('Please fill the login form!');
    }
    if (sending) {
      $('#alert-log').addClass('hidden');

      xhr = new XMLHttpRequest();
      url = "https://artyfact.art/api-login.php";
      xhr.open("POST", url, true);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr.setRequestHeader("Access-Control-Allow-Origin", "*");

      let query = "email=" + LoginData.Email + "&password=" + LoginData.Password;

      xhr.send(query);
      xhr.onreadystatechange = function () {
        if (xhr.readyState != 4) {
          return
        }

        if (xhr.status === 200) {
          //console.log('result', xhr.responseText)
          if (xhr.responseText.indexOf('errors') >=0) {
            $('#alert-log').removeClass('hidden');
            $('#alert-log').html('User not found or password incorrect!');
          } else
            if (xhr.responseText.indexOf('token') >=0) {
              //console.log('TOKEN!');
              let start = xhr.responseText.indexOf('{"token"') + 10;
              let stop = xhr.responseText.indexOf('","__typename":"Token"');
              let token = xhr.responseText.slice(start, stop);
              //console.log(token);
              //localStorage.setItem('token', token);
              window.location = "https://launchpad.artyfact.art/token/" + token;
            }
        } else {
          console.log('err', xhr.responseText);
          //console.log(res);
        }
      };

    }
  }


  /*RECOVERY PASS PROCESSING*/
  function getPassword(){
    console.log('PASS forgot');
    let sending = false;
    let LowEmail = $('#fp-email').val();
    let LoginData = {
      Email: LowEmail.toLowerCase()
    };
    if (LoginData.Email) {sending = true;}

    if (sending) {
      $('#alert-fp').addClass('hidden');
      $('#alert-fp-success').addClass('hidden');      

      xhr = new XMLHttpRequest();
      url = "https://artyfact.art/api-fp.php";
      xhr.open("POST", url, true);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr.setRequestHeader("Access-Control-Allow-Origin", "*");

      let query = "email=" + LoginData.Email;

      xhr.send(query);
      xhr.onreadystatechange = function () {
        if (xhr.readyState != 4) {
          return
        }

        if (xhr.status === 200) {
          console.log('result', xhr.responseText)
          if (xhr.responseText.indexOf('errors') >=0) {
            $('#alert-fp').removeClass('hidden');
            $('#alert-fp').html('User not found!');
          } else
            {
              $('#alert-fp-success').removeClass('hidden');
              $('#alert-fp-success').html(`New password has been send to ${LoginData.Email}. Check your E-mail address!`);
            }
        } else {
          console.log('err', xhr.responseText);
          //console.log(res);
        }
      };

    }
  }

  /*
  var cd;
var IsAllowed = false;
$(document).ready(function () {
  CreateCaptcha();
});

// Create Captcha
function CreateCaptcha() {
  //$('#InvalidCapthcaError').hide();
  var alpha = new Array(
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9"
  );

  var i;
  for (i = 0; i < 6; i++) {
    var a = alpha[Math.floor(Math.random() * alpha.length)];
    var b = alpha[Math.floor(Math.random() * alpha.length)];
    var c = alpha[Math.floor(Math.random() * alpha.length)];
    var d = alpha[Math.floor(Math.random() * alpha.length)];
    var e = alpha[Math.floor(Math.random() * alpha.length)];
    var f = alpha[Math.floor(Math.random() * alpha.length)];
  }
  cd = a + " " + b + " " + c + " " + d + " " + e + " " + f;
  $("#CaptchaImageCode")
    .empty()
    .append(
      '<canvas id="CapCode" class="capcode" width="300" height="80"></canvas>'
    );

  var c = document.getElementById("CapCode"),
    ctx = c.getContext("2d"),
    x = c.width / 2,
    img = new Image();

  img.src = "https://arno-token.com/bg-captcha.jpg";
  img.onload = function () {
    var pattern = ctx.createPattern(img, "repeat");
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.font = "35px Roboto Slab";
    ctx.fillStyle = "#f3be81";
    ctx.textAlign = "center";
    ctx.setTransform(1, -0.12, 0, 1, 0, 15);
    ctx.fillText(cd, x, 55);
  };
}

// Validate Captcha
function ValidateCaptcha() {
  var string1 = removeSpaces(cd);
  var string2 = removeSpaces($("#UserCaptchaCode").val());
  if (string1 == string2) {
    return true;
  } else {
    return false;
  }
}

// Remove Spaces
function removeSpaces(string) {
  return string.split(" ").join("");
}

// Check Captcha
function CheckCaptcha() {
  var result = ValidateCaptcha();
  ValidateCaptchaValue = result;
  if (
    $("#UserCaptchaCode").val() == "" ||
    $("#UserCaptchaCode").val() == null ||
    $("#UserCaptchaCode").val() == "undefined"
  ) {
    $("#WrongCaptchaError")
      .text("Please enter the code shown below in the picture.")
      .show();
    $("#UserCaptchaCode").focus();
  } else {
    if (result == false) {
      IsAllowed = false;
      $("#WrongCaptchaError")
        .text("Invalid captcha! Please try again.")
        .show();
      CreateCaptcha();
      $("#UserCaptchaCode").focus().select();
    } else {
      IsAllowed = true;
      $("#UserCaptchaCode")
        .val("")
        .attr("place-holder", "Введите буквы - с учетом регистра");
      CreateCaptcha();
      $("#WrongCaptchaError").fadeOut(100);
      $("#SuccessMessage")
        .fadeIn(500)
        .css("display", "block")
        .delay(5000);
        //.fadeOut(250);
    }
  }
}


$(function() {
   $('#ReloadBtn').on('click', CreateCaptcha);
});

$(function() {
   $('#SubmCaptcha').on('click', CheckCaptcha);
});
*/
  var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;
    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
  };

  console.log(getUrlParameter('login'))
  if (getUrlParameter('login') == 'true') {
    $('#login-buton-auth').removeClass('hidden');
    $('#login-buton').addClass('hidden');
  }

  $(function() {
     $('#log-submit').on('click', getajax);
  });

  $(function() {
     $('#reg-submit').on('click', getRegister);
  });

  $(function() {
    $('#forgot-pass-submit').on('click', getPassword);
  });

  $(function() {
    $('.close').on('click', ResetForm);
    $('.closebtn').on('click', ResetForm);
 });
})(jQuery);