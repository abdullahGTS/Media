from datetime import datetime
import re
from django.http import HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from .decorators import is_admin_login
from account.models import *
from .models import *
import xml.etree.ElementTree as ET
import pandas as pd
# Create your views here.


@is_admin_login
def InitView(request):
    return HttpResponseRedirect('/adminpanal/dashboard/')


@is_admin_login
def DashboardView(request):
    admin_obj = Token.objects.get(
        token=request.session.get('admin_token')).user
    context = {
        'user': admin_obj,
    }
    return render(request, 'adminpanal/AdminDashboard.html', context)


@is_admin_login
def ProductView(request):
    admin_obj = Token.objects.get(
        token=request.session.get('admin_token')).user
    products = Product.objects.all()
    context = {
        'user': admin_obj,
        'products': products,
    }
    return render(request, 'adminpanal/AdminProduct.html', context)


def ProductAddApi(request):
    if request.GET:
        product_num = request.GET.get('product_num', None)
        product_name = request.GET.get('product_name', None)
        product_price = request.GET.get('product_price', None)
        check_product = Product.objects.filter(number=product_num)
        if check_product.exists():
            return JsonResponse(data={'status': 'exists'}, safe=False)
        new_product = Product.objects.create(
            number=product_num,
            name=product_name,
            price=float(product_price),
        )
        data = {
            'status': 'added',
            'id': new_product.id,
            'number': new_product.number,
            'name': new_product.name,
            'price': new_product.price,
            'timestamp': new_product.timestamp,
        }
        return JsonResponse(data=data, safe=False)
    return JsonResponse(data={'status': 'No Get'}, safe=False)


def ProductDeleteApi(request):
    if request.GET:
        product_id = request.GET.get('product_id', None)
        check_product = Nozzle.objects.filter(product_id=product_id)
        if check_product.exists():
            return JsonResponse(data={'status': 'exists'}, safe=False)
        Product.objects.filter(id=product_id).delete()
        return JsonResponse(data={'status': 'deleted'}, safe=False)
    return JsonResponse(data={'status': 'No Get'}, safe=False)


@is_admin_login
def StationAddView(request):
    admin_obj = Token.objects.get(
        token=request.session.get('admin_token')).user
    if request.POST:
        num = request.POST.get('num', None)
        name = request.POST.get('name', None)
        fusion_ip = request.POST.get('fusion_ip', None)
        fusion_port = request.POST.get('fusion_port', None)
        long = request.POST.get('long', None)
        lat = request.POST.get('lat', None)
        central_area = request.POST.get('central_area', None)
        governorate = request.POST.get('governorate', None)

        check_station = Station.objects.filter(number=num)
        
        if check_station.exists():
            return JsonResponse(data={'status': 'exists'}, safe=False)
        
        station_obj = Station.objects.create(
            number=num,
            name=name,
            long=long,
            lat=lat,
            fusion_ip=fusion_ip,
            fusion_port=fusion_port,
            last_connection=datetime.now(),
            governorate_id=governorate,
            central_area_id=central_area
        )

        if request.FILES:
            file = request.FILES.get('filepond')
            print('File received:', request.FILES.get('filepond'))
            xml_file = StationFileHandler.objects.create(
                file=file,
                station=station_obj
            )
            tree = ET.parse(xml_file.file)
            root = tree.getroot().find('pump')
            # Iterate over each 'pump_def' element within 'pump'
            print(root.findall('pump_def'))
            # Iterate over each 'pump_def' element
            for pump_def in root.findall('pump_def'):
                pump_id = pump_def.get('ID')
                hose_ids = []
                pump_obj = Pump.objects.create(
                    number=pump_id,
                    station=station_obj
                )
                # Find all elements with tag name starting with 'hose'
                for hose in pump_def:
                    if re.match(r'^hose\d+$', hose.tag):
                        grade = hose.find('grade').text
                        real_id = hose.find('real_id').text
                        hose_ids.append(real_id)
                        product_id = 0
                        if grade == 'Gasoline95':
                            product_id = 1
                        if grade == 'Gasoline92':
                            product_id = 2
                        if grade == 'Gasoline80':
                            product_id = 3
                        if grade == 'Diesel':
                            product_id = 4
                        if grade == 'CNG':
                            product_id = 5
                        Nozzle.objects.create(
                            number=real_id,
                            product_id=product_id,
                            pump=pump_obj,
                            station=station_obj
                        )

                print(f'Pump ID: {pump_id}, Hose Real IDs: {hose_ids}')
                # You can further process or store this information as needed
        return JsonResponse(data={'status': 'added'}, safe=False)
    central_areas = CentralArea.objects.all()
    governorates = Governorate.objects.all()
    context = {
        'user': admin_obj,
        'central_areas': central_areas,
        'governorates': governorates,
    }
    return render(request, 'adminpanal/AdminStationAdd.html', context)


def StationAddFusionApi(request):
    if request.GET:
        station_num = request.GET.get('station_num', None)
        check_num = Fusion.objects.filter(station=station_num)
        if check_num.exists():
            data = {
                'ip': check_num.first().ip,
                'port': check_num.first().port,
                'status': 'found',
            }
            return JsonResponse(data=data, safe=False)
        else:
            data = {
                'status': 'notFound',
            }
            return JsonResponse(data=data, safe=False)
    return JsonResponse(data={'status': 'no get request'}, safe=False)
            

@is_admin_login
def StationViewView(request):
    admin_obj = Token.objects.get(
        token=request.session.get('admin_token')).user
    stations = Station.objects.select_related('governorate', 'central_area').only(
        'number',
        'name',
        'long',
        'lat',
        'fusion_ip',
        'fusion_port',
        'governorate__name',
        'central_area__name',
    )
    context = {
        'user': admin_obj,
        'station_numbers': stations.values('number').distinct(),
        'station_names': stations.values('name').distinct(),
        'fusion_ips': stations.values('fusion_ip').distinct(),
        'fusion_ports': stations.values('fusion_port').distinct(),
        'longitudes': stations.values('long').distinct(),
        'latitudes': stations.values('lat').distinct(),
        'central_areas': stations.values('central_area__name').distinct(),
        'governorates': stations.values('governorate__name').distinct(),
    }
    return render(request, 'adminpanal/AdminStationView.html', context)


def StationViewApi(request):
    if request.GET:
        number = request.GET.get('number', None)
        name = request.GET.get('name', None)
        fusion_ip = request.GET.get('fusion_ip', None)
        fusion_port = request.GET.get('fusion_port', None)
        long = request.GET.get('long', None)
        lat = request.GET.get('lat', None)
        central_area = request.GET.get('central_area', None)
        gov = request.GET.get('gov', None)
        lc_from = request.GET.get('lc_from', None)
        lc_to = request.GET.get('lc_to', None)
        ts_from = request.GET.get('ts_from', None)
        ts_to = request.GET.get('ts_to', None)

        station_list = Station.objects.select_related(
            'governorate', 'central_area')
        if number:
            station_list = station_list.filter(number=number)
        if name:
            station_list = station_list.filter(name=name)
        if fusion_ip:
            station_list = station_list.filter(fusion_ip=fusion_ip)
        if fusion_port:
            station_list = station_list.filter(fusion_port=fusion_port)
        if long:
            station_list = station_list.filter(long=long)
        if lat:
            station_list = station_list.filter(lat=lat)
        if central_area:
            station_list = station_list.filter(central_area__name=central_area)
        if gov:
            station_list = station_list.filter(governorate__name=gov)
        if lc_from:
            station_list = station_list.filter(last_connection__gte=lc_from)
        if lc_to:
            station_list = station_list.filter(last_connection__lte=lc_to)
        if ts_from:
            station_list = station_list.filter(timestamp__gte=ts_from)
        if ts_to:
            station_list = station_list.filter(timestamp__lte=ts_to)

        station_data = [
            {
                'number': st.number,
                'name': st.name,
                'long': st.long,
                'lat': st.lat,
                'fusion_ip': st.fusion_ip,
                'fusion_port': st.fusion_port,
                'last_connection': date_time_formatter(st.last_connection),
                'governorate': st.governorate.name,
                'central_area': st.central_area.name,
                'timestamp': date_time_formatter(st.timestamp),
            }
            for st in station_list
        ]

        return JsonResponse(data=station_data, safe=False)
    return JsonResponse(data={'status': 'no get request'}, safe=False)


@is_admin_login
def PumpAddView(request):
    admin_obj = Token.objects.get(
        token=request.session.get('admin_token')).user
    if request.GET:
        # print(request.GET)
        station = request.GET.get('station', None)
        pumps = request.GET.getlist('pumps[]', None)
        # print(station, pumps)
        station_pumps = [int(pump.number) for pump in Pump.objects.filter(station_id=station).only('number')]
        # print(station_pumps)
        pump_exist = []
        pump_list = []
        for pump in pumps:
            if int(pump) in station_pumps:
                # print(pump in station_pumps)
                pump_exist.append(f"Pump {pump}")
            else:
                pump_list.append(Pump(number=pump, station_id=station))
        if len(pump_exist) > 0:
            return JsonResponse(data={'status': 'exists', 'data': pump_exist}, safe=False)
        else:
            Pump.objects.bulk_create(pump_list)
        return JsonResponse(data={'status': 'added'}, safe=False)
    stations = Station.objects.only('id', 'number', 'name')
    context = {
        'user': admin_obj,
        'stations': stations,
    }
    return render(request, 'adminpanal/AdminPumpAdd.html', context)


def PumpAddApi(request):
    if request.GET:
        station_id = request.GET.get('station_id', None)
        pumps = Pump.objects.filter(station_id=station_id)
        if len(pumps) <= 0:
            return JsonResponse(data={'status': 'empty'}, safe=False)
        else:
            data = [
                {
                    'number': pump.number,
                    'timestamp': date_time_formatter(pump.timestamp),
                }
                for pump in pumps
            ]
        return JsonResponse(data={'status': 'done', 'data': data}, safe=False)
    return JsonResponse(data={'status': 'No Get'}, safe=False)


@is_admin_login
def PumpViewView(request):
    admin_obj = Token.objects.get(
        token=request.session.get('admin_token')).user
    pumps = Pump.objects.select_related('station').only(
        'number', 'station__name', 'timestamp')
    context = {
        'user': admin_obj,
        'pump_numbers': pumps.values('number').distinct(),
        'station_names': pumps.values('station__name').distinct(),
    }
    return render(request, 'adminpanal/AdminPumpView.html', context)


def PumpViewApi(request):
    if request.GET:
        number = request.GET.get('number', None)
        name = request.GET.get('name', None)
        ts_from = request.GET.get('ts_from', None)
        ts_to = request.GET.get('ts_to', None)

        pumps = Pump.objects.select_related('station')
        if number:
            pumps = pumps.filter(number=number)
        if name:
            pumps = pumps.filter(station__name=name)
        if ts_from:
            pumps = pumps.filter(timestamp__gte=ts_from)
        if ts_to:
            pumps = pumps.filter(timestamp__lte=ts_to)

        station_data = [
            {
                'number': pump.number,
                'name': pump.station.name,
                'timestamp': date_time_formatter(pump.timestamp),
            }
            for pump in pumps
        ]

        return JsonResponse(data=station_data, safe=False)
    return JsonResponse(data={'status': 'no get request'}, safe=False)


@is_admin_login
def NozzleAddView(request):
    admin_obj = Token.objects.get(
        token=request.session.get('admin_token')).user
    stations = Station.objects.only('id', 'number', 'name')
    products = Product.objects.only('number', 'name')
    context = {
        'user': admin_obj,
        'stations': stations,
        'products': products,
    }
    return render(request, 'adminpanal/AdminNozzleAdd.html', context)


def NozzleAddPumpView(request):
    if request.GET:
        station_id = request.GET.get('station_id', None)

        pumps = Pump.objects.filter(station_id=station_id)
        pumps_data = [
            {
                'id': pump.id,
                'number': pump.number,
            }
            for pump in pumps
        ]

        return JsonResponse(data=pumps_data, safe=False)
    return JsonResponse(data={'status': 'no get request'}, safe=False)


def NozzleAddNozzlesView(request):
    if request.GET:
        pump_id = request.GET.get('pump_id', None)

        nozzles = Nozzle.objects.select_related(
            'product').filter(pump_id=pump_id)
        if len(nozzles) <= 0:
            return JsonResponse(data={'status': 'empty'}, safe=False)
        else:
            data = [
                {
                    'number': nozzle.number,
                    'product': nozzle.product.name,
                    'timestamp': date_time_formatter(nozzle.timestamp),
                }
                for nozzle in nozzles
            ]
        return JsonResponse(data={'status': 'done', 'data': data}, safe=False)
    return JsonResponse(data={'status': 'No Get'}, safe=False)


def NozzleAddApi(request):
    if request.GET:
        station = request.GET.get('station', None)
        pump = request.GET.get('pump', None)
        product = request.GET.get('product', None)
        nozzles = request.GET.getlist('nozzles[]', None)
        # print(
        #     station,
        #     pump,
        #     product,
        #     nozzles,
        # )
        cur_nozzles = Nozzle.objects.filter(product_id=product,pump_id=pump,station_id=station)
        nozzle_nums = [int(noz.number) for noz in cur_nozzles]
        nozzles_exists = []
        nozzles_list = []
        for nozzle in nozzles:
            if int(nozzle) in nozzle_nums:
                nozzles_exists.append(f"Nozzle {nozzle}")
            else:
                nozzles_list.append(
                    Nozzle(
                        number=nozzle,
                        product_id=product,
                        pump_id=pump,
                        station_id=station,
                    )
                )
        if len(nozzle_nums) > 0:
            return JsonResponse(data={'status': 'exists', 'data': nozzles_exists}, safe=False)
        else:
            Nozzle.objects.bulk_create(nozzles_list)
        return JsonResponse(data={'status': 'added'}, safe=False)
    return JsonResponse(data={'status': 'No Get'}, safe=False)


@is_admin_login
def NozzleViewView(request):
    admin_obj = Token.objects.get(
        token=request.session.get('admin_token')).user
    nozzles = Nozzle.objects.select_related('product', 'pump', 'station').all()
    context = {
        'user': admin_obj,
        'nozzle_numbers': nozzles.values('id', 'number').distinct(),
        'product_names': nozzles.values('product_id', 'product__name').distinct(),
        'pump_numbers': nozzles.values('pump_id', 'pump__number').distinct(),
        'station_names': nozzles.values('station_id', 'station__name').distinct(),
    }
    return render(request, 'adminpanal/AdminNozzleView.html', context)


def NozzleViewApi(request):
    if request.GET:
        nozzleNum = request.GET.get('nozzleNum', None)
        product = request.GET.get('product', None)
        pump = request.GET.get('pump', None)
        station = request.GET.get('station', None)
        ts_from = request.GET.get('ts_from', None)
        ts_to = request.GET.get('ts_to', None)

        nozzles = Nozzle.objects.select_related('product', 'pump', 'station')
        if nozzleNum:
            nozzles = nozzles.filter(id=nozzleNum)
        if product:
            nozzles = nozzles.filter(product_id=product)
        if pump:
            nozzles = nozzles.filter(pump_id=pump)
        if station:
            nozzles = nozzles.filter(station_id=station)
        if ts_from:
            nozzles = nozzles.filter(timestamp__gte=ts_from)
        if ts_to:
            nozzles = nozzles.filter(timestamp__lte=ts_to)

        nozzles_data = [
            {
                'number': nozzle.number,
                'product': nozzle.product.name,
                'pump': nozzle.pump.number,
                'station': nozzle.station.name,
                'timestamp': date_time_formatter(nozzle.timestamp),
            }
            for nozzle in nozzles
        ]

        return JsonResponse(data=nozzles_data, safe=False)
    return JsonResponse(data={'status': 'no get request'}, safe=False)




@is_admin_login
def FusionAddView(request):
    admin_obj = Token.objects.get(
        token=request.session.get('admin_token')).user
    if request.POST:
        num = request.POST.get('num', None)
        fusion_ip = request.POST.get('fusion_ip', None)
        fusion_port = request.POST.get('fusion_port', None)

        check_fusion = Fusion.objects.filter(
            station=num,
            ip=fusion_ip,
            port=fusion_port
        )
        
        if check_fusion.exists():
            return JsonResponse(data={'status': 'exists'}, safe=False)
        
        if num and fusion_ip and fusion_port:
            fusion_obj = Fusion.objects.create(
                station=num,
                ip=fusion_ip,
                port=fusion_port
            )

        if request.FILES:
            file = request.FILES.get('filepond')
            print('File received:', request.FILES.get('filepond'))
            excel_file = FusionFileHandler.objects.create(file=file)
            try:
                fusions_list = []
                df = pd.read_excel(excel_file.file, engine='openpyxl')
                for index, row in df.iterrows():
                    # print(row['station'], row['fusion_ip'], row['fusion_port'])
                    fusions_list.append(
                        Fusion(
                            station=row['station'],
                            ip=row['fusion_ip'],
                            port=row['fusion_port']
                        )
                    )
                Fusion.objects.bulk_create(fusions_list)
            except Exception as e:
                print("Error reading Excel file:", e)
                
        return JsonResponse(data={'status': 'added'}, safe=False)
    context = {
        'user': admin_obj,
    }
    return render(request, 'adminpanal/AdminFusionAdd.html', context)


@is_admin_login
def FusionViewView(request):
    admin_obj = Token.objects.get(
        token=request.session.get('admin_token')).user
    fusions = Fusion.objects.all()
    context = {
        'user': admin_obj,
        'station_numbers': fusions.values('station').distinct(),
        'fusion_ips': fusions.values('ip').distinct(),
        'fusion_ports': fusions.values('port').distinct(),
    }
    return render(request, 'adminpanal/AdminFusionView.html', context)


def FusionViewApi(request):
    if request.GET:
        station = request.GET.get('station', None)
        fusion_ip = request.GET.get('fusion_ip', None)
        fusion_port = request.GET.get('fusion_port', None)
        ts_from = request.GET.get('ts_from', None)
        ts_to = request.GET.get('ts_to', None)

        fusions_list = Fusion.objects.all()
        if station:
            fusions_list = fusions_list.filter(station=station)
        if fusion_ip:
            fusions_list = fusions_list.filter(ip=fusion_ip)
        if fusion_port:
            fusions_list = fusions_list.filter(port=fusion_port)
        if ts_from:
            fusions_list = fusions_list.filter(timestamp__gte=ts_from)
        if ts_to:
            fusions_list = fusions_list.filter(timestamp__lte=ts_to)

        fusions_data = [
            {
                'station': fusion.station,
                'fusion_ip': fusion.ip,
                'fusion_port': fusion.port,
                'timestamp': date_time_formatter(fusion.timestamp),
            }
            for fusion in fusions_list
        ]

        return JsonResponse(data=fusions_data, safe=False)
    return JsonResponse(data={'status': 'no get request'}, safe=False)



@is_admin_login
def ScreenAddView(request):
    admin_obj = Token.objects.get(
        token=request.session.get('admin_token')).user
    stations = Nozzle.objects.select_related('station').only('station_id', 'station__number', 'station__name')
    context = {
        'user': admin_obj,
        'stations': stations.values('station_id', 'station__number', 'station__name').distinct()
    }
    return render(request, 'adminpanal/AdminScreenAdd.html', context)



def ScreenAddApi(request):
    if request.GET:
        station = request.GET.get('station', None)
        pump = request.GET.get('pump', None)
        android_id = request.GET.get('android_id', None)

        check_screen = Screen.objects.filter(
            android_id= android_id,
            pump_id = pump,
            station_id = station
        )
        if check_screen.exists():
            return JsonResponse(data={'status': 'exists'}, safe=False)
        
        Screen.objects.create(
            android_id= android_id,
            pump_id = pump,
            station_id = station,
            status=screen_status[0][0],
            last_connection=datetime.now()
        )
        return JsonResponse(data={'status': 'added'}, safe=False)
    return JsonResponse(data={'status': 'No Get'}, safe=False)


def ScreenAddPumpView(request):
    if request.GET:
        station_id = request.GET.get('station_id', None)

        nozzles = Nozzle.objects.select_related('pump').filter(station_id=station_id).values('pump_id', 'pump__number').distinct()
        screen_pumps = [screen.pump.id for screen in Screen.objects.select_related('pump').only('pump_id')]
        print(screen_pumps)
        # print(nozzles)
        pumps_data = []
        for nozzle in nozzles:
            if nozzle['pump_id'] not in screen_pumps:
                pumps_data.append(
                    {
                        'id': nozzle['pump_id'],
                        'number': nozzle['pump__number'],
                    }
                )

        return JsonResponse(data=pumps_data, safe=False)
    return JsonResponse(data={'status': 'no get request'}, safe=False)


def ScreenAddNozzlesView(request):
    if request.GET:
        pump_id = request.GET.get('pump_id', None)

        nozzles = Nozzle.objects.select_related(
            'product').filter(pump_id=pump_id)
        data = [
            {
                'number': nozzle.number,
                'product': nozzle.product.name,
                'price': nozzle.product.price
            }
            for nozzle in nozzles
        ]
        return JsonResponse(data={'status': 'done', 'data': data}, safe=False)
    return JsonResponse(data={'status': 'No Get'}, safe=False)


@is_admin_login
def ScreenViewView(request):
    admin_obj = Token.objects.get(
        token=request.session.get('admin_token')).user
    screens = Screen.objects.select_related('pump', 'station')\
        .only('id', 'android_id', 'pump_id', 'pump__number', 'station_id', 'station__name')
    context = {
        'user': admin_obj,
        'android_ids': screens.values('id', 'android_id').distinct(),
        'pump_numbers': screens.values('pump_id', 'pump__number').distinct(),
        'station_names': screens.values('station_id', 'station__name').distinct(),
        'status_list': screen_status,
    }
    return render(request, 'adminpanal/AdminScreenView.html', context)


def ScreenViewApi(request):
    if request.GET:
        android_id = request.GET.get('android_id', None)
        pump = request.GET.get('pump', None)
        station = request.GET.get('station', None)
        status = request.GET.get('status', None)
        lc_from = request.GET.get('lc_from', None)
        lc_to = request.GET.get('lc_to', None)
        ts_from = request.GET.get('ts_from', None)
        ts_to = request.GET.get('ts_to', None)

        screens_list = Screen.objects.select_related('pump', 'station').all()
        
        if android_id:
            screens_list = screens_list.filter(id=android_id)
        if pump:
            screens_list = screens_list.filter(pump_id=pump)
        if station:
            screens_list = screens_list.filter(station_id=station)
        if status:
            screens_list = screens_list.filter(status=status)
        if lc_from:
            screens_list = screens_list.filter(last_connection__gte=lc_from)
        if lc_to:
            screens_list = screens_list.filter(last_connection__lte=lc_to)
        if ts_from:
            screens_list = screens_list.filter(timestamp__gte=ts_from)
        if ts_to:
            screens_list = screens_list.filter(timestamp__lte=ts_to)

        screens_data = [
            {
                'android_id': screen.android_id,
                'pump': screen.pump.number,
                'station': screen.station.name,
                'status': screen.get_status_display(),
                'last_connection': date_time_formatter(screen.last_connection),
                'timestamp': date_time_formatter(screen.timestamp),
            }
            for screen in screens_list
        ]

        return JsonResponse(data=screens_data, safe=False)
    return JsonResponse(data={'status': 'no get request'}, safe=False)



def date_time_formatter(date):
    # Format the datetime as "Month Day, Year, Hour:Minute a.m./p.m."
    formatted_date = date.strftime("%m/%d/%Y %H:%M")
    # formatted_date = date.strftime("%b. %d, %Y, %I:%M %p")
    # print(formatted_date)
    return formatted_date
