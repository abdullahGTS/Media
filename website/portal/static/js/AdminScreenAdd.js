document.getElementById('station').addEventListener('change', (e)=>{
    $.ajax({
        url: "/adminpanal/screen/add/pump/api/",
        method: "GET",
        dataType: "json",
        data: {
            'station_id': e.target.value,
        },
        success: function (response) {
            // Handle the successful response
            console.log(response);
            // Enable the select element
            $('#pump').prop('disabled', false);

            // Clear existing options except the first one (Choose Pump...)
            $('#pump').find('option:not(:first)').remove();

            // Append new options
            response.forEach(function(option) {
                $('#pump').append(new Option(`Pump ${option.number}`, option.id));
            });

            // select the first option
            $('#pump').selectpicker('val', '');

            // Refresh the selectpicker to update the UI
            $('#pump').selectpicker('refresh');
        }
    });
});


document.getElementById('pump').addEventListener('change', (e)=>{
    $.ajax({
        url: "/adminpanal/screen/add/nozzles/api/",
        method: "GET",
        dataType: "json",
        data: {
            'pump_id': e.target.value,
        },
        success: function (response) {
            // Handle the successful response
            console.log(response);
            if (response.status == 'done') {
                document.getElementById('android_id').removeAttribute('disabled');
                // Enable the select element
                $('#nozzles').prop('disabled', false);
    
                // Clear existing options except the first one (Choose Pump...)
                $('#nozzles').find('option:not(:first)').remove();
    
                // Append new options
                response.data.forEach(function(option) {
                    $('#nozzles').append(new Option(`Nozzle ${option.number} - ${option.product}`, `${option.number}-${option.price}`));
                });
    
                // select the first option
                $('#nozzles').selectpicker('val', '');
    
                // Refresh the selectpicker to update the UI
                $('#nozzles').selectpicker('refresh');

                document.getElementById('submit_btn').removeAttribute('disabled');
            }
        }
    });
});

let resetId, numId, animId;

document.getElementById('nozzles').addEventListener('change', (e)=>{
    clearInterval(resetId);
    clearInterval(numId);
    clearInterval(animId);

    document.getElementById('screen_preview').classList.add('d-none');
    document.getElementById('screen_details').classList.remove('d-none');

    document.getElementById('nozzle_animation').classList.remove('d-none');
    document.getElementById('nozzle_animation').classList.add('nozzle-animation');

    var current_product = e.target.options[e.target.selectedIndex];
    var product_name = current_product.innerHTML.split(' - ')[1];
    var product_price = current_product.value.split('-')[1];

    var total = document.getElementById('total');
    var volume = document.getElementById('volume');
    var price = document.getElementById('price');

    total.value = '00.00';
    volume.value = '00.00';
    price.value = '00.00';

    document.getElementById('product_name').innerHTML = product_name;
    price.value = parseFloat(product_price).toFixed(2);

    resetId = setTimeout(()=>{
        numId = setInterval(()=>{
            volume.value = (parseFloat(volume.value) + 0.01).toFixed(2);
            total.value = (parseFloat(volume.value) * parseFloat(price.value)).toFixed(2);
        },100);
        
        animId = setTimeout(()=>{
            document.getElementById('nozzle_animation').classList.add('d-none');
            document.getElementById('nozzle_animation').classList.remove('nozzle-animation');
        },1000);
    },5000);
});



function ResetScreen(){
    $('#station').selectpicker('val', '');
    $('#pump').find('option:not(:first)').remove();
    $('#pump').selectpicker('val', '');
    $('#pump').prop('disabled', true);
    $('#pump').selectpicker('refresh');
    $('#nozzles').find('option:not(:first)').remove();
    $('#nozzles').selectpicker('val', '');
    $('#nozzles').prop('disabled', true);
    $('#nozzles').selectpicker('refresh');
    document.getElementById('android_id').value = '';
    document.getElementById('android_id').setAttribute('disabled', 'true');
    document.getElementById('screen_preview').classList.remove('d-none');
    document.getElementById('screen_details').classList.add('d-none');
    document.getElementById('nozzle_animation').classList.remove('nozzle-animation');
    document.getElementById('product_name').innerHTML = '';
    document.getElementById('total').value = '00.00';
    document.getElementById('volume').value = '00.00';
    document.getElementById('price').value = '00.00';
    clearInterval(resetId);
    clearInterval(numId);
    clearInterval(animId);
    document.getElementById('submit_btn').setAttribute('disabled', 'true');
}

function SubmitScreen(){
    var station = document.getElementById('station');
    var pump = document.getElementById('pump');
    var android_id = document.getElementById('android_id');
    
    $.ajax({
        url: "/adminpanal/screen/add/api/",
        method: "GET",
        dataType: "json",
        data: {
            'station': station.value,
            'pump': pump.value,
            'android_id': android_id.value,
        },
        success: function (response) {
            // Handle the successful response
            console.log(response);
            if(response.status == 'exists'){
                ResetScreen();
                document.getElementById('error_msg').classList.remove('d-none');
                setTimeout(()=>{
                    document.getElementById('error_msg').classList.add('d-none');
                },2000)
            }
            if(response.status == 'added'){
                ResetScreen();
                document.getElementById('success_msg').classList.remove('d-none');
                setTimeout(()=>{
                    document.getElementById('success_msg').classList.add('d-none');
                },2000)
            }
        }
    });
}