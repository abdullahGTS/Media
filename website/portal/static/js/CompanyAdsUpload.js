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
        acceptedFileTypes: ['video/mp4'],
        // allowMultiple: true,
        instantUpload: false,
        maxFileSize: '10MB', // Set the maximum file size to 10 MB
        onaddfile: (error, fileItem) => {
            if (error) {
                console.log('FilePond error:', error);
            } else {
                console.log('File added:', fileItem.file);
                // console.log('File added:', fileItem.file.name);

                // Create a blob URL for the video file
                const videoUrl = URL.createObjectURL(fileItem.file);
                var videoPlayer = document.getElementById('test_video');

                // Set the video player source and show the player
                videoPlayer.src = videoUrl;
                videoPlayer.classList.remove('d-none');
                // Listen for the loadedmetadata event to get video duration
                videoPlayer.addEventListener('loadedmetadata', () => {
                    // console.log('Video duration:', videoPlayer.duration);
                    document.getElementById('video_name').value = fileItem.file.name;
                    document.getElementById('video_duration').value = videoPlayer.duration;
                    document.getElementById('video_duration').setAttribute('max', videoPlayer.duration);
                    videoPlayer.play();
                });
                // videoPlayer.play();
                document.getElementById('test_img').classList.add('d-none');
            }
        },
        onremovefile: (error, fileItem) => {
            if (error) {
                console.log('FilePond error:', error);
            } else {
                console.log('File removed:', fileItem.file);

                // Set the video player source and hide the player
                document.getElementById('test_video').src = '';
                document.getElementById('test_video').classList.add('d-none');
                document.getElementById('test_img').classList.remove('d-none');
                document.getElementById('video_name').value = '';
                document.getElementById('video_duration').value = '';
                document.getElementById('video_duration').removeAttribute('max');
            }
        }
    });
    $("#stationSearch").on("keyup", function () {
        var searchTerm = $(this).val().toLowerCase();
        $("#stationResultContainer > button").filter(function () {
            var divText = $(this).text().toLowerCase();
            var isMatch = divText.indexOf(searchTerm) > -1;
            $(this).toggle(isMatch);
            return isMatch;
        });
    });
});

function enableStationForm(station_id) {
    console.log(station_id);
    var buttons = document.querySelectorAll('.list-group-item');
    buttons.forEach((button)=>{
        if (button.classList.contains('bg-success')) {
            button.classList.remove('bg-success');
            button.classList.add('bg-dark');
        }
    });
    document.getElementById('station_'+station_id).classList.remove('bg-dark');
    document.getElementById('station_'+station_id).classList.add('bg-success');

    document.getElementById('video_name').removeAttribute('disabled');
    document.getElementById('video_duration').removeAttribute('disabled');
    document.getElementById('priorityBtn').removeAttribute('disabled');
    document.getElementById('resetBtn').removeAttribute('disabled');
    document.getElementById('submitBtn').removeAttribute('disabled');
}

function resetForm() {
    document.getElementById('stationSearch').value = '';
    var buttons = document.querySelectorAll('.list-group-item');
    buttons.forEach((button)=>{
        if (button.classList.contains('bg-success')) {
            button.classList.remove('bg-success');
            button.classList.add('bg-dark');
        }
    });
    document.getElementById('video_name').setAttribute('disabled', 'true');
    document.getElementById('video_duration').setAttribute('disabled', 'true');
    document.getElementById('priorityBtn').setAttribute('disabled', 'true');
    document.getElementById('resetBtn').setAttribute('disabled', 'true');
    document.getElementById('submitBtn').setAttribute('disabled', 'true');
    document.getElementById('test_video').src = '';
    document.getElementById('test_video').classList.add('d-none');
    document.getElementById('test_img').classList.remove('d-none');
    pond.removeFiles();
}


// function SubmitStation() {
//     var num = document.getElementById('num');
//     var name = document.getElementById('name');
//     var fusion_ip = document.getElementById('fusion_ip');
//     var fusion_port = document.getElementById('fusion_port');
//     var long = document.getElementById('long');
//     var lat = document.getElementById('lat');
//     var central_area = document.getElementById('central_area');
//     var governorate = document.getElementById('governorate');
//     var files = pond.getFiles();
//     var flag = true;
//     if (!num.value) {
//         num.classList.add('bg-danger', 'text-white');
//         flag = false;
//     } else {
//         num.classList.remove('bg-danger', 'text-white');
//         flag = true;
//     }
//     if (!name.value) {
//         name.classList.add('bg-danger', 'text-white');
//         flag = false;
//     } else {
//         name.classList.remove('bg-danger', 'text-white');
//         flag = true;
//     }
//     if (!fusion_ip.value) {
//         fusion_ip.classList.add('bg-danger', 'text-white');
//         flag = false;

//     } else {
//         fusion_ip.classList.remove('bg-danger', 'text-white');
//         flag = true;
//     }
//     if (!fusion_port.value) {
//         fusion_port.classList.add('bg-danger', 'text-white');
//         flag = false;
//     }
//     else {
//         fusion_port.classList.remove('bg-danger', 'text-white');
//         flag = true;
//     }
//     if (!long.value) {
//         long.classList.add('bg-danger', 'text-white');
//         flag = false;
//     }
//     else {
//         long.classList.remove('bg-danger', 'text-white');
//         flag = true;
//     }
//     if (!lat.value) {
//         lat.classList.add('bg-danger', 'text-white');
//         flag = false;
//     }
//     else {
//         lat.classList.remove('bg-danger', 'text-white');
//         flag = true;
//     }
//     if (!central_area.value) {
//         central_area.classList.add('bg-danger', 'text-white');
//         flag = false;
//     }
//     else {
//         central_area.classList.remove('bg-danger', 'text-white');
//         flag = true;
//     }
//     if (!governorate.value) {
//         governorate.classList.add('bg-danger', 'text-white');
//         flag = false;
//     }
//     else {
//         governorate.classList.remove('bg-danger', 'text-white');
//         flag = true;
//     }
//     // if (files.length <= 0) {
//     //     $('.filepond--drop-label').addClass('bg-danger text-white');
//     //     flag = false;
//     // }
//     // else {
//     //     $('.filepond--drop-label').removeClass('bg-danger text-white');
//     //     flag = true;
//     // }

//     if (flag) {
//         // Create FormData object
//         const formData = new FormData();
//         // Append values to FormData
//         formData.append('num', num.value);
//         formData.append('name', name.value);
//         formData.append('fusion_ip', fusion_ip.value);
//         formData.append('fusion_port', fusion_port.value);
//         formData.append('long', long.value);
//         formData.append('lat', lat.value);
//         formData.append('central_area', central_area.value);
//         formData.append('governorate', governorate.value);
//         // Append files to FormData
//         files.forEach((file, index) => {
//             console.log(file.file);
//             formData.append(`filepond`, file.file);
//         });

//         $.ajax({
//             url: '/adminpanal/station/add/',
//             type: 'POST',
//             dataType: 'json', // Set the content type if sending JSON data
//             data: formData, // Convert data to JSON string if sending JSON
//             processData: false,  // Don't process the data
//             contentType: false,  // Don't set content type
//             headers: {
//                 'X-CSRFToken': document.getElementById('csrfToken').value,
//             },
//             success: function (response) {
//                 // Handle the successful response
//                 console.log(response);
//                 if (response.status == 'added') {
//                     ResetStation();
//                     document.getElementById('success_msg').classList.remove('d-none');
//                     setTimeout(() => {
//                         document.getElementById('success_msg').classList.add('d-none');
//                     }, 2000);
//                 }
//                 if (response.status == 'exists') {
//                     ResetStation();
//                     document.getElementById('error_msg').classList.remove('d-none');
//                     setTimeout(() => {
//                         document.getElementById('error_msg').classList.add('d-none');
//                     }, 2000);
//                 }
//             }
//         });
//     }
// }


// function getStationFusion(){
//     var station_num = document.getElementById('num');
//     if(station_num.value == ''){
//         station_num.classList.add('bg-danger', 'text-white');
//         setTimeout(()=>{
//             station_num.classList.remove('bg-danger', 'text-white');
//         },500);
//     }else{
//         $.ajax({
//             url: "/adminpanal/station/add/fusion/api/",
//             method: "GET",
//             dataType: "json",
//             data: {
//                 'station_num': station_num.value,
//             },
//             success: function (t) {
//                 console.log(t);
//                 var fusion_ip = document.getElementById('fusion_ip');
//                 var fusion_port = document.getElementById('fusion_port');
//                 var load_btn = document.getElementById('load_btn');
//                 if (t.status == 'found'){
//                     fusion_ip.value = t.ip;
//                     fusion_port.value = t.port;
//                     fusion_ip.setAttribute('disabled', 'true');
//                     fusion_port.setAttribute('disabled', 'true');
//                     load_btn.setAttribute('disabled', 'true');
//                 }else{
//                     fusion_ip.value = 'IP Not Found';
//                     fusion_port.value = 'Port Not Found';
//                     fusion_ip.removeAttribute('disabled');
//                     fusion_port.removeAttribute('disabled');
//                     fusion_ip.classList.add('bg-danger', 'text-white');
//                     fusion_port.classList.add('bg-danger', 'text-white');
//                     setTimeout(()=>{
//                         fusion_ip.value = '';
//                         fusion_port.value = '';
//                         fusion_ip.classList.remove('bg-danger', 'text-white');
//                         fusion_port.classList.remove('bg-danger', 'text-white');
//                     },2000);
//                 }
//             },
//         });
//     }
// }

// document.getElementById('num').addEventListener('keyup', (e)=>{
//     if(e.target.value == ''){
//         document.getElementById('load_btn').removeAttribute('disabled');
//         document.getElementById('fusion_ip').value = '';
//         document.getElementById('fusion_port').value = '';
//         document.getElementById('fusion_ip').removeAttribute('disabled');
//         document.getElementById('fusion_port').removeAttribute('disabled');
//     }
// });