function checkForgetPassword(){
    var password = document.getElementById('new_password');
    var re_password = document.getElementById('re_password');
    var submit_btn = document.getElementById('forgetPasswordBtn');

    if(password.value === re_password.value){
        re_password.classList.remove('bg-danger');
        // console.log('valid');
        submit_btn.type = 'submit';
    }else{
        re_password.classList.add('bg-danger');
        // console.log('not valid');
        submit_btn.type = 'button';
    }
}

$(function(){
    document.getElementById('getOTPBtn').addEventListener('click', function(){
        var email = document.getElementById('email');
        if (email.value){
            email.style = 'background-color: #fff;color:#000';
            $.ajax({
                url: '/forget/password/generate/otp/api/',
                method: 'POST',
                dataType: 'json', // Set the content type if sending JSON data
                data: {
                    'email': email.value,
                },
                headers: {
                    'X-CSRFToken': document.getElementById('csrfToken').value,
                },
                success: function (t) {
                    console.log(t);
                    if (t.status == 'valid'){
                        document.getElementById('email').setAttribute('readonly', 'true');
                        document.getElementById('error_message').classList.add('d-none');
                        document.getElementById('otpRow').classList.remove('d-none');
                        document.getElementById('getOTPBtn').classList.add('d-none');
                        document.getElementById('checkOTPBtn').classList.remove('d-none');
                    }
                    else{
                        document.getElementById('error_message').innerHTML = "Invalid E-mail"
                        document.getElementById('error_message').classList.remove('d-none');
                    }
                },
            });
        }else{
            email.style = 'background-color: #dc3545;color:#fff';
        }
    });
    document.getElementById('checkOTPBtn').addEventListener('click', function(){
        var email = document.getElementById('email');
        var otp = document.getElementById('otp');
        if (otp.value){
            otp.style = 'background-color: #fff;color:#000';
            $.ajax({
                url: '/forget/password/check/otp/api/',
                method: 'POST',
                dataType: 'json', // Set the content type if sending JSON data
                data: {
                    'email': email.value,
                    'otp': otp.value,
                },
                headers: {
                    'X-CSRFToken': document.getElementById('csrfToken').value,
                },
                success: function (t) {
                    console.log(t);
                    if (t.status == 'valid'){
                        document.getElementById('otp').setAttribute('readonly', 'true');
                        document.getElementById('error_message').classList.add('d-none');
                        document.getElementById('newPasswordRow').classList.remove('d-none');
                        document.getElementById('rePasswordRow').classList.remove('d-none');
                        document.getElementById('checkOTPBtn').classList.add('d-none');
                        document.getElementById('forgetPasswordBtn').classList.remove('d-none');
                    }
                    else{
                        document.getElementById('error_message').innerHTML = "Expired OTP"
                        document.getElementById('error_message').classList.remove('d-none');
                    }
                },
            });
        }else{
            otp.style = 'background-color: #dc3545;color:#fff';
        }
    });
})