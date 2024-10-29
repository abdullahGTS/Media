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
        acceptedFileTypes: ['.xls', '.xlsx'],
        // allowMultiple: true,
        instantUpload: false,
        maxFileSize: '5MB', // Set the maximum file size to 5 MB
        onaddfile: (error, fileItem) => {
            if (error) {
                console.log('FilePond error:', error);
            } else {
                console.log('File added:', fileItem.file);
                const file = fileItem.file;
                var reader = new FileReader();
                reader.onload = function(event) {
                    // var data = new Uint8Array(event.target.result);
                    // var workbook = XLSX.read(data, {type: 'array'});
                    // var firstSheetName = workbook.SheetNames[0];
                    // var worksheet = workbook.Sheets[firstSheetName];
                    // var html = XLSX.utils.sheet_to_html(worksheet);
                    // document.getElementById('excelViewer').innerHTML = html;
                    var data = new Uint8Array(event.target.result);
                    var workbook = XLSX.read(data, {type: 'array'});
                    var firstSheetName = workbook.SheetNames[0];
                    var worksheet = workbook.Sheets[firstSheetName];
                    
                    // Generate HTML with custom class and direction
                    var html = XLSX.utils.sheet_to_html(worksheet, { id: "excelTable" });
                    html = html.replace('<table', '<table class="excel-table"'); // Add custom class and set direction

                    document.getElementById('excelViewer').innerHTML = html;
                };
                reader.readAsArrayBuffer(file);
            }
        },
        onremovefile: (error, fileItem) => {
            if (error) {
                console.log('FilePond error:', error);
            } else {
                console.log('File removed:', fileItem.file);
                // Clear the XML viewer when a file is removed
                document.getElementById('excelViewer').innerHTML = `<div class="row" style="height: 215px;">
                    <div class="col-12 d-flex justify-content-center align-items-center">
                        <h3 class="text-white">Excel File Preview</h3>
                    </div>
                </div>`;
            }
        }
    });
});


function ResetFusion() {
    document.getElementById('num').classList.remove('bg-danger', 'text-white');
    document.getElementById('fusion_ip').classList.remove('bg-danger', 'text-white');
    document.getElementById('fusion_port').classList.remove('bg-danger', 'text-white');
    $('.filepond--drop-label').removeClass('bg-danger text-white');

    document.getElementById('num').value = '';
    document.getElementById('fusion_ip').value = '';
    document.getElementById('fusion_port').value = '';
    document.getElementById('excelViewer').innerHTML = `<div class="row" style="height: 215px;">
        <div class="col-12 d-flex justify-content-center align-items-center">
            <h3 class="text-white">Excel File Preview</h3>
        </div>
    </div>`;
    pond.removeFiles();
}


function SubmitFusion() {
    var num = document.getElementById('num');
    var fusion_ip = document.getElementById('fusion_ip');
    var fusion_port = document.getElementById('fusion_port');
    var files = pond.getFiles();
    var form_flag = true;
    var file_flag = true;
    if (!num.value) {
        num.classList.add('bg-danger', 'text-white');
        form_flag = false;
    } else {
        num.classList.remove('bg-danger', 'text-white');
        form_flag = true;
    }
    if (!fusion_ip.value) {
        fusion_ip.classList.add('bg-danger', 'text-white');
        form_flag = false;

    } else {
        fusion_ip.classList.remove('bg-danger', 'text-white');
        form_flag = true;
    }
    if (!fusion_port.value) {
        fusion_port.classList.add('bg-danger', 'text-white');
        form_flag = false;
    }
    else {
        fusion_port.classList.remove('bg-danger', 'text-white');
        form_flag = true;
    }
    if (files.length <= 0) {
        $('.filepond--drop-label').addClass('bg-danger text-white');
        file_flag = false;
    }
    else {
        $('.filepond--drop-label').removeClass('bg-danger text-white');
        file_flag = true;
    }

    if (form_flag || file_flag) {
        num.classList.remove('bg-danger', 'text-white');
        fusion_ip.classList.remove('bg-danger', 'text-white');
        fusion_port.classList.remove('bg-danger', 'text-white');
        $('.filepond--drop-label').removeClass('bg-danger text-white');
        // Create FormData object
        const formData = new FormData();
        // Append values to FormData
        formData.append('num', num.value);
        formData.append('fusion_ip', fusion_ip.value);
        formData.append('fusion_port', fusion_port.value);
        // Append files to FormData
        files.forEach((file, index) => {
            console.log(file.file);
            formData.append(`filepond`, file.file);
        });

        $.ajax({
            url: '/adminpanal/fusion/add/',
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
                    ResetFusion();
                    document.getElementById('success_msg').classList.remove('d-none');
                    setTimeout(() => {
                        document.getElementById('success_msg').classList.add('d-none');
                    }, 2000);
                }
                if (response.status == 'exists') {
                    ResetFusion();
                    document.getElementById('error_msg').classList.remove('d-none');
                    setTimeout(() => {
                        document.getElementById('error_msg').classList.add('d-none');
                    }, 2000);
                }
            }
        });
    }
}