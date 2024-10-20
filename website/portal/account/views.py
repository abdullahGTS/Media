from django.shortcuts import render
from django.http import HttpResponseRedirect, JsonResponse
from .models import *
from django.contrib.auth.hashers import check_password, make_password
import random
from django.conf import settings
from datetime import datetime, timedelta
import secrets
import string
# for E-mail
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Create your views here.


def send_email(sender, receiver, subject, message):
    msg = MIMEMultipart()
    msg["From"] = sender
    msg["To"] = ", ".join(receiver)
    msg["Subject"] = subject
    msg.attach(MIMEText(message,"plain"))
    text = msg.as_string()

    server = smtplib.SMTP("mail.globalts-eg.com",587)
    server.starttls()

    server.login(settings.EMAIL_USER,settings.EMAIL_PASSWORD)

    server.sendmail(sender,receiver,text)
        
    server.quit()


def generate_otp(length=10):
    """Generate a random user token of specified length."""
    characters = string.ascii_letters + string.digits
    otp = ''.join(secrets.choice(characters) for _ in range(length))
    return otp


def CreateOTPApi(request):
    if request.method == 'POST':
        email = request.POST.get('email', None)
        password = request.POST.get('password', None)
        # print(username, password)
        # print(make_password(password))
        try:
            user = UserAccount.objects.get(email=email)
            # print('user first login => ', user.first_login)
            if user.first_login:
                request.session['email'] = user.email
                return JsonResponse(data={'status': '/change/password/first/login/'}, safe=False)
            elif user.is_locked:
                return JsonResponse(data={'status': '/?error=ALOCK'}, safe=False)
            else:
                password_checher = check_password(password, user.password)
                # print('password_checher => ', password_checher)
                # print(password, user.password)
                if password_checher:
                    # print(password_checher)
                    current_datetime = datetime.now()
                    check_user_otp = UserOTP.objects.filter(user=user)
                    if check_user_otp.exists():
                        user_otp = check_user_otp.first()
                        if current_datetime >= user_otp.timeout:
                            # create new otp
                            user_otp.key = generate_otp()
                            user_otp.timeout = current_datetime + timedelta(minutes=5)
                            user_otp.save()
                    else:
                        user_otp = UserOTP.objects.create(
                            user=user,
                            key=generate_otp(),
                            timeout=current_datetime + timedelta(minutes=5)
                        )
                    # send old otp
                    sender = settings.EMAIL_USER
                    receiver = [user.email]
                    subject = f"OTP | {user.email}"
                    message = f"The OTP is {user_otp.key}."
                    send_email(sender,receiver,subject,message)
                    return JsonResponse(data={'status': 'valid'}, safe=False)
                else:
                    user.attempts += 1
                    if user.attempts == 5:
                        user.is_locked = True
                        user.save()
                        return JsonResponse(data={'status': '/?error=ALOCK'}, safe=False)
                    user.save()
                    return JsonResponse(data={'status': 'invalid'}, safe=False)
        except Exception as ex:
            print(ex)
            return JsonResponse(data={'status': 'invalid'}, safe=False)
    return JsonResponse(data={'status': 'No Get Response'}, safe=False)


def userLogin(request):
    if request.method == 'POST':
        email = request.POST.get('email', None)
        password = request.POST.get('password', None)
        otp = request.POST.get('otp', None)
        # print(username, password)
        try:
            user = UserAccount.objects.get(email=email)
            # print('user first login => ', user.first_login)
            password_checher = check_password(password, user.password)
            # print('password_checher => ', password_checher)
            # print(password, user.password)
            if password_checher:
                # print(password_checher)
                user_otp = UserOTP.objects.filter(user=user)
                if user_otp.exists():
                    # print(user_otp.first().key, otp)
                    # print(type(user_otp.first().key), type(otp))
                    if user_otp.first().key == otp:
                        userToken = Token.objects.get(user=user).token
                        UserSession.objects.create(user=user, key=True)
                        user.attempts = 0
                        user.save()
                        # print(user)
                        if user.role.id == 1: # admin
                            request.session['admin_token'] = userToken
                            return HttpResponseRedirect('/adminpanal/')
                        if user.role.id == 2: # company
                            request.session['company_token'] = userToken
                            return HttpResponseRedirect('/company/')
                    else:
                        return HttpResponseRedirect('/?error=IOTP')
                else:
                    return HttpResponseRedirect('/?error=NOTP')
            else:
                user.attempts += 1
                if user.attempts == 5:
                    user.is_locked = True
                    user.save()
                    return HttpResponseRedirect('/?error=ALOCK')
                user.save()
                return HttpResponseRedirect('/?error=IPASS')
        except Exception as ex:
            print(ex)
    return render(request, 'login.html', {})


def UserLogout(request):
    if 'admin_token' in request.session:
        user = Token.objects.get(token=request.session.get('admin_token', None)).user
        UserSession.objects.create(user=user, key=False)
        del request.session['admin_token']
    if 'company_token' in request.session:
        user = Token.objects.get(token=request.session.get('company_token', None)).user
        UserSession.objects.create(user=user, key=False)
        del request.session['company_token']
    if 'email' in request.session:
        del request.session['email']
    return HttpResponseRedirect('/')


def UserChangePasswordFirstLogin(request):
    if 'email' in request.session:
        if request.method == 'POST':
            email = request.POST.get('reg_email', None)
            password = request.POST.get('new_password', None)
            try:
                user = UserAccount.objects.get(email=email)
                user.password = make_password(password)
                user.first_login = False
                user.save()
                del request.session['email']
                return HttpResponseRedirect('/')
            except Exception as ex:
                print(ex)
        return render(request, 'changePasswordFirstLogin.html', {'email': request.session['email']})
    else:
        return HttpResponseRedirect('/logout/')


def UserForgetPassword(request):
    if request.method == 'POST':
        email = request.POST.get('reg_email', None)
        password = request.POST.get('new_password', None)
        otp = request.POST.get('otp', None)
        user_obj = UserAccount.objects.get(email=email)
        user_otp = UserOTP.objects.filter(user=user_obj, key=otp)
        if user_otp.exists():
            user_obj.password = make_password(password)
            user_obj.save()
            return HttpResponseRedirect('/')
        else:
            print('OTP Expired')
    return render(request, 'forgetPassword.html', {})


def ForgetPasswordGenerateOTPApi(request):
    if request.method == 'POST':
        email = request.POST.get('email', None)
        try:
            current_datetime = datetime.now()
            user = UserAccount.objects.get(email=email)
            user_otp = UserOTP.objects.get(user=user)
            user_otp.key = generate_otp()
            user_otp.timeout = current_datetime + timedelta(minutes=5)
            user_otp.save()
            sender = settings.EMAIL_USER
            receiver = [user.email]
            subject = f"OTP | {user.email}"
            message = f"The OTP is {user_otp.key}."
            send_email(sender,receiver,subject,message)
            return JsonResponse(data={'status': 'valid'}, safe=False)
        except Exception as ex:
            print(ex)
            return JsonResponse(data={'status': 'invalid'}, safe=False)


def ForgetPasswordcheckOTPApi(request):
    if request.method == 'POST':
        email = request.POST.get('email', None)
        otp = request.POST.get('otp', None)
        user_otp = UserOTP.objects.select_related('user')\
            .filter(user__email=email, key=otp)
        if user_otp.exists():
            return JsonResponse(data={'status': 'valid'}, safe=False)
        else:
            return JsonResponse(data={'status': 'invalid'}, safe=False)
            
