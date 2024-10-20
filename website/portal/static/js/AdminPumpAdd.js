var pump_div = document.getElementById('added_pumps');
// pump_div.innerHTML = '';
var counter = 1;

function addPump(){
    var pump_number = document.getElementById('pump_number');
    // console.log(pump_number.value);
    // console.log(counter);
    if(counter == 1){
        pump_div.innerHTML = '';
    }
    if(pump_number.value){
        pump_number.classList.remove('bg-danger', 'text-white');
        var added_pump = `
            <div class="row py-2 my-2 bg-dark" id="pump_div_${counter}">
                <div class="col-2 d-flex justify-content-center align-items-center">
                    <h6 class="m-0 text-white">Pump</h6>
                </div>
                <div class="col-6 d-flex justify-content-center align-items-center">
                    <input class="form-control" type="number" id="pump_number_${counter}" value="${pump_number.value}" min="0" name="pumps" placeholder="Enter Pump Number" readonly>
                </div>
                <div class="col-4 d-flex justify-content-center align-items-center">
                    <button class="btn btn-success me-4" id="edit_pump_btn_${counter}" onclick="editPump('${counter}')">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="btn btn-success me-4 d-none" id="approve_pump_btn_${counter}" onclick="approvePump('${counter}')">
                        <i class="fa-solid fa-check"></i>
                    </button>
                    <button class="btn btn-danger" onclick="deletePump('${counter}')">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        pump_div.innerHTML = added_pump + pump_div.innerHTML;
        counter++;
        pump_number.value = '';
        document.getElementById('submit_btn').removeAttribute('disabled');
    }else{
        pump_number.classList.add('bg-danger', 'text-white');
    }
}

function editPump(pumpID){
    document.getElementById(`pump_number_${pumpID}`).removeAttribute('readonly');
    document.getElementById(`edit_pump_btn_${pumpID}`).classList.add('d-none');
    document.getElementById(`approve_pump_btn_${pumpID}`).classList.remove('d-none');
}

function approvePump(pumpID){
    document.getElementById(`pump_number_${pumpID}`).setAttribute('readonly', 'true');
    document.getElementById(`edit_pump_btn_${pumpID}`).classList.remove('d-none');
    document.getElementById(`approve_pump_btn_${pumpID}`).classList.add('d-none');
}

function deletePump(pumpID){
    var row = document.getElementById(`pump_div_${pumpID}`);
    row.remove();
    counter--;
    if(counter == 1){
        pump_div.innerHTML = `<div class="row" style="height: 145px;">
            <div class="col-12 d-flex justify-content-center align-items-center">
                <h3 class="m-0">No Pumps Added</h3>
            </div>
        </div>`;
        document.getElementById('submit_btn').setAttribute('disabled', 'true');
    }
}


document.getElementById('station').addEventListener('change', (e)=>{
    // console.log(e.target.value);
    $.ajax({
        url: "/adminpanal/pump/add/api/",
        method: "GET",
        dataType: "json",
        data: {
            'station_id': e.target.value,
        },
        success: function (response) {
            // Handle the successful response
            // console.log(response);
            document.getElementById('pump_number').removeAttribute('disabled');
            document.getElementById('add_pump').removeAttribute('disabled');
            if (response.status == 'empty') {
                var pump_viewer = document.getElementById('pumpViewer');
                pump_viewer.innerHTML = '';
                var pump_row = `<div class="row" style="height: 260px;">
                    <div class="col-12 d-flex justify-content-center align-items-center">
                        <h3 class="text-white m-0" id="empty_msg">Station Pumps Preview</h3>
                    </div>
                </div>`;
                pump_viewer.innerHTML = pump_row;
                document.getElementById('empty_msg').innerHTML = "The station has no pumps configured yet.";
            }
            if (response.status == 'done') {
                var pump_viewer = document.getElementById('pumpViewer');
                pump_viewer.innerHTML = '';
                response.data.forEach((element) => {
                    // console.log(element);
                    var pump_row = `<div class="row py-2 my-2 bg-light">
                        <div class="col-6 d-flex justify-content-center align-items-center">
                            <h6 class="m-0">Pump ${element.number}</h6>
                        </div>
                        <div class="col-6 d-flex justify-content-center align-items-center">
                            <h6 class="m-0">${element.timestamp}</h6>
                        </div>
                    </div>`;
                    pump_viewer.innerHTML += pump_row;
                });
            }
        }
    });
});

function ResetPumps(){
    $('#station').selectpicker('val', '');
    document.getElementById('pumpViewer').innerHTML = `<div class="row" style="height: 260px;">
        <div class="col-12 d-flex justify-content-center align-items-center">
            <h3 class="text-white m-0" id="empty_msg">Station Pumps Preview</h3>
        </div>
    </div>`;
    document.getElementById('pump_number').setAttribute('disabled', 'true');
    document.getElementById('add_pump').setAttribute('disabled', 'true');
    document.getElementById('added_pumps').innerHTML = `<div class="row" style="height: 145px;">
        <div class="col-12 d-flex justify-content-center align-items-center">
            <h3 class="m-0">No Pumps Added</h3>
        </div>
    </div>`;
    document.getElementById('submit_btn').setAttribute('disabled', 'true');
    counter = 1;
}

function SubmitPumps(){
    var station = document.getElementById('station');
    var pumpInputs = document.getElementsByName('pumps');
    // Iterate over the input elements and get their values
    var pumpValues = [];
    for (var i = 0; i < pumpInputs.length; i++) {
        pumpValues.push(pumpInputs[i].value);
    }

    // Log the values or do something with them
    console.log(pumpValues, station.value);

    $.ajax({
        url: "/adminpanal/pump/add/",
        method: "GET",
        dataType: "json",
        data: {
            'station': station.value,
            'pumps': pumpValues,
        },
        success: function (response) {
            // Handle the successful response
            console.log(response);
            if(response.status == 'added'){
                ResetPumps();
                document.getElementById('success_msg').classList.remove('d-none');
                setTimeout(()=>{
                    document.getElementById('success_msg').classList.add('d-none');
                },2000)
            }
            if(response.status == 'exists'){
                ResetPumps();
                document.getElementById('error_msg').classList.remove('d-none');
                document.getElementById('pump_exist_list').innerHTML = response.data;
                setTimeout(()=>{
                    document.getElementById('error_msg').classList.add('d-none');
                    document.getElementById('pump_exist_list').innerHTML = '';
                },10000)
            }
        }
    });
}