$(function () {
    filters = {
        'number': '',
        'name': '',
        'fusion_ip': '',
        'fusion_port': '',
        'long': '',
        'lat': '',
        'central_area': '',
        'gov': '',
        'lc_from': '',
        'lc_to': '',
        'ts_from': '',
        'ts_to': '',
    }
    document.getElementById("number").addEventListener("change", function () {
        // console.log(this.value);
        filters.number = this.value;
        document.getElementById('sbmtBTN').removeAttribute('disabled');
    });
    document.getElementById("name").addEventListener("change", function () {
        // console.log(this.value);
        filters.name = this.value;
        document.getElementById('sbmtBTN').removeAttribute('disabled');
    });
    document.getElementById("fusion_ip").addEventListener("change", function () {
        // console.log(this.value);
        filters.fusion_ip = this.value;
        document.getElementById('sbmtBTN').removeAttribute('disabled');
    });
    document.getElementById("fusion_port").addEventListener("change", function () {
        // console.log(this.value);
        filters.fusion_port = this.value;
        document.getElementById('sbmtBTN').removeAttribute('disabled');
    });
    document.getElementById("long").addEventListener("change", function () {
        // console.log(this.value);
        filters.long = this.value;
        document.getElementById('sbmtBTN').removeAttribute('disabled');
    });
    document.getElementById("lat").addEventListener("change", function () {
        // console.log(this.value);
        filters.lat = this.value;
        document.getElementById('sbmtBTN').removeAttribute('disabled');
    });
    document.getElementById("central_area").addEventListener("change", function () {
        // console.log(this.value);
        filters.central_area = this.value;
        document.getElementById('sbmtBTN').removeAttribute('disabled');
    });
    document.getElementById("gov").addEventListener("change", function () {
        // console.log(this.value);
        filters.gov = this.value;
        document.getElementById('sbmtBTN').removeAttribute('disabled');
    });
    document.getElementById("lc_from").addEventListener("change", function () {
        // console.log(this.value);
        filters.lc_from = this.value;
        document.getElementById('sbmtBTN').removeAttribute('disabled');
    });
    document.getElementById("lc_to").addEventListener("change", function () {
        // console.log(this.value);
        filters.lc_to = this.value;
        document.getElementById('sbmtBTN').removeAttribute('disabled');
    });
    document.getElementById("ts_from").addEventListener("change", function () {
        // console.log(this.value);
        filters.ts_from = this.value;
        document.getElementById('sbmtBTN').removeAttribute('disabled');
    });
    document.getElementById("ts_to").addEventListener("change", function () {
        // console.log(this.value);
        filters.ts_to = this.value;
        document.getElementById('sbmtBTN').removeAttribute('disabled');
    });
    document.getElementById("sbmtBTN").addEventListener("click", function () {
        document.getElementById('miniloader').classList.remove('d-none');
        document.getElementById('collapse_station_filters').classList.remove('show');
        $.ajax({
            url: "/adminpanal/station/view/api/",
            method: "GET",
            dataType: "json",
            data: {
                'number': filters.number,
                'name': filters.name,
                'fusion_ip': filters.fusion_ip,
                'fusion_port': filters.fusion_port,
                'long': filters.long,
                'lat': filters.lat,
                'central_area': filters.central_area,
                'gov': filters.gov,
                'lc_from': filters.lc_from,
                'lc_to': filters.lc_to,
                'ts_from': filters.ts_from,
                'ts_to': filters.ts_to,
            },
            success: function (t) {
                console.log(t);
                updateTableData(t);
            },
        });
    });
    document.getElementById("StNumBTN").addEventListener("click", function () {
        filters.number = '';
        $('#number').selectpicker('val', "");
    });
    document.getElementById("StNameBTN").addEventListener("click", function () {
        filters.name = '';
        $('#name').selectpicker('val', "");
    });
    document.getElementById("fusionIPBTN").addEventListener("click", function () {
        filters.fusion_ip = '';
        $('#fusion_ip').selectpicker('val', "");
    });
    document.getElementById("FusionPortBTN").addEventListener("click", function () {
        filters.fusion_port = '';
        $('#fusion_port').selectpicker('val', "");
    });
    document.getElementById("longBTN").addEventListener("click", function () {
        filters.long = '';
        $('#long').selectpicker('val', "");
    });
    document.getElementById("latBTN").addEventListener("click", function () {
        filters.lat = '';
        $('#lat').selectpicker('val', "");
    });
    document.getElementById("cenAreaBTN").addEventListener("click", function () {
        filters.central_area = '';
        $('#central_area').selectpicker('val', "");
    });
    document.getElementById("govBTN").addEventListener("click", function () {
        filters.gov = '';
        $('#gov').selectpicker('val', "");
    });
    document.getElementById("lastConBTN").addEventListener("click", function () {
        filters.lc_from = '';
        filters.lc_to = '';
        document.getElementById("lc_from").value = "";
        document.getElementById("lc_to").value = "";
    });
    document.getElementById("timestampBTN").addEventListener("click", function () {
        filters.ts_from = '';
        filters.ts_to = '';
        document.getElementById("ts_from").value = "";
        document.getElementById("ts_to").value = "";
    });
    document.getElementById("rstBTN").addEventListener("click", function () {
        filters = {
            'number': '',
            'name': '',
            'fusion_ip': '',
            'fusion_port': '',
            'long': '',
            'lat': '',
            'central_area': '',
            'gov': '',
            'lc_from': '',
            'lc_to': '',
            'ts_from': '',
            'ts_to': '',
        }
        document.getElementById('sbmtBTN').setAttribute('disabled', 'disabled');
        $('.selectpicker').selectpicker('val', "");
        document.getElementById("lc_from").value = "";
        document.getElementById("lc_to").value = "";
        document.getElementById("ts_from").value = "";
        document.getElementById("ts_to").value = "";

        var e = $("#stationTbl");
        e.bootstrapTable("showLoading");
        e.bootstrapTable("load", []);
        e.bootstrapTable("refresh");
        e.bootstrapTable("hideLoading");
        document.getElementById('card-table').classList.add('d-none');
        document.getElementById('collapse_station_filters').classList.add('show');
    });
});

function updateTableData(filteredData) {
    var e = $("#stationTbl");
    e.bootstrapTable("showLoading");
    e.bootstrapTable("load", []);
    e.bootstrapTable("load", filteredData);
    e.bootstrapTable("refresh");
    e.bootstrapTable("hideLoading");
    document.getElementById('miniloader').classList.add('d-none');
    document.getElementById('card-table').classList.remove('d-none');
    // console.log(e.bootstrapTable('getRowByUniqueId', 3645));
}


var o = $("#stationTbl");
$("#toolbar")
    .find("select")
    .change(function () {
        var filename = document.getElementById('exportFileName').value;
        var currentDate = new Date();
        var temp_table = o.bootstrapTable().bootstrapTable('getData');
        o.bootstrapTable("destroy").bootstrapTable({
            exportDataType: $(this).val(),
            exportOptions: {
                fileName: (filename ? filename + '_' : 'Stations_') + currentDate.toLocaleString(),
            },
            exportTypes: ["json", "xml", "csv", "txt", "sql", "excel", "pdf"],
            columns: [
                { field: "state", checkbox: !0, visible: "selected" === $(this).val() },
                { field: "number", title: "Station Number" },
                { field: "name", title: "Station Name" },
                { field: "long", title: "Longitude" },
                { field: "lat", title: "Latitude" },
                { field: "central_area", title: "Central Area" },
                { field: "governorate", title: "Governorate" },
                { field: "fusion_ip", title: "Fusion IP" },
                { field: "fusion_port", title: "Fusion Port" },
                { field: "last_connection", title: "Last Connection" },
                { field: "timestamp", title: "Timestamp" },
            ],
        });
        o.bootstrapTable("showLoading");
        o.bootstrapTable("load", temp_table);
        o.bootstrapTable("refresh");
        o.bootstrapTable("hideLoading");
    })


document.getElementById("print_selected").addEventListener("click", function () {
    var selectedRows = [];
    selectedRows = $("#stationTbl").bootstrapTable("getSelections");
    // console.log(selectedRows);
    var printWindow = window.open("", "_blank");
    var currentDate = new Date();
    printWindow.document.open();
    printWindow.document.write(
        "<html><head><title>Stations Table</title>" +
        "<style>" +
        "table { border-collapse: collapse;width: 100%; }" +
        "th, td { border: 1px solid black;text-align: center; }" +
        "</style>" +
        "</head><body>"
    );
    //        printWindow.document.write("<html><head><title>Alarms Table</title></head><body>");
    printWindow.document.write("<h2>Printed on: " + currentDate.toString() + "</h2>");
    printWindow.document.write("<table>");
    // Get the column names from the table header
    var columnNames = [];
    $("#stationTbl thead th").each(function () {
        columnNames.push($(this).data("field"));
    });

    // Print the table header with column names
    printWindow.document.write("<tr>");
    for (var j = 1; j < columnNames.length - 1; j++) {
        printWindow.document.write("<th>" + columnNames[j] + "</th>");
    }
    printWindow.document.write("</tr>");

    // Iterate over selected rows
    for (var i = 0; i < selectedRows.length; i++) {
        var row = selectedRows[i];
        printWindow.document.write("<tr>");
        for (var j = 1; j < columnNames.length - 1; j++) {
            var columnName = columnNames[j];
            printWindow.document.write("<td>" + row[columnName] + "</td>");
        }
        printWindow.document.write("</tr>");
    }
    printWindow.document.write("</table></body></html>");
    printWindow.document.close();
    printWindow.print();
})