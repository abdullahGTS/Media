var animation = lottie.loadAnimation({
    container: document.getElementById('lottie-animation'), // The DOM element where the animation will be rendered
    renderer: 'svg',  // Use 'svg', 'canvas', or 'html'
    loop: true,       // Set to 'true' for a continuous loop
    autoplay: true,   // Autoplay the animation on load
    path: '/static/lotties/changePasswordFirstLogin3.json'  // Path to the Lottie JSON file
});
animation.setSpeed(0.4);

document.getElementById('re_password').addEventListener('focusout', function () {
    var password = document.getElementById('new_password');
    var re_password = document.getElementById('re_password');
    var submit_btn = document.getElementById('changePasswordBtn');

    if (password.value === re_password.value) {
        // re_password.classList.remove('bg-danger');
        // console.log('valid');
        submit_btn.removeAttribute('disabled');
    } else {
        // re_password.classList.add('bg-danger');
        // console.log('not valid');
        submit_btn.setAttribute('disabled', 'true');
        $.notify({
            icon: 'fa-solid fa-lock-open',
            title: 'Validation Error',
            message: 'The password and re-password are miss-matched.',
        }, {
            type: 'danger',
            placement: {
                from: "top",
                align: "right"
            },
            time: 1000,
        });
    }
});


$(function () {
    document.getElementById('changePasswordBtn').addEventListener('click', function () {
        var email = document.getElementById('email');
        var password = document.getElementById('new_password');
        var re_password = document.getElementById('re_password');
        var flag = false;
        if (password.value == '') {
            $.notify({
                icon: 'fa-solid fa-lock-open',
                title: 'Validation Error',
                message: 'The password field must have a value.',
            }, {
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
        if (re_password.value == '') {
            $.notify({
                icon: 'fa-solid fa-lock-open',
                title: 'Validation Error',
                message: 'The confirm password field must have a value.',
            }, {
                type: 'danger',
                placement: {
                    from: "top",
                    align: "right"
                },
                time: 1000,
            });
            flag = false;
        } else {
            // otp.style = 'background-color: #dc3545;color:#fff';
            flag = true;
        }
        if(flag){
            $.ajax({
                url: '/change/password/first/login/',
                method: 'POST',
                dataType: 'json', // Set the content type if sending JSON data
                data: {
                    'reg_email': email.value,
                    'new_password': password.value,
                },
                headers: {
                    'X-CSRFToken': document.getElementById('csrfToken').value,
                },
                success: function (t) {
                    console.log(t);
                    if (t.status == 'valid') {
                        $.notify({
                            icon: 'fa-solid fa-lock-open',
                            title: 'Password Changed',
                            message: 'Thank you, your password has been changed successfully.',
                        }, {
                            type: 'success',
                            placement: {
                                from: "top",
                                align: "right"
                            },
                            time: 1000,
                        });
                        setTimeout(() => {
                            window.location.href = t.path;
                        }, 3000);
                    }
                    if (t.status == 'invalid') {
                        $.notify({
                            icon: 'fa-solid fa-envelope',
                            title: 'E-Mail Error',
                            message: 'Sorry, there is an error with this e-mail, please contact us.',
                        }, {
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
        }
    });
    document.getElementById('view_password').addEventListener('click', () => {
        // console.log(e.target);
        var password = document.getElementById('new_password');
        if (password.type == 'text') {
            password.type = 'password';
            document.querySelector('#view_password i').classList.replace('fa-eye-slash', 'fa-eye');
        } else {
            password.type = 'text';
            document.querySelector('#view_password i').classList.replace('fa-eye', 'fa-eye-slash');
        }
    });
    document.getElementById('view_re_password').addEventListener('click', () => {
        var password = document.getElementById('re_password');
        if (password.type == 'text') {
            password.type = 'password';
            document.querySelector('#view_re_password i').classList.replace('fa-eye-slash', 'fa-eye');
        } else {
            password.type = 'text';
            document.querySelector('#view_re_password i').classList.replace('fa-eye', 'fa-eye-slash');
        }
    });
})