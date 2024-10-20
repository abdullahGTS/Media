document.getElementById('station').addEventListener('change', (e)=>{
    $.ajax({
        url: "/adminpanal/nozzle/add/pump/api/",
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
        url: "/adminpanal/nozzle/add/nozzles/api/",
        method: "GET",
        dataType: "json",
        data: {
            'pump_id': e.target.value,
        },
        success: function (response) {
            // Handle the successful response
            console.log(response);
            // document.getElementById('nozzle_number').removeAttribute('disabled');
            $('#product').prop('disabled', false);
            $('#product').selectpicker('refresh');
            // document.getElementById('add_nozzle').removeAttribute('disabled');
            if (response.status == 'empty') {
                var nozzle_viewer = document.getElementById('nozzleViewer');
                nozzle_viewer.innerHTML = '';
                var nozzle_row = `<div class="row" style="height: 260px;">
                    <div class="col-12 d-flex justify-content-center align-items-center text-center">
                        <h3 class="text-white m-0" id="empty_msg">Pump Nozzles Preview</h3>
                    </div>
                </div>`;
                nozzle_viewer.innerHTML = nozzle_row;
                document.getElementById('empty_msg').innerHTML = "The Pump has no nozzles configured yet.";
            }
            if (response.status == 'done') {
                var nozzle_viewer = document.getElementById('nozzleViewer');
                nozzle_viewer.innerHTML = '';
                response.data.forEach((element) => {
                    // console.log(element);
                    var nozzle_row = `<div class="row py-2 my-2 bg-light">
                        <div class="col-4 d-flex justify-content-center align-items-center">
                            <h6 class="m-0">Nozzle ${element.number}</h6>
                        </div>
                        <div class="col-4 d-flex justify-content-center align-items-center">
                            <h6 class="m-0">${element.product}</h6>
                        </div>
                        <div class="col-4 d-flex justify-content-center align-items-center">
                            <h6 class="m-0">${element.timestamp}</h6>
                        </div>
                    </div>`;
                    nozzle_viewer.innerHTML += nozzle_row;
                });
            }
        }
    });
});


document.getElementById('product').addEventListener('change', (e)=>{
    document.getElementById('nozzle_number').removeAttribute('disabled');
    document.getElementById('add_nozzle').removeAttribute('disabled');
    // Get the current product's innerHTML
    var current_product = e.target.options[e.target.selectedIndex].innerHTML;

    // Update all elements with the class 'nozzles-product'
    var product_inputs = document.getElementsByClassName('nozzles-product');
    Array.from(product_inputs).forEach((inp) => {
        inp.value = current_product;
    });
});


var nozzle_div = document.getElementById('added_nozzles');
// nozzle_div.innerHTML = '';
var counter = 1;

function addNozzle(){
    var nozzle_number = document.getElementById('nozzle_number');
    var nozzle_product = document.getElementById('product');
    // console.log(nozzle_number.value);
    // console.log(nozzle_product.value);
    if(counter == 1){
        nozzle_div.innerHTML = '';
    }
    if(nozzle_number.value){
        nozzle_number.classList.remove('bg-danger', 'text-white');
        var added_nozzle = `
            <div class="row py-2 my-2 bg-dark" id="nozzle_div_${counter}">
                <div class="col-4 d-flex justify-content-center align-items-center">
                    <input class="form-control nozzles-product" type="text" value="${nozzle_product.options[nozzle_product.selectedIndex].innerHTML}" readonly>
                </div>
                <div class="col-2 d-flex justify-content-center align-items-center">
                    <h6 class="m-0 text-white">Nozzle</h6>
                </div>
                <div class="col-3 d-flex justify-content-center align-items-center">
                    <input class="form-control" type="number" id="nozzle_number_${counter}" value="${nozzle_number.value}" min="0" name="nozzles" placeholder="Enter Nozzle Number" readonly>
                </div>
                <div class="col-3 d-flex justify-content-center align-items-center">
                    <button class="btn btn-success me-2" id="edit_nozzle_btn_${counter}" onclick="editNozzle('${counter}')">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="btn btn-success me-2 d-none" id="approve_nozzle_btn_${counter}" onclick="approveNozzle('${counter}')">
                        <i class="fa-solid fa-check"></i>
                    </button>
                    <button class="btn btn-danger" onclick="deleteNozzle('${counter}')">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        nozzle_div.innerHTML = added_nozzle + nozzle_div.innerHTML;
        counter++;
        nozzle_number.value = '';
        document.getElementById('submit_btn').removeAttribute('disabled');
    }else{
        nozzle_number.classList.add('bg-danger', 'text-white');
    }
}

function editNozzle(nozzleID){
    document.getElementById(`nozzle_number_${nozzleID}`).removeAttribute('readonly');
    document.getElementById(`edit_nozzle_btn_${nozzleID}`).classList.add('d-none');
    document.getElementById(`approve_nozzle_btn_${nozzleID}`).classList.remove('d-none');
}

function approveNozzle(nozzleID){
    document.getElementById(`nozzle_number_${nozzleID}`).setAttribute('readonly', 'true');
    document.getElementById(`edit_nozzle_btn_${nozzleID}`).classList.remove('d-none');
    document.getElementById(`approve_nozzle_btn_${nozzleID}`).classList.add('d-none');
}

function deleteNozzle(nozzleID){
    var row = document.getElementById(`nozzle_div_${nozzleID}`);
    row.remove();
    counter--;
    if(counter == 1){
        nozzle_div.innerHTML = `<div class="row" style="height: 145px;">
            <div class="col-12 d-flex justify-content-center align-items-center">
                <h3 class="m-0">No Nozzles Added</h3>
            </div>
        </div>`;
        document.getElementById('submit_btn').setAttribute('disabled', 'true');
    }
}


function ResetNozzles(){
    $('#station').selectpicker('val', '');
    $('#pump').find('option:not(:first)').remove();
    $('#pump').selectpicker('val', '');
    $('#pump').prop('disabled', true);
    $('#pump').selectpicker('refresh');
    $('#product').selectpicker('val', '');
    $('#product').prop('disabled', true);
    $('#product').selectpicker('refresh');
    document.getElementById('nozzleViewer').innerHTML = `<div class="row" style="height: 260px;">
        <div class="col-12 d-flex justify-content-center align-items-center">
            <h3 class="text-white m-0" id="empty_msg">Pump Nozzles Preview</h3>
        </div>
    </div>`;
    document.getElementById('nozzle_number').value = '';
    document.getElementById('nozzle_number').setAttribute('disabled', 'true');
    document.getElementById('add_nozzle').setAttribute('disabled', 'true');
    document.getElementById('added_nozzles').innerHTML = `<div class="row" style="height: 145px;">
        <div class="col-12 d-flex justify-content-center align-items-center">
            <h3 class="m-0">No Nozzles Added</h3>
        </div>
    </div>`;
    document.getElementById('submit_btn').setAttribute('disabled', 'true');
    counter = 1;
}

function SubmitNozzles(){
    var station = document.getElementById('station');
    var pump = document.getElementById('pump');
    var product = document.getElementById('product');
    var nozzleInputs = document.getElementsByName('nozzles');
    // Iterate over the input elements and get their values
    var nozzleValues = [];
    for (var i = 0; i < nozzleInputs.length; i++) {
        nozzleValues.push(nozzleInputs[i].value);
    }

    // Log the values or do something with them
    console.log(station.value, pump.value, product.value, nozzleValues);

    $.ajax({
        url: "/adminpanal/nozzle/add/api/",
        method: "GET",
        dataType: "json",
        data: {
            'station': station.value,
            'pump': pump.value,
            'product': product.value,
            'nozzles': nozzleValues,
        },
        success: function (response) {
            // Handle the successful response
            console.log(response);
            if(response.status == 'added'){
                ResetNozzles();
                document.getElementById('success_msg').classList.remove('d-none');
                setTimeout(()=>{
                    document.getElementById('success_msg').classList.add('d-none');
                },2000);
            }
            if(response.status == 'exists'){
                ResetNozzles();
                document.getElementById('error_msg').classList.remove('d-none');
                document.getElementById('nozzles_exists_list').innerHTML = response.data;
                setTimeout(()=>{
                    document.getElementById('error_msg').classList.add('d-none');
                    document.getElementById('nozzles_exists_list').innerHTML = '';
                },10000);
            }
        }
    });
}