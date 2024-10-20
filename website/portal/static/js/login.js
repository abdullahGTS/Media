function sendOTP(){
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    if(email == ''){
        document.getElementById('email').classList.add('bg-danger', 'text-white');
    }else{
        document.getElementById('email').classList.remove('bg-danger', 'text-white');
    }
    if(password == ''){
        document.getElementById('password').classList.add('bg-danger', 'text-white');
    }else{
        document.getElementById('password').classList.remove('bg-danger', 'text-white');
    }
    $.ajax({
        url: '/create/otp/api/',
        method: 'POST',
        dataType: 'json', // Set the content type if sending JSON data
        data: {
            'email': email,
            'password': password,
        },
        headers: {
            'X-CSRFToken': document.getElementById('csrfToken').value,
        },
        success: function (t) {
            console.log(t);
            if (t.status == 'valid'){
                document.getElementById('error_message').classList.add('d-none');
                document.getElementById('otpRow').classList.remove('d-none');
                document.getElementById('otpBTN').classList.add('d-none');
                document.getElementById('loginBTN').type = 'submit';
                document.getElementById('loginBTN').classList.remove('d-none');
            }
            else if (t.status == 'invalid'){
                document.getElementById('error_message').innerHTML = "Invalid E-mail or Password"
                document.getElementById('error_message').classList.remove('d-none');
            }else{
                window.location.href = t.status;
            }
            // if (t.status == 'Not Found'){
            //     document.getElementById('valid_message').classList.add('d-none');
            //     document.getElementById('error_message').classList.remove('d-none');
            // }else{
            //     document.getElementById('valid_message').classList.remove('d-none');
            //     document.getElementById('error_message').classList.add('d-none');
            //     document.getElementById('passwordRow').classList.remove('d-none');
            //     document.getElementById('password').setAttribute('required', 'true');
            //     document.getElementById('otpBTN').classList.add('d-none');
            //     document.getElementById('loginBTN').classList.remove('d-none');
            // }
        },
    });
}