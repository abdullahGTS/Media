$("#stationSearch").on("keyup", function () {
    var searchTerm = $(this).val().toLowerCase();
    $("#stationResultContainer > button").filter(function () {
        var divText = $(this).text().toLowerCase();
        var isMatch = divText.indexOf(searchTerm) > -1;
        $(this).toggle(isMatch);
        return isMatch;
    });
});

function drawStationScreens(station_id, station_screens) {
    console.log(station_screens);
    for(var i=0;i<parseInt(station_screens);i++){
        var video_url = '/static/video/gts2.mp4';
        var screen_id = 'SKQ1.211019.001';
        var screen_status = 'offline';
        var video_now = 'July.mp4';
        var video_next = 'Oct.mp4';
        var last_conn = 'July 31, 2024, 5:17 a.m.';
        var timeline_id = i;
        var screen = StationScreens(video_url, screen_id, screen_status, video_now, video_next, last_conn, timeline_id);
        document.getElementById('screens_row').innerHTML += screen;
    }
    document.getElementById('station_'+station_id).classList.add('active');
    document.getElementById('station_'+station_id).style.transition = 'all 1s ease;';
}

function StationScreens(video_url, screen_id, screen_status, video_now, video_next, last_conn, timeline_id) {
    if(screen_status == 'online'){
        var status = `<span class="me-1" style="background-color: #00ff89;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            box-shadow: 0px 0px 10px 2px #198754;"></span>
            <span class="bg-danger" style="
                width: 30px;
                height: 30px;
                border-radius: 50%;"></span>`;
    }else if(screen_status == 'offline'){
        var status = `<span class="bg-success me-1" style="
            width: 30px;
            height: 30px;
            border-radius: 50%;"></span>
            <span style="background-color: #ff2e42;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                box-shadow: 0px 0px 10px 2px #dc3545;"></span>`;
    }else{
        var status = `<span class="bg-success me-1" style="
            width: 30px;
            height: 30px;
            border-radius: 50%;"></span>
            <span class="bg-danger" style="
                width: 30px;
                height: 30px;
                border-radius: 50%;"></span>`;
    }
    var screen = `
    <div class="col-6">
        <div class="row">
            <div class="col-6 mx-auto my-2 make-my-scrollable text-white bg-dark d-none" id="screen_status_${timeline_id}" style="max-height: 350px;min-height: 350px;border: 3px solid #000000;border-radius: 2px;">
                <div class="row mt-3">
                    <div class="col-12 d-flex justify-content-center align-items-center">
                        <h6 class="m-0 text-white">${screen_id}</h6>
                    </div>
                </div>
                <hr>
                <div class="row mt-2">
                    <div class="col-5 d-flex justify-content-start align-items-center">
                        <h6 class="m-0 text-white">Status:</h6>
                    </div>
                    <div class="col-7 d-flex justify-content-center align-items-center">
                        ${status}
                    </div>
                </div>
                <div class="row mt-2">
                    <div class="col-12 d-flex justify-content-start align-items-center">
                        <h6 class="m-0 text-white">Now:</h6>
                    </div>
                </div>
                <div class="row mt-2">
                    <div class="col-12 d-flex justify-content-center align-items-center">
                        <h6 class="m-0 text-white">${video_now}</h6>
                    </div>
                </div>
                <div class="row mt-2">
                    <div class="col-12 d-flex justify-content-start align-items-center">
                        <h6 class="m-0 text-white">Next:</h6>
                    </div>
                </div>
                <div class="row mt-2">
                    <div class="col-12 d-flex justify-content-center align-items-center">
                        <h6 class="m-0 text-white">${video_next}</h6>
                    </div>
                </div>
                <div class="row mt-2">
                    <div class="col-12 d-flex justify-content-start align-items-center">
                        <h6 class="m-0 text-white">Last Connection:</h6>
                    </div>
                </div>
                <div class="row mt-2">
                    <div class="col-12 d-flex justify-content-center align-items-center">
                        <h6 class="m-0 text-white">${last_conn}</h6>
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="col-12 d-flex justify-content-center align-items-center">
                        <button class="btn btn-light text-dark w-100" type="button" data-toggle="modal" data-target="#view_timeline_modal">Timeline</button>
                    </div>
                </div>
            </div>
            <div class="col-6 mx-auto my-2 text-white bg-dark" style="height: 350px;border: 3px solid #000000;border-radius: 2px;overflow: hidden;cursor: pointer;" onclick="$('#screen_status_${timeline_id}').toggleClass('d-none');">
                <div class="row" style="height: 230px;overflow: hidden;">
                    <div class="col-12 bg-light d-flex justify-content-center align-items-center p-0">
                        <img src="/static/img/gts.png" class="d-none" style="width: 100%;" alt="gts">
                        <video class="" controls muted style="width: 100%;height: 100%;">
                            <source src="${video_url}" type="video/mp4">
                            Your browser does not support the video tag.
                        </video>
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="col-6 d-flex justify-content-start align-items-center">
                        <h5 class="m-0 text-white">Total</h5>
                    </div>
                    <div class="col-6 d-flex justify-content-center align-items-center">
                        <input type="text" class="form-control text-center p-0" style="border-radius: 2px;font-weight: bold;" value="00.00" readonly>
                    </div>
                </div>
                <div class="row mt-1">
                    <div class="col-6 d-flex justify-content-start align-items-center">
                        <h5 class="m-0 text-white">Volume</h5>
                    </div>
                    <div class="col-6 d-flex justify-content-center align-items-center">
                        <input type="text" class="form-control text-center p-0" style="border-radius: 2px;font-weight: bold;" value="00.00" readonly>
                    </div>
                </div>
                <div class="row mt-1">
                    <div class="col-6 d-flex justify-content-start align-items-center">
                        <h5 class="m-0 text-white">Price</h5>
                    </div>
                    <div class="col-6 d-flex justify-content-center align-items-center">
                        <input type="text" class="form-control text-center p-0" style="border-radius: 2px;font-weight: bold;" value="00.00" readonly>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
    return screen;
}