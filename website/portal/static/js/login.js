var animation = lottie.loadAnimation({
    container: document.getElementById('lottie-animation'), // The DOM element where the animation will be rendered
    renderer: 'svg',  // Use 'svg', 'canvas', or 'html'
    loop: true,       // Set to 'true' for a continuous loop
    autoplay: true,   // Autoplay the animation on load
    path: '/static/lotties/login.json'  // Path to the Lottie JSON file
});
animation.setSpeed(0.4);

// function sendOTP() {
//     var email = document.getElementById('email').value;
//     var password = document.getElementById('password').value;
//     if (email == '') {
//         document.getElementById('email').classList.add('bg-danger', 'text-white');
//     } else {
//         document.getElementById('email').classList.remove('bg-danger', 'text-white');
//     }
//     if (password == '') {
//         document.getElementById('password').classList.add('bg-danger', 'text-white');
//     } else {
//         document.getElementById('password').classList.remove('bg-danger', 'text-white');
//     }
//     $.ajax({
//         url: '/create/otp/api/',
//         method: 'POST',
//         dataType: 'json', // Set the content type if sending JSON data
//         data: {
//             'email': email,
//             'password': password,
//         },
//         headers: {
//             'X-CSRFToken': document.getElementById('csrfToken').value,
//         },
//         success: function (t) {
//             console.log(t);
//             if (t.status == 'valid') {
//                 document.getElementById('error_message').classList.add('d-none');
//                 document.getElementById('otpRow').classList.remove('d-none');
//                 document.getElementById('otpBTN').classList.add('d-none');
//                 document.getElementById('loginBTN').type = 'submit';
//                 document.getElementById('loginBTN').classList.remove('d-none');
//             }
//             else if (t.status == 'invalid') {
//                 document.getElementById('error_message').innerHTML = "Invalid E-mail or Password"
//                 document.getElementById('error_message').classList.remove('d-none');
//             } else {
//                 window.location.href = t.status;
//             }
//             // if (t.status == 'Not Found'){
//             //     document.getElementById('valid_message').classList.add('d-none');
//             //     document.getElementById('error_message').classList.remove('d-none');
//             // }else{
//             //     document.getElementById('valid_message').classList.remove('d-none');
//             //     document.getElementById('error_message').classList.add('d-none');
//             //     document.getElementById('passwordRow').classList.remove('d-none');
//             //     document.getElementById('password').setAttribute('required', 'true');
//             //     document.getElementById('otpBTN').classList.add('d-none');
//             //     document.getElementById('loginBTN').classList.remove('d-none');
//             // }
//         },
//     });
// }

$(function () {
    document.getElementById('getOTPBtn').addEventListener('click', () => {
        var email = document.getElementById('email');
        var password = document.getElementById('password');
        var flag = false;
        if (email.value == '') {
            $.notify({
                icon: 'fa-solid fa-envelope',
                title: 'Validation Error',
                message: 'The E-Mail field must have a value.',
            },{
                type: 'danger',
                placement: {
                    from: "top",
                    align: "right"
                },
                time: 1000,
            });
            flag = false;
        } else {
            // Define the pattern for a basic email format
            var emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            // Test the input value against the pattern
            if (!emailPattern.test(email.value)) {
                $.notify({
                    icon: 'fa-solid fa-envelope',
                    title: 'Validation Error',
                    message: 'Please enter a valid email address.',
                },{
                    type: 'danger',
                    placement: {
                        from: "top",
                        align: "right"
                    },
                    time: 1000,
                });
                flag = false;
            }else{
                flag = true;
            }
        }
        if (password.value == '') {
            $.notify({
                icon: 'fa-solid fa-lock',
                title: 'Validation Error',
                message: 'The Password field must have a value.',
            },{
                type: 'danger',
                placement: {
                    from: "top",
                    align: "right"
                },
                time: 1000,
            });
            flag = false;
        } else {
            if (password.value.length < 8) {
                $.notify({
                    icon: 'fa-solid fa-lock',
                    title: 'Validation Error',
                    message: 'Password must be at least 8 characters long.',
                },{
                    type: 'danger',
                    placement: {
                        from: "top",
                        align: "right"
                    },
                    time: 1000,
                });
                flag = false;
            }else{
                flag = true;
            }
        }
        if(flag){
            $.ajax({
                url: '/create/otp/api/',
                method: 'POST',
                dataType: 'json', // Set the content type if sending JSON data
                data: {
                    'email': email.value,
                    'password': password.value,
                },
                headers: {
                    'X-CSRFToken': document.getElementById('csrfToken').value,
                },
                success: function (t) {
                    console.log(t);
                    if (t.status == 'valid') {
                        // document.getElementById('error_message').classList.add('d-none');
                        document.getElementById('otpRow').classList.remove('d-none');
                        document.getElementById('getOTPBtn').classList.add('d-none');
                        document.getElementById('signinBtn').classList.remove('d-none');
                        email.setAttribute('readonly', 'true');
                        password.setAttribute('readonly', 'true');
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
                    if (t.status == 'first_login') {
                        $.notify({
                            icon: 'fa-solid fa-user',
                            title: 'First Login',
                            message: 'You will be redirected to change your password.',
                        },{
                            type: 'success',
                            placement: {
                                from: "top",
                                align: "right"
                            },
                            time: 1000,
                        });
                        document.getElementById('email').value = '';
                        document.getElementById('password').value = '';
                        document.getElementById('otp').value = '';
                        document.getElementById('otpRow').classList.add('d-none');
                        document.getElementById('getOTPBtn').classList.remove('d-none');
                        document.getElementById('signinBtn').classList.add('d-none');
                        setTimeout(() => {
                            window.location.href = t.path;
                        }, 3000);
                    }
                    if (t.status == 'locked') {
                        $.notify({
                            icon: 'fa-solid fa-user',
                            title: 'Account Locked',
                            message: 'Sorry, your account has been locked.',
                        },{
                            type: 'danger',
                            placement: {
                                from: "top",
                                align: "right"
                            },
                            time: 1000,
                        });
                        document.getElementById('email').value = '';
                        document.getElementById('password').value = '';
                        document.getElementById('otp').value = '';
                        document.getElementById('otpRow').classList.add('d-none');
                        document.getElementById('getOTPBtn').classList.remove('d-none');
                        document.getElementById('signinBtn').classList.add('d-none');
                    }
                    if (t.status == 'invalid_password') {
                        $.notify({
                            icon: 'fa-solid fa-lock',
                            title: 'Validation Error',
                            message: 'Wrong Password.',
                        },{
                            type: 'danger',
                            placement: {
                                from: "top",
                                align: "right"
                            },
                            time: 1000,
                        });
                        document.getElementById('password').value = '';
                        document.getElementById('otp').value = '';
                        document.getElementById('otpRow').classList.add('d-none');
                        document.getElementById('getOTPBtn').classList.remove('d-none');
                        document.getElementById('signinBtn').classList.add('d-none');
                    }
                    if (t.status == 'invalid_email') {
                        $.notify({
                            icon: 'fa-solid fa-envelope',
                            title: 'Validation Error',
                            message: 'Wrong E-Mail.',
                        },{
                            type: 'danger',
                            placement: {
                                from: "top",
                                align: "right"
                            },
                            time: 1000,
                        });
                        document.getElementById('password').value = '';
                        document.getElementById('otp').value = '';
                        document.getElementById('otpRow').classList.add('d-none');
                        document.getElementById('getOTPBtn').classList.remove('d-none');
                        document.getElementById('signinBtn').classList.add('d-none');
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
    });
    document.getElementById('signinBtn').addEventListener('click', () => {
        var email = document.getElementById('email');
        var password = document.getElementById('password');
        var otp = document.getElementById('otp');
        var flag = false;
        if (email.value == '') {
            $.notify({
                icon: 'fa-solid fa-envelope',
                title: 'Validation Error',
                message: 'The E-Mail field must have a value.',
            },{
                type: 'danger',
                placement: {
                    from: "top",
                    align: "right"
                },
                time: 1000,
            });
            flag = false;
        } else {
            // Define the pattern for a basic email format
            var emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            // Test the input value against the pattern
            if (!emailPattern.test(email.value)) {
                $.notify({
                    icon: 'fa-solid fa-envelope',
                    title: 'Validation Error',
                    message: 'Please enter a valid email address.',
                },{
                    type: 'danger',
                    placement: {
                        from: "top",
                        align: "right"
                    },
                    time: 1000,
                });
                flag = false;
            }else{
                flag = true;
            }
        }
        if (password.value == '') {
            $.notify({
                icon: 'fa-solid fa-lock',
                title: 'Validation Error',
                message: 'The Password field must have a value.',
            },{
                type: 'danger',
                placement: {
                    from: "top",
                    align: "right"
                },
                time: 1000,
            });
            flag = false;
        } else {
            if (password.value.length < 8) {
                $.notify({
                    icon: 'fa-solid fa-lock',
                    title: 'Validation Error',
                    message: 'Password must be at least 8 characters long.',
                },{
                    type: 'danger',
                    placement: {
                        from: "top",
                        align: "right"
                    },
                    time: 1000,
                });
                flag = false;
            }else{
                flag = true;
            }
        }
        if (otp.value == '') {
            $.notify({
                icon: 'fa-solid fa-key',
                title: 'Validation Error',
                message: 'The OTP field must have a value.',
            },{
                type: 'danger',
                placement: {
                    from: "top",
                    align: "right"
                },
                time: 1000,
            });
            flag = false;
        } else {
            flag = true;
        }
        if(flag){
            $.ajax({
                url: '/',
                method: 'POST',
                dataType: 'json', // Set the content type if sending JSON data
                data: {
                    'email': email.value,
                    'password': password.value,
                    'otp': otp.value,
                },
                headers: {
                    'X-CSRFToken': document.getElementById('csrfToken').value,
                },
                success: function (t) {
                    console.log(t);
                    if (t.status == 'invalid_email') {
                        $.notify({
                            icon: 'fa-solid fa-envelope',
                            title: 'Validation Error',
                            message: 'Wrong E-Mail.',
                        },{
                            type: 'danger',
                            placement: {
                                from: "top",
                                align: "right"
                            },
                            time: 1000,
                        });
                        document.getElementById('email').value = '';
                        document.getElementById('email').removeAttribute('readonly');
                        document.getElementById('password').value = '';
                        document.getElementById('password').removeAttribute('readonly');
                        document.getElementById('otp').value = '';
                        document.getElementById('otpRow').classList.add('d-none');
                        document.getElementById('getOTPBtn').classList.remove('d-none');
                        document.getElementById('signinBtn').classList.add('d-none');
                    }
                    if (t.status == 'invalid_password') {
                        $.notify({
                            icon: 'fa-solid fa-lock',
                            title: 'Validation Error',
                            message: 'Wrong Password.',
                        },{
                            type: 'danger',
                            placement: {
                                from: "top",
                                align: "right"
                            },
                            time: 1000,
                        });
                        document.getElementById('password').value = '';
                        document.getElementById('password').removeAttribute('readonly');
                        document.getElementById('otp').value = '';
                        document.getElementById('otpRow').classList.add('d-none');
                        document.getElementById('getOTPBtn').classList.remove('d-none');
                        document.getElementById('signinBtn').classList.add('d-none');
                    }
                    if (t.status == 'locked') {
                        $.notify({
                            icon: 'fa-solid fa-user',
                            title: 'Account Locked',
                            message: 'Sorry, your account has been locked.',
                        },{
                            type: 'danger',
                            placement: {
                                from: "top",
                                align: "right"
                            },
                            time: 1000,
                        });
                        document.getElementById('email').value = '';
                        document.getElementById('email').removeAttribute('readonly');
                        document.getElementById('password').value = '';
                        document.getElementById('password').removeAttribute('readonly');
                        document.getElementById('otp').value = '';
                        document.getElementById('otpRow').classList.add('d-none');
                        document.getElementById('getOTPBtn').classList.remove('d-none');
                        document.getElementById('signinBtn').classList.add('d-none');
                    }
                    if (t.status == 'otp_not_found') {
                        $.notify({
                            icon: 'fa-solid fa-key',
                            title: 'OTP Error',
                            message: 'Sorry, your OTP was not found.',
                        },{
                            type: 'danger',
                            placement: {
                                from: "top",
                                align: "right"
                            },
                            time: 1000,
                        });
                        document.getElementById('email').value = '';
                        document.getElementById('email').removeAttribute('readonly');
                        document.getElementById('password').value = '';
                        document.getElementById('password').removeAttribute('readonly');
                        document.getElementById('otp').value = '';
                        document.getElementById('otpRow').classList.add('d-none');
                        document.getElementById('getOTPBtn').classList.remove('d-none');
                        document.getElementById('signinBtn').classList.add('d-none');
                    }
                    if (t.status == 'invalid_otp') {
                        $.notify({
                            icon: 'fa-solid fa-key',
                            title: 'Validation Error',
                            message: 'Sorry, your OTP was invalid.',
                        },{
                            type: 'danger',
                            placement: {
                                from: "top",
                                align: "right"
                            },
                            time: 1000,
                        });
                        document.getElementById('otp').value = '';
                        document.getElementById('otpRow').classList.add('d-none');
                        document.getElementById('getOTPBtn').classList.remove('d-none');
                        document.getElementById('signinBtn').classList.add('d-none');
                    }
                    if (t.status == 'valid') {
                        $.notify({
                            icon: 'fa-solid fa-lock-open',
                            title: 'Successfull Login',
                            message: 'Thank you, your sign in trial was successfully.',
                        },{
                            type: 'success',
                            placement: {
                                from: "top",
                                align: "right"
                            },
                            time: 1000,
                        });
                        setTimeout(() => {
                            window.location.href = t.type;
                        }, 3000);
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
    });
    document.getElementById('view_password').addEventListener('click', () => {
        // console.log(e.target);
        var password = document.getElementById('password');
        if (password.type == 'text') {
            password.type = 'password';
            document.querySelector('#view_password i').classList.replace('fa-eye-slash', 'fa-eye');
        } else {
            password.type = 'text';
            document.querySelector('#view_password i').classList.replace('fa-eye', 'fa-eye-slash');
        }
    });
});