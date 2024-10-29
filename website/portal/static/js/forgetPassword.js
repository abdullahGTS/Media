var animation = lottie.loadAnimation({
    container: document.getElementById('lottie-animation'), // The DOM element where the animation will be rendered
    renderer: 'svg',  // Use 'svg', 'canvas', or 'html'
    loop: true,       // Set to 'true' for a continuous loop
    autoplay: true,   // Autoplay the animation on load
    path: '/static/lotties/forget_password3.json'  // Path to the Lottie JSON file
});
animation.setSpeed(0.4);

document.getElementById('re_password').addEventListener('focusout', function(){
    var password = document.getElementById('new_password');
    var re_password = document.getElementById('re_password');
    var submit_btn = document.getElementById('forgetPasswordBtn');

    if(password.value === re_password.value){
        // re_password.classList.remove('bg-danger');
        // console.log('valid');
        submit_btn.removeAttribute('disabled');
    }else{
        // re_password.classList.add('bg-danger');
        // console.log('not valid');
        submit_btn.setAttribute('disabled', 'true');
        $.notify({
            icon: 'fa-solid fa-lock-open',
            title: 'Validation Error',
            message: 'The password and re-password are miss-matched.',
        },{
            type: 'danger',
            placement: {
                from: "top",
                align: "right"
            },
            time: 1000,
        });
    }
});


$(function(){
    document.getElementById('getOTPBtn').addEventListener('click', function(){
        var email = document.getElementById('email');
        if (email.value){
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
                        document.getElementById('otpRow').classList.remove('d-none');
                        document.getElementById('getOTPBtn').classList.add('d-none');
                        document.getElementById('checkOTPBtn').classList.remove('d-none');
                        $.notify({
                            icon: 'fa-solid fa-lock',
                            title: 'OTP',
                            message: 'Type the OTP you have received in your email.',
                        },{
                            type: 'success',
                            placement: {
                                from: "top",
                                align: "right"
                            },
                            time: 1000,
                        });
                    }
                    else{
                        $.notify({
                            icon: 'fa-solid fa-envelope',
                            title: 'Invalid Data',
                            message: 'The E-Mail you mentioned was invalid.',
                        },{
                            type: 'danger',
                            placement: {
                                from: "top",
                                align: "right"
                            },
                            time: 1000,
                        });
                    }
                },
            });
        }else{
            // email.style = 'background-color: #dc3545;color:#fff';
            $.notify({
                icon: 'fa-solid fa-envelope',
                title: 'Validation Error',
                message: 'The E-Mail input field must have a value.',
            },{
                type: 'danger',
                placement: {
                    from: "top",
                    align: "right"
                },
                time: 1000,
            });
        }
    });
    document.getElementById('checkOTPBtn').addEventListener('click', function(){
        var email = document.getElementById('email');
        var otp = document.getElementById('otp');
        if (otp.value){
            // otp.style = 'background-color: #fff;color:#000';
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
                        // document.getElementById('error_message').classList.add('d-none');
                        document.getElementById('otpRow').classList.add('d-none');
                        document.getElementById('newPasswordRow').classList.remove('d-none');
                        document.getElementById('rePasswordRow').classList.remove('d-none');
                        document.getElementById('checkOTPBtn').classList.add('d-none');
                        document.getElementById('forgetPasswordBtn').classList.remove('d-none');
                        $.notify({
                            icon: 'fa-solid fa-lock-open',
                            title: 'Valid OTP',
                            message: 'Now, you can change your password.',
                        },{
                            type: 'success',
                            placement: {
                                from: "top",
                                align: "right"
                            },
                            time: 1000,
                        });
                    }
                    else{
                        // document.getElementById('error_message').innerHTML = "Expired OTP"
                        // document.getElementById('error_message').classList.remove('d-none');
                        $.notify({
                            icon: 'fa-solid fa-lock-open',
                            title: 'Expired OTP',
                            message: 'The OTP you mentioned was expired.',
                        },{
                            type: 'danger',
                            placement: {
                                from: "top",
                                align: "right"
                            },
                            time: 1000,
                        });
                    }
                },
            });
        }else{
            // otp.style = 'background-color: #dc3545;color:#fff';
            $.notify({
                icon: 'fa-solid fa-lock',
                title: 'Validation Error',
                message: 'The OTP input field must have a value.',
            },{
                type: 'danger',
                placement: {
                    from: "top",
                    align: "right"
                },
                time: 1000,
            });
        }
    });
    document.getElementById('forgetPasswordBtn').addEventListener('click', function(){
        var email = document.getElementById('email');
        var otp = document.getElementById('otp');
        var password = document.getElementById('new_password');
        if (password.value){
            // otp.style = 'background-color: #fff;color:#000';
            $.ajax({
                url: '/forget/password/',
                method: 'POST',
                dataType: 'json', // Set the content type if sending JSON data
                data: {
                    'reg_email': email.value,
                    'new_password': password.value,
                    'otp': otp.value,
                },
                headers: {
                    'X-CSRFToken': document.getElementById('csrfToken').value,
                },
                success: function (t) {
                    console.log(t);
                    if (t.status == 'valid'){
                        document.getElementById('newPasswordRow').classList.add('d-none');
                        document.getElementById('rePasswordRow').classList.add('d-none');
                        document.getElementById('forgetPasswordBtn').classList.add('d-none');
                        document.getElementById('getOTPBtn').classList.remove('d-none');
                        document.getElementById('email').value = '';
                        document.getElementById('email').removeAttribute('readonly');
                        document.getElementById('otp').value = '';
                        document.getElementById('otp').removeAttribute('disabled');
                        document.getElementById('new_password').value = '';
                        document.getElementById('re_password').value = '';
                        $.notify({
                            icon: 'fa-solid fa-lock-open',
                            title: 'Password Changed',
                            message: 'Thank you, your password has been changed successfully.',
                        },{
                            type: 'success',
                            placement: {
                                from: "top",
                                align: "right"
                            },
                            time: 1000,
                        });
                        setTimeout(() => {
                            window.location.href = '/';
                        }, 3000);
                    }
                    else{
                        // document.getElementById('error_message').innerHTML = "Expired OTP"
                        // document.getElementById('error_message').classList.remove('d-none');
                        $.notify({
                            icon: 'fa-solid fa-lock-open',
                            title: 'Expired OTP',
                            message: 'Too long, the OTP you mentioned was expired.',
                        },{
                            type: 'danger',
                            placement: {
                                from: "top",
                                align: "right"
                            },
                            time: 1000,
                        });
                    }
                },
            });
        }else{
            // otp.style = 'background-color: #dc3545;color:#fff';
            $.notify({
                icon: 'fa-solid fa-lock-open',
                title: 'Validation Error',
                message: 'The password input field must have a value.',
            },{
                type: 'danger',
                placement: {
                    from: "top",
                    align: "right"
                },
                time: 1000,
            });
        }
    });
    document.getElementById('view_password').addEventListener('click', ()=>{
        // console.log(e.target);
        var password = document.getElementById('new_password');
        if(password.type == 'text'){
            password.type = 'password';
            document.querySelector('#view_password i').classList.replace('fa-eye-slash', 'fa-eye');
        }else{
            password.type = 'text';
            document.querySelector('#view_password i').classList.replace('fa-eye', 'fa-eye-slash');
        }
    });
    document.getElementById('view_re_password').addEventListener('click', ()=>{
        var password = document.getElementById('re_password');
        if(password.type == 'text'){
            password.type = 'password';
            document.querySelector('#view_re_password i').classList.replace('fa-eye-slash', 'fa-eye');
        }else{
            password.type = 'text';
            document.querySelector('#view_re_password i').classList.replace('fa-eye', 'fa-eye-slash');
        }
    });
})