from django.http import HttpResponseRedirect
from django.shortcuts import render
from .decorators import is_company_login
from account.models import *
from adminpanal.models import *
# Create your views here.


@is_company_login
def InitView(request):
    return HttpResponseRedirect('/companypanal/dashboard/')


@is_company_login
def DashboardView(request):
    company_obj = Token.objects.get(token=request.session.get('company_token', None)).user
    context = {
        'user': company_obj,
    }
    return render(request, 'companypanal/CompanyDashboard.html', context)


@is_company_login
def AdsLiveView(request):
    company_obj = Token.objects.get(token=request.session.get('company_token', None)).user
    stations = Station.objects.only('id', 'number', 'name')
    for station in stations:
        screen_count = Screen.objects.filter(station=station).count()
        station.screens = screen_count
    context = {
        'user': company_obj,
        'stations': stations,
    }
    return render(request, 'companypanal/CompanyAdsLive.html', context)



@is_company_login
def AdsUploadView(request):
    company_obj = Token.objects.get(token=request.session.get('company_token', None)).user
    stations = Station.objects.only('id', 'number', 'name')
    for station in stations:
        screen_count = Screen.objects.filter(station=station).count()
        station.screens = screen_count
    context = {
        'user': company_obj,
        'stations': stations,
    }
    return render(request, 'companypanal/CompanyAdsUpload.html', context)


@is_company_login
def AdsEditView(request):
    company_obj = Token.objects.get(token=request.session.get('company_token', None)).user
    context = {
        'user': company_obj,
    }
    return render(request, 'companypanal/CompanyAdsEdit.html', context)


@is_company_login
def AdsDeleteView(request):
    company_obj = Token.objects.get(token=request.session.get('company_token', None)).user
    context = {
        'user': company_obj,
    }
    return render(request, 'companypanal/CompanyAdsDelete.html', context)
