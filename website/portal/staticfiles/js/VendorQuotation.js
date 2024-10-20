$(function () {
    filters = {
        'quotation': '',
        'RFQ_ID': '',
        'status': '',
        'currency': '',
        'user': '',
        'timestamp_from': '',
        'timestamp_to': '',
    }
    document.getElementById("quotation").addEventListener("change", function () {
        // console.log(this.value);
        filters.quotation = this.value;
        document.getElementById('sbmtBTN').removeAttribute('disabled');
    });
    document.getElementById("RFQ_ID").addEventListener("change", function () {
        // console.log(this.value);
        filters.RFQ_ID = this.value;
        document.getElementById('sbmtBTN').removeAttribute('disabled');
    });
    document.getElementById("status").addEventListener("change", function () {
        // console.log(this.value);
        filters.status = this.value;
        document.getElementById('sbmtBTN').removeAttribute('disabled');
    });
    document.getElementById("currency").addEventListener("change", function () {
        // console.log(this.value);
        filters.currency = this.value;
        document.getElementById('sbmtBTN').removeAttribute('disabled');
    });
    document.getElementById("user").addEventListener("change", function () {
        // console.log(this.value);
        filters.user = this.value;
        document.getElementById('sbmtBTN').removeAttribute('disabled');
    });
    document.getElementById("timestamp_from").addEventListener("change", function () {
        // console.log(this.value);
        filters.timestamp_from = this.value;
        document.getElementById('sbmtBTN').removeAttribute('disabled');
    });
    document.getElementById("timestamp_to").addEventListener("change", function () {
        // console.log(this.value);
        filters.timestamp_to = this.value;
        document.getElementById('sbmtBTN').removeAttribute('disabled');
    });
    document.getElementById("sbmtBTN").addEventListener("click", function () {
        document.getElementById('miniloader').classList.remove('d-none');
        document.getElementById('collapse_pending_filters').classList.remove('show');
        $.ajax({
            url: "/system/Quotation/table/api/",
            method: "GET",
            dataType: "json",
            data: {
                'quotation': filters.quotation,
                'RFQ_ID': filters.RFQ_ID,
                'status': filters.status,
                'currency': filters.currency,
                'user': filters.user,
                'timestamp_from': filters.timestamp_from,
                'timestamp_to': filters.timestamp_to,
            },
            success: function (t) {
                // console.log(t);
                t.forEach((element) => {
                    // console.log(element);
                    element['actions'] = `<button class="btn btn-secondary text-white" style="margin:5px auto;width:100%;" type="button" onclick="ViewRFQModal('${element.RFQ_ID}')"><i class="fa-solid fa-eye me-2"></i> RFQ Details</button>
                    <button class="btn btn-success" style="margin:5px auto;width:100%;" type="button" onclick="ViewQuoteModal('${element.id}')"><i class="fa-solid fa-eye me-2"></i> Quote Details</button>`;
                    element['id'] = `<a href="#" onclick="ViewQuoteModal('${element.id}')">${element.id}</a>`;
                });
                updateTableData(t);
            },
        });
    });
    document.getElementById("quotationBTN").addEventListener("click", function () {
        filters.quotation = '';
        $('#quotation').selectpicker('val', "");
    });
    document.getElementById("RFQIDBTN").addEventListener("click", function () {
        filters.RFQ_ID = '';
        $('#RFQ_ID').selectpicker('val', "");
    });
    document.getElementById("statusBTN").addEventListener("click", function () {
        filters.status = '';
        $('#status').selectpicker('val', "");
    });
    document.getElementById("currencyBTN").addEventListener("click", function () {
        filters.currency = '';
        $('#currency').selectpicker('val', "");
    });
    document.getElementById("userBTN").addEventListener("click", function () {
        filters.user = '';
        $('#user').selectpicker('val', "");
    });
    document.getElementById("timestampBTN").addEventListener("click", function () {
        filters.timestamp_from = '';
        filters.timestamp_to = '';
        document.getElementById("timestamp_from").value = "";
        document.getElementById("timestamp_to").value = "";
    });
    document.getElementById("rstBTN").addEventListener("click", function () {
        filters = {
            'quotation': '',
            'RFQ_ID': '',
            'status': '',
            'currency': '',
            'user': '',
            'timestamp_from': '',
            'timestamp_to': '',
        }
        document.getElementById('sbmtBTN').setAttribute('disabled', 'disabled');
        $('.selectpicker').selectpicker('val', "");
        document.getElementById("timestamp_from").value = "";
        document.getElementById("timestamp_to").value = "";

        var e = $("#QuotationTbl");
        e.bootstrapTable("showLoading");
        e.bootstrapTable("load", []);
        e.bootstrapTable("refresh");
        e.bootstrapTable("hideLoading");
        document.getElementById('card-table').classList.add('d-none');
        document.getElementById('collapse_pending_filters').classList.add('show');
    });
});

function updateTableData(filteredData) {
    var e = $("#QuotationTbl");
    e.bootstrapTable("showLoading");
    e.bootstrapTable("load", []);
    e.bootstrapTable("load", filteredData);
    e.bootstrapTable("refresh");
    e.bootstrapTable("hideLoading");
    document.getElementById('miniloader').classList.add('d-none');
    document.getElementById('card-table').classList.remove('d-none');
    // console.log(e.bootstrapTable('getRowByUniqueId', 3645));
}


function ViewRFQModal(rowid) {
    var e = $("#QuotationTbl");
    e.bootstrapTable("showLoading");
    // rowData = e.bootstrapTable('getRowByUniqueId', rowid);
    $.ajax({
        url: "/system/VendorRFQDone/details/api/",
        method: "GET",
        dataType: "json",
        data: {
            'RFQ_ID': rowid,
        },
        success: function (t) {
            // console.log(t);
            document.getElementById('RFQ_Sys_ID').innerHTML=t.id;
            document.getElementById('view_vendor').innerHTML=t.vendor;
            document.getElementById('view_RFQ_ID').innerHTML=t.RFQ_ID;
            document.getElementById('view_project_name').innerHTML=t.project_name;
            document.getElementById('view_ship_to_address').innerHTML=t.ship_to_address;
            document.getElementById('view_bidder_id').innerHTML=t.bidder_id;
            document.getElementById('view_submission_deadline').innerHTML=t.submission_deadline;
            document.getElementById('view_qmbvu').innerHTML=t.qmbvu;
            document.getElementById('view_RFQ_Type').innerHTML=t.RFQ_Type;
            document.getElementById('view_eqc').innerHTML=t.eqc;
            document.getElementById('view_qrfai').innerHTML=t.qrfai;
            document.getElementById('view_bccsq').innerHTML=t.bccsq;
            document.getElementById('view_bcai').innerHTML=t.bcai;
            document.getElementById('view_bccq').innerHTML=t.bccq;
            document.getElementById('total_products').innerHTML=t.products_count;
            var rpt = $("#RFQProductsTbl");
            rpt.bootstrapTable("showLoading");
            rpt.bootstrapTable("load", []);
            rpt.bootstrapTable("load", t.products);
            rpt.bootstrapTable("refresh");
            rpt.bootstrapTable("hideLoading");
            document.getElementById('total_files').innerHTML=t.attachments_count;
            var files_list = ``;
            t.attachments.forEach((element)=>{
                files_list +=`
                <div class="row mb-2" style="border-left: 1px solid #6c757d;">
                    <div class="col-1 d-flex justify-content-start align-items-center">
                        <h5 class="mb-0">${element[3]}</h5>
                    </div>
                    <div class="col-7 d-flex justify-content-start align-items-center">
                        <h5 class="mb-0">${element[0]}</h5>
                    </div>
                    <div class="col-2 text-center">
                        <a href="${element[1]}" target="_blank" class="btn btn-secondary text-white" style="text-decoration: none;scale: 0.8;">
                            <i class="fa-solid fa-eye"></i> View
                        </a>
                    </div>
                    <div class="col-2 text-center">
                        <a href="${element[1]}" download="${element[0]}" class="btn btn-success text-white" style="text-decoration: none;scale: 0.8;">
                            <i class="fa-solid fa-download"></i> Download
                        </a>
                    </div>
                </div>
                `;
            })
            document.getElementById('files_parent').innerHTML = files_list;
            $('#view_action_modal').modal({
                backdrop: true,
                keyboard: true,
                focus: true,
                show: true,
            });
            e.bootstrapTable("hideLoading");
        },
    });
}



function ViewQuoteModal(rowid) {
    var e = $("#QuotationTbl");
    e.bootstrapTable("showLoading");
    $.ajax({
        url: "/system/Quotation/details/api/",
        method: "GET",
        dataType: "json",
        data: {
            'Quote_ID': rowid,
        },
        success: function (t) {
            // console.log(t);
            document.getElementById('cq_RFQ_ID').innerHTML=t.RFQ_ID;
            document.getElementById('cq_RFQ_Type').innerHTML=t.RFQ_Type;
            document.getElementById('cq_submission_deadline').innerHTML=t.submission_deadline;
            document.getElementById('cq_qmbvu').innerHTML=t.qmbvu;
            document.getElementById('cq_eqc').innerHTML=t.eqc;
            document.getElementById('total_net_value').innerHTML=t.net_value;
            document.getElementById('cq_currency').innerHTML=t.currency;


            document.getElementById('q_total_files').innerHTML=t.attachments_count;
            var files_list = ``;
            t.attachments.forEach((element)=>{
                files_list +=`
                <div class="row mb-2" style="border-left: 1px solid #6c757d;">
                    <div class="col-1 d-flex justify-content-start align-items-center">
                        <h5 class="mb-0">${element[3]}</h5>
                    </div>
                    <div class="col-7 d-flex justify-content-start align-items-center">
                        <h5 class="mb-0">${element[0]}</h5>
                    </div>
                    <div class="col-2 text-center">
                        <a href="${element[1]}" target="_blank" class="btn btn-secondary text-white" style="text-decoration: none;scale: 0.8;">
                            <i class="fa-solid fa-eye"></i> View
                        </a>
                    </div>
                    <div class="col-2 text-center">
                        <a href="${element[1]}" download="${element[0]}" class="btn btn-success text-white" style="text-decoration: none;scale: 0.8;">
                            <i class="fa-solid fa-download"></i> Download
                        </a>
                    </div>
                </div>
                `;
            })
            document.getElementById('q_files_parent').innerHTML = files_list;
            $('#create_quote_action_modal').modal({
                backdrop: true,
                keyboard: true,
                focus: true,
                show: true,
            });
            e.bootstrapTable("hideLoading");
        },
    });
}



var o = $("#QuotationTbl");
$("#toolbar")
    .find("select")
    .change(function () {
        var filename = document.getElementById('exportFileName').value;
        var currentDate = new Date();
        var temp_table = o.bootstrapTable().bootstrapTable('getData');
        o.bootstrapTable("destroy").bootstrapTable({
            exportDataType: $(this).val(),
            exportOptions: {
                fileName: (filename ? filename + '_' : 'GTS_') + currentDate.toLocaleString(),
            },
            exportTypes: ["json", "xml", "csv", "txt", "sql", "excel", "pdf"],
            columns: [
                { field: "state", checkbox: !0, visible: "selected" === $(this).val() },
                { field: "id", title: "RFQ ID" },
                { field: "RFQ_ID", title: "RFQ ID" },
                { field: "net_value", title: "Total Net Value" },
                { field: "currency", title: "Currency" },
                { field: "user", title: "Submitted user" },
                { field: "status", title: "Status" },
                { field: "timestamp", title: "Timestamp" },
                { field: "actions", title: "Actions" },
                // { field: "area_manager_status", title: "Status" },
            ],
        });
        o.bootstrapTable("showLoading");
        o.bootstrapTable("load", temp_table);
        o.bootstrapTable("refresh");
        o.bootstrapTable("hideLoading");
    })

document.getElementById("print_selected").addEventListener("click", function () {
    var selectedRows = [];
    selectedRows = $("#QuotationTbl").bootstrapTable("getSelections");
    // console.log(selectedRows);
    var printWindow = window.open("", "_blank");
    var currentDate = new Date();
    printWindow.document.open();
    printWindow.document.write(
        "<html><head><title>Quotation Table</title>" +
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
    $("#QuotationTbl thead th").each(function () {
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


var x = $("#RFQProductsTbl");
$("#items_toolbar")
    .find("select")
    .change(function () {
        var filename = document.getElementById('items_exportFileName').value;
        var currentDate = new Date();
        var temp_table = x.bootstrapTable().bootstrapTable('getData');
        x.bootstrapTable("destroy").bootstrapTable({
            exportDataType: $(this).val(),
            exportOptions: {
                fileName: (filename ? filename + '_' : 'GTS_') + currentDate.toLocaleString(),
            },
            exportTypes: ["json", "xml", "csv", "txt", "sql", "excel", "pdf"],
            columns: [
                { field: "state", checkbox: !0, visible: "selected" === $(this).val() },
                { field: "number", title: "Number" },
                { field: "description", title: "Description" },
                { field: "quantity", title: "Quantity" },
                { field: "uom", title: "UOM" },
                { field: "unit_price", title: "Unit Price" },
                { field: "amount", title: "Amount" },
                // { field: "area_manager_status", title: "Status" },
            ],
        });
        x.bootstrapTable("showLoading");
        x.bootstrapTable("load", temp_table);
        x.bootstrapTable("refresh");
        x.bootstrapTable("hideLoading");
    })

document.getElementById("items_print_selected").addEventListener("click", function () {
    var selectedRows = [];
    selectedRows = $("#RFQProductsTbl").bootstrapTable("getSelections");
    // console.log(selectedRows);
    var printWindow = window.open("", "_blank");
    var currentDate = new Date();
    printWindow.document.open();
    printWindow.document.write(
        "<html><head><title>RFQ Products Table</title>" +
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
    $("#RFQProductsTbl thead th").each(function () {
        columnNames.push($(this).data("field"));
    });

    // Print the table header with column names
    printWindow.document.write("<tr>");
    for (var j = 1; j < columnNames.length; j++) {
        printWindow.document.write("<th>" + columnNames[j] + "</th>");
    }
    printWindow.document.write("</tr>");

    // Iterate over selected rows
    for (var i = 0; i < selectedRows.length; i++) {
        var row = selectedRows[i];
        printWindow.document.write("<tr>");
        for (var j = 1; j < columnNames.length; j++) {
            var columnName = columnNames[j];
            printWindow.document.write("<td>" + row[columnName] + "</td>");
        }
        printWindow.document.write("</tr>");
    }
    printWindow.document.write("</table></body></html>");
    printWindow.document.close();
    printWindow.print();
})


// function printInvoice() {
//     var view_invoice_id = document.getElementById('view_invoice_id').innerHTML;
//     var view_vendor = document.getElementById('view_vendor').innerHTML;
//     var view_number = document.getElementById('view_number').innerHTML;
//     var view_date = document.getElementById('view_date').innerHTML;
//     var view_bill_to = document.getElementById('view_bill_to').innerHTML;
//     var view_po = document.getElementById('view_po').innerHTML;
//     var view_due = document.getElementById('view_due').innerHTML;
//     var view_project_name = document.getElementById('view_project_name').innerHTML;
//     var view_type = document.getElementById('view_type').innerHTML;
//     var view_milestone = document.getElementById('view_milestone').innerHTML;
//     var total_items = document.getElementById('total_items').innerHTML;
//     var total_amount = document.getElementById('total_amount').innerHTML;

//     var iit = $("#RFQProductsTbl");
//     var temp_table = iit.bootstrapTable().bootstrapTable('getData');
//     items_table_data = ``;
//     temp_table.forEach((row)=>{
//         items_table_data += `
//         <tr>
//             <td>${row.number}</td>
//             <td>${row.description}</td>
//             <td>${row.quantity}</td>
//             <td>${row.uom}</td>
//             <td>${row.unit_price}</td>
//             <td>${row.amount}</td>
//         </tr>
//         `;
//     });
//     var ta_view_invoice_currency = document.getElementById('ta_view_invoice_currency').innerHTML;
//     var vat_view_invoice_currency = document.getElementById('vat_view_invoice_currency').innerHTML;
//     var t_view_invoice_currency = document.getElementById('t_view_invoice_currency').innerHTML;
//     var view_total_amount = document.getElementById('view_total_amount').innerHTML;
//     var view_invoice_vat = document.getElementById('view_invoice_vat').innerHTML;
//     var view_vat_amount = document.getElementById('view_vat_amount').innerHTML;
//     var view_invoice_total = document.getElementById('view_invoice_total').innerHTML;
//     var total_files = document.getElementById('total_files').innerHTML;
//     var files_list = document.getElementById('files_parent').children;
//     var files_data = ``;
//     for(var i=0;i<files_list.length;i++){
//         files_data += `
//         <div class="row mb-2" style="border-left: 1px solid #6c757d;">
//             <div class="col-2 d-flex justify-content-start align-items-center">
//                 <h5 class="mb-0">${files_list[i].children[0].children[0].innerHTML}</h5>
//             </div>
//             <div class="col-10 d-flex justify-content-center align-items-center">
//                 <h5 class="mb-0">${files_list[i].children[1].children[0].innerHTML}</h5>
//             </div>
//         </div>
//         `;
//     }
//     var view_submitted_by = document.getElementById('view_submitted_by').innerHTML;
//     var view_submitted_timestamp = document.getElementById('view_submitted_timestamp').innerHTML;

//     var status = document.getElementById('print_status').value;
//     var action_data = ``;
//     if (status == 'p') {
//         action_data += `
//         <hr class="d-none" id="action_border" />
//         <div class="row mb-4 d-none" id="action_by">
//             <div class="col-5">
//                 <h5 class="mb-0" id="action_type_by"></h5>
//             </div>
//             <div class="col-7">
//                 <h5 class="mb-0" id="view_action_by"></h5>
//             </div>
//         </div>
//         <div class="row mb-4 d-none" id="action_at">
//             <div class="col-5">
//                 <h5 class="mb-0" id="action_type_at"></h5>
//             </div>
//             <div class="col-7">
//                 <h5 class="mb-0" id="view_action_timestamp"></h5>
//             </div>
//         </div>
//         <div class="row mb-4 d-none" id="action_feedback">
//             <div class="col-5">
//                 <h5 class="mb-0">Feedback</h5>
//             </div>
//             <div class="col-7">
//                 <h5 class="mb-0" id="view_action_feedback"></h5>
//             </div>
//         </div>
//         `;
//     }
//     if (status == 'a') {
//         var action_type_by = document.getElementById('action_type_by').innerHTML;
//         var view_action_by = document.getElementById('view_action_by').innerHTML;
//         var action_type_at = document.getElementById('action_type_at').innerHTML;
//         var view_action_timestamp = document.getElementById('view_action_timestamp').innerHTML;
//         var view_action_feedback = document.getElementById('view_action_feedback').innerHTML;
//         action_data += `
//         <hr />
//         <div class="row mb-4">
//             <div class="col-5">
//                 <h5 class="mb-0">${action_type_by}</h5>
//             </div>
//             <div class="col-7">
//                 <h5 class="mb-0">${view_action_by}</h5>
//             </div>
//         </div>
//         <div class="row mb-4">
//             <div class="col-5">
//                 <h5 class="mb-0">${action_type_at}</h5>
//             </div>
//             <div class="col-7">
//                 <h5 class="mb-0">${view_action_timestamp}</h5>
//             </div>
//         </div>
//         <div class="row mb-4">
//             <div class="col-5">
//                 <h5 class="mb-0">Feedback</h5>
//             </div>
//             <div class="col-7">
//                 <h5 class="mb-0">${view_action_feedback}</h5>
//             </div>
//         </div>
//         `;
//     }
//     if (status == 'r') {
//         var action_type_by = document.getElementById('action_type_by').innerHTML;
//         var view_action_by = document.getElementById('view_action_by').innerHTML;
//         var action_type_at = document.getElementById('action_type_at').innerHTML;
//         var view_action_timestamp = document.getElementById('view_action_timestamp').innerHTML;
//         var view_action_feedback = document.getElementById('view_action_feedback').innerHTML;
//         action_data += `
//         <hr />
//         <div class="row mb-4">
//             <div class="col-5">
//                 <h5 class="mb-0">${action_type_by}</h5>
//             </div>
//             <div class="col-7">
//                 <h5 class="mb-0">${view_action_by}</h5>
//             </div>
//         </div>
//         <div class="row mb-4">
//             <div class="col-5">
//                 <h5 class="mb-0">${action_type_at}</h5>
//             </div>
//             <div class="col-7">
//                 <h5 class="mb-0">${view_action_timestamp}</h5>
//             </div>
//         </div>
//         <div class="row mb-4">
//             <div class="col-5">
//                 <h5 class="mb-0">Feedback</h5>
//             </div>
//             <div class="col-7">
//                 <h5 class="mb-0">${view_action_feedback}</h5>
//             </div>
//         </div>
//         `;
//     }

//     var printWindow = window.open("", "_blank");
//     printWindow.document.write(`
//     <!DOCTYPE html>
//     <html lang="en">
//     <head>
//         <meta charset="utf-8" />
//         <meta http-equiv="X-UA-Compatible" content="IE=edge" />
//         <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
//         <meta name="description" content="gts" />
//         <meta name="author" content="Abdullah kamal" />
//         <title>Dashboard | Invoices</title>
//         <link rel="icon" type="image/ico" href="/static/img/favicon.ico" />
//         <link href="/static/css/bootstrap/bootstrap.min.css" rel="stylesheet" />
//         <link href="/static/css/bootstrap/bootstrap-select.min.css" rel="stylesheet" />
//         <link href="/static/css/bootstrap-table/bootstrap-table.min.css" rel="stylesheet" />
//         <link href="/static/css/styles.css" rel="stylesheet" />
//         <link href="/static/css/loader.css" rel="stylesheet" />
//         <link href="/static/css/responsive.css" rel="stylesheet" />
//         <link href="/static/fontawesomefree/css/all.min.css" rel="stylesheet" type="text/css">
//     </head>
//     <body class="sb-nav-fixed">
//         <div class="container">
//             <div class="row mt-2 mb-4">
//                 <div class="col-6">
//                     <img src="/static/img/gts-logo.png" width="200" alt="Footer Logo">
//                 </div>
//             </div>
//             <div class="card">
//                 <div class="card-header">
//                     <div class="row">
//                         <div class="col-4 text-center">
//                             <h5 class="modal-title" style="border-radius: 5px;">ID
//                                 <span>${view_invoice_id}</span>
//                             </h5>
//                         </div>
//                         <div class="col-8 text-center">
//                             <h5 class="modal-title">Invoice Details</h5>
//                         </div>
//                     </div>
//                 </div>
//                 <div class="card-body">
//                     <div class="row mb-4">
//                         <div class="col-5">
//                             <div class="row">
//                                 <div class="col-5">
//                                     <h5>Vendor</h5>
//                                 </div>
//                             </div>
//                             <div class="row">
//                                 <div class="col-12 text-center">
//                                     <h1>${view_vendor}</h1>
//                                 </div>
//                             </div>
//                         </div>
//                         <div class="col-7">
//                             <div class="row">
//                                 <div class="col-6">
//                                     <h5 style="border-right: 2px solid #212529;">Invoice Number</h5>
//                                 </div>
//                                 <div class="col-6">
//                                     <h5>${view_number}</h5>
//                                 </div>
//                             </div>
//                             <div class="row mt-2">
//                                 <div class="col-6">
//                                     <h5 style="border-right: 2px solid #212529;">Invoice Date</h5>
//                                 </div>
//                                 <div class="col-6">
//                                     <h5>${view_date}</h5>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                     <div class="row mb-4">
//                         <div class="col-5">
//                             <div class="row">
//                                 <div class="col-5">
//                                     <h5>Bill To</h5>
//                                 </div>
//                             </div>
//                             <div class="row">
//                                 <div class="col-12 text-center">
//                                     <h5>${view_bill_to}</h5>
//                                 </div>
//                             </div>
//                         </div>
//                         <div class="col-7">
//                             <div class="row">
//                                 <div class="col-6">
//                                     <h5 style="border-right: 2px solid #212529;">P.O. No.</h5>
//                                 </div>
//                                 <div class="col-6">
//                                     <h5>${view_po}</h5>
//                                 </div>
//                             </div>
//                             <div class="row mt-2">
//                                 <div class="col-6">
//                                     <h5 style="border-right: 2px solid #212529;">Payment Due</h5>
//                                 </div>
//                                 <div class="col-6">
//                                     <h5><span>${view_due}</span> Days</h5>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                     <div class="row mb-4">
//                         <div class="col-5">
//                             <div class="row">
//                                 <div class="col-5">
//                                     <h5>Project</h5>
//                                 </div>
//                             </div>
//                             <div class="row">
//                                 <div class="col-12 text-center">
//                                     <h5>${view_project_name}</h5>
//                                 </div>
//                             </div>
//                         </div>
//                         <div class="col-7">
//                             <div class="row">
//                                 <div class="col-6">
//                                     <h5 style="border-right: 2px solid #212529;">Invoice Type</h5>
//                                 </div>
//                                 <div class="col-6">
//                                     <h5>${view_type}</h5>
//                                 </div>
//                             </div>
//                             <div class="row mt-2">
//                                 <div class="col-6">
//                                     <h5 style="border-right: 2px solid #212529;">Milestone</h5>
//                                 </div>
//                                 <div class="col-6">
//                                     <h5><span>${view_milestone}</span> %</h5>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                     <div class="row mb-4">
//                         <div class="col-12">
//                             <div class="panel panel-default">
//                                 <div class="panel-heading text-left"
//                                     style="padding: 10px 15px;border-radius: 5px;"
//                                     role="tab" id="items_table">
//                                     <h4 class="panel-title m-0">
//                                         <div class="row">
//                                             <div class="col-7">
//                                                 <a role="button" data-toggle="collapse"
//                                                     style="text-decoration: none;color: #000;"
//                                                     href="#collapse_items_table" aria-expanded="false"
//                                                     aria-controls="collapse_items_table">
//                                                     <i class="fa-solid fa-table me-1"></i>
//                                                     Invoice Items Table
//                                                 </a>
//                                             </div>
//                                             <div class="col-5 text-right">
//                                                 <div class="row">
//                                                     <div
//                                                         class="col-4 d-flex justify-content-center align-items-center">
//                                                         <h5 class="mb-0 mr-2 pr-2"
//                                                             style="border-right: 2px solid #000;">Items</h5>
//                                                         <h5 class="mb-0">${total_items}</h5>
//                                                     </div>
//                                                     <div
//                                                         class="col-8 d-flex justify-content-center align-items-center">
//                                                         <h5 class="mb-0 mr-2 pr-2"
//                                                             style="border-right: 2px solid #000;">Total</h5>
//                                                         <h5 class="mb-0">${total_amount}</h5>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </h4>
//                                 </div>
//                                 <div id="collapse_items_table" class="panel-collapse collapse in show"
//                                     role="tabpanel" aria-labelledby="items_table">
//                                     <div class="panel-body">
//                                         <div class="card">
//                                             <div class="card-body table-striped table-sm">
//                                                 <table class="table">
//                                                     <thead>
//                                                         <tr>
//                                                             <th>Number</th>
//                                                             <th>Description</th>
//                                                             <th>Quantity</th>
//                                                             <th>UOM</th>
//                                                             <th>Unit Price</th>
//                                                             <th>Amount</th>
//                                                         </tr>
//                                                     </thead>
//                                                     <tbody>
//                                                     ${items_table_data}
//                                                     </tbody>
//                                                 </table>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                     <div class="row mb-4 d-flex justify-content-end align-items-center">
//                         <div class="col-7">
//                             <div class="card-body"
//                                 style="padding: 20px;border-radius: 5px;">
//                                 <div class="row">
//                                     <div class="col-5">
//                                         <h5>Total Amount</h5>
//                                     </div>
//                                     <div class="col-3 text-center">
//                                         <h5>( <span>${ta_view_invoice_currency}</span> )</h5>
//                                     </div>
//                                     <div class="col-4 text-right">
//                                         <h5>${view_total_amount}</h5>
//                                     </div>
//                                 </div>
//                                 <div class="row">
//                                     <div class="col-5">
//                                         <h5>VAT ( <span>${view_invoice_vat}</span> % )</h5>
//                                     </div>
//                                     <div class="col-3 text-center">
//                                         <h5>( <span>${vat_view_invoice_currency}</span> )</h5>
//                                     </div>
//                                     <div class="col-4 text-right">
//                                         <h5>${view_vat_amount}</h5>
//                                     </div>
//                                 </div>
//                                 <hr />
//                                 <div class="row">
//                                     <div class="col-5">
//                                         <h5>Total</h5>
//                                     </div>
//                                     <div class="col-3 text-center">
//                                         <h5>( <span>${t_view_invoice_currency}</span> )</h5>
//                                     </div>
//                                     <div class="col-4 text-right">
//                                         <h5>${view_invoice_total}</h5>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                     <div class="row mb-4">
//                         <div class="col-12">
//                             <div class="panel panel-default">
//                                 <div class="panel-heading text-left"
//                                     style="padding: 10px 15px;border-radius: 5px;"
//                                     role="tab" id="invoice_files">
//                                     <h4 class="panel-title m-0">
//                                         <div class="row">
//                                             <div class="col-9">
//                                                 <a role="button" data-toggle="collapse"
//                                                     style="text-decoration: none;color: #000;"
//                                                     href="#collapse_invoice_files" aria-expanded="false"
//                                                     aria-controls="collapse_invoice_files">
//                                                     <i class="fa-solid fa-file-pdf me-1"></i>
//                                                     Invoice Attachments
//                                                 </a>
//                                             </div>
//                                             <div class="col-3 text-right">
//                                                 <div class="row">
//                                                     <div
//                                                         class="col-12 d-flex justify-content-center align-items-center">
//                                                         <h5 class="mb-0 mr-2 pr-2"
//                                                             style="border-right: 2px solid #000;">Files</h5>
//                                                         <h5 class="mb-0">${total_files}</h5>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </h4>
//                                 </div>
//                                 <div id="collapse_invoice_files" class="panel-collapse collapse in show"
//                                     role="tabpanel" aria-labelledby="invoice_files">
//                                     <div class="panel-body">
//                                         <div class="card">
//                                             <div class="card-body">
//                                             ${files_data}
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                     <div class="row mb-4">
//                         <div class="col-5">
//                             <h5 class="mb-0">Submitted By</h5>
//                         </div>
//                         <div class="col-7">
//                             <h5 class="mb-0">${view_submitted_by}</h5>
//                         </div>
//                     </div>
//                     <div class="row mb-4">
//                         <div class="col-5">
//                             <h5 class="mb-0">Submitted At</h5>
//                         </div>
//                         <div class="col-7">
//                             <h5 class="mb-0">${view_submitted_timestamp}</h5>
//                         </div>
//                     </div>
//                     ${action_data}
//                 </div>
//             </div>
//         </div>
//         <script type="text/javascript" src="/static/js/jquery.min.js"></script>
//         <script type="text/javascript" src="/static/js/bootstrap/bootstrap.bundle.min.js"></script>
//         <script type="text/javascript" src="/static/js/VendorInvoicesDone.js"></script>
//     </body>
//     </html>
//     `);
//     setTimeout(function(){
//         printWindow.document.close();
//         printWindow.print();
//     }, 100);
// }