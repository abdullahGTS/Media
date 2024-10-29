let pond;

document.addEventListener('DOMContentLoaded', () => {
    // Get a reference to the file input element
    const inputElement = document.querySelector('.my-pond');
    FilePond.registerPlugin(
        FilePondPluginFileEncode,
        FilePondPluginFileValidateSize,
    );

    // Create a FilePond instance
    pond = FilePond.create(inputElement, {
        acceptedFileTypes: ['text/xml'],
        // allowMultiple: true,
        instantUpload: false,
        maxFileSize: '1MB', // Set the maximum file size to 5 MB
        onaddfile: (error, fileItem) => {
            if (error) {
                console.log('FilePond error:', error);
            } else {
                console.log('File added:', fileItem.file);
                const file = fileItem.file;
                const reader = new FileReader();
                reader.onload = function (e) {
                    const xmlString = e.target.result;
                    displayXML(xmlString);
                };
                reader.readAsText(file);
            }
        },
        onremovefile: (error, fileItem) => {
            if (error) {
                console.log('FilePond error:', error);
            } else {
                console.log('File removed:', fileItem.file);
                // Clear the XML viewer when a file is removed
                document.getElementById('xmlViewer').innerHTML = `<div class="row" style="height: 300px;">
                                                    <div class="col-12 d-flex justify-content-center align-items-center">
                                                        <h3 class="text-white">XML File Preview</h3>
                                                    </div>
                                                </div>`;
            }
        }
    });

    function displayXML(xmlString) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
        const serializer = new XMLSerializer();
        const formattedXML = serializer.serializeToString(xmlDoc);
        document.getElementById('xmlViewer').innerHTML = `<pre style="color: #fff;">${escapeHTML(formattedXML)}</pre>`;
    }

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, function (tag) {
            const charsToReplace = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            };
            return charsToReplace[tag] || tag;
        });
    }
});


function ResetStation() {
    document.getElementById('num').classList.remove('bg-danger', 'text-white');
    document.getElementById('name').classList.remove('bg-danger', 'text-white');
    document.getElementById('fusion_ip').classList.remove('bg-danger', 'text-white');
    document.getElementById('fusion_port').classList.remove('bg-danger', 'text-white');
    document.getElementById('long').classList.remove('bg-danger', 'text-white');
    document.getElementById('lat').classList.remove('bg-danger', 'text-white');
    document.getElementById('central_area').classList.remove('bg-danger', 'text-white');
    document.getElementById('governorate').classList.remove('bg-danger', 'text-white');
    // $('.filepond--drop-label').removeClass('bg-danger text-white');


    document.getElementById('fusion_ip').removeAttribute('disabled');
    document.getElementById('fusion_port').removeAttribute('disabled');
    document.getElementById('load_btn').removeAttribute('disabled');

    document.getElementById('num').value = '';
    document.getElementById('name').value = '';
    document.getElementById('fusion_ip').value = '';
    document.getElementById('fusion_port').value = '';
    document.getElementById('long').value = '';
    document.getElementById('lat').value = '';
    document.getElementById('central_area').value = '';
    document.getElementById('governorate').value = '';
    document.getElementById('xmlViewer').innerHTML = `<div class="row" style="height: 300px;">
        <div class="col-12 d-flex justify-content-center align-items-center">
            <h3 class="text-white">XML File Preview</h3>
        </div>
    </div>`;
    pond.removeFiles();
}


function SubmitStation() {
    var num = document.getElementById('num');
    var name = document.getElementById('name');
    var fusion_ip = document.getElementById('fusion_ip');
    var fusion_port = document.getElementById('fusion_port');
    var long = document.getElementById('long');
    var lat = document.getElementById('lat');
    var central_area = document.getElementById('central_area');
    var governorate = document.getElementById('governorate');
    var files = pond.getFiles();
    var flag = true;
    if (!num.value) {
        num.classList.add('bg-danger', 'text-white');
        flag = false;
    } else {
        num.classList.remove('bg-danger', 'text-white');
        flag = true;
    }
    if (!name.value) {
        name.classList.add('bg-danger', 'text-white');
        flag = false;
    } else {
        name.classList.remove('bg-danger', 'text-white');
        flag = true;
    }
    if (!fusion_ip.value) {
        fusion_ip.classList.add('bg-danger', 'text-white');
        flag = false;

    } else {
        fusion_ip.classList.remove('bg-danger', 'text-white');
        flag = true;
    }
    if (!fusion_port.value) {
        fusion_port.classList.add('bg-danger', 'text-white');
        flag = false;
    }
    else {
        fusion_port.classList.remove('bg-danger', 'text-white');
        flag = true;
    }
    if (!long.value) {
        long.classList.add('bg-danger', 'text-white');
        flag = false;
    }
    else {
        long.classList.remove('bg-danger', 'text-white');
        flag = true;
    }
    if (!lat.value) {
        lat.classList.add('bg-danger', 'text-white');
        flag = false;
    }
    else {
        lat.classList.remove('bg-danger', 'text-white');
        flag = true;
    }
    if (!central_area.value) {
        central_area.classList.add('bg-danger', 'text-white');
        flag = false;
    }
    else {
        central_area.classList.remove('bg-danger', 'text-white');
        flag = true;
    }
    if (!governorate.value) {
        governorate.classList.add('bg-danger', 'text-white');
        flag = false;
    }
    else {
        governorate.classList.remove('bg-danger', 'text-white');
        flag = true;
    }
    // if (files.length <= 0) {
    //     $('.filepond--drop-label').addClass('bg-danger text-white');
    //     flag = false;
    // }
    // else {
    //     $('.filepond--drop-label').removeClass('bg-danger text-white');
    //     flag = true;
    // }

    if (flag) {
        // Create FormData object
        const formData = new FormData();
        // Append values to FormData
        formData.append('num', num.value);
        formData.append('name', name.value);
        formData.append('fusion_ip', fusion_ip.value);
        formData.append('fusion_port', fusion_port.value);
        formData.append('long', long.value);
        formData.append('lat', lat.value);
        formData.append('central_area', central_area.value);
        formData.append('governorate', governorate.value);
        // Append files to FormData
        files.forEach((file, index) => {
            console.log(file.file);
            formData.append(`filepond`, file.file);
        });

        $.ajax({
            url: '/adminpanal/station/add/',
            type: 'POST',
            dataType: 'json', // Set the content type if sending JSON data
            data: formData, // Convert data to JSON string if sending JSON
            processData: false,  // Don't process the data
            contentType: false,  // Don't set content type
            headers: {
                'X-CSRFToken': document.getElementById('csrfToken').value,
            },
            success: function (response) {
                // Handle the successful response
                console.log(response);
                if (response.status == 'added') {
                    ResetStation();
                    document.getElementById('success_msg').classList.remove('d-none');
                    setTimeout(() => {
                        document.getElementById('success_msg').classList.add('d-none');
                    }, 2000);
                }
                if (response.status == 'exists') {
                    ResetStation();
                    document.getElementById('error_msg').classList.remove('d-none');
                    setTimeout(() => {
                        document.getElementById('error_msg').classList.add('d-none');
                    }, 2000);
                }
            }
        });
    }
}


function getStationFusion(){
    var station_num = document.getElementById('num');
    if(station_num.value == ''){
        station_num.classList.add('bg-danger', 'text-white');
        setTimeout(()=>{
            station_num.classList.remove('bg-danger', 'text-white');
        },500);
    }else{
        $.ajax({
            url: "/adminpanal/station/add/fusion/api/",
            method: "GET",
            dataType: "json",
            data: {
                'station_num': station_num.value,
            },
            success: function (t) {
                console.log(t);
                var fusion_ip = document.getElementById('fusion_ip');
                var fusion_port = document.getElementById('fusion_port');
                var load_btn = document.getElementById('load_btn');
                if (t.status == 'found'){
                    fusion_ip.value = t.ip;
                    fusion_port.value = t.port;
                    fusion_ip.setAttribute('disabled', 'true');
                    fusion_port.setAttribute('disabled', 'true');
                    load_btn.setAttribute('disabled', 'true');
                }else{
                    fusion_ip.value = 'IP Not Found';
                    fusion_port.value = 'Port Not Found';
                    fusion_ip.removeAttribute('disabled');
                    fusion_port.removeAttribute('disabled');
                    fusion_ip.classList.add('bg-danger', 'text-white');
                    fusion_port.classList.add('bg-danger', 'text-white');
                    setTimeout(()=>{
                        fusion_ip.value = '';
                        fusion_port.value = '';
                        fusion_ip.classList.remove('bg-danger', 'text-white');
                        fusion_port.classList.remove('bg-danger', 'text-white');
                    },2000);
                }
            },
        });
    }
}

document.getElementById('num').addEventListener('keyup', (e)=>{
    if(e.target.value == ''){
        document.getElementById('load_btn').removeAttribute('disabled');
        document.getElementById('fusion_ip').value = '';
        document.getElementById('fusion_port').value = '';
        document.getElementById('fusion_ip').removeAttribute('disabled');
        document.getElementById('fusion_port').removeAttribute('disabled');
    }
});