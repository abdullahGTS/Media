function submitProduct(){
    product_num = document.getElementById('product_num');
    product_name = document.getElementById('product_name');
    product_price = document.getElementById('product_price');
    if(product_num.value == ''){
        product_num.classList.add('bg-danger', 'text-white');
    }else if(product_name.value == ''){
        product_name.classList.add('bg-danger', 'text-white');
    }else if(product_price.value == ''){
        product_price.classList.add('bg-danger', 'text-white');
    }else{
        document.getElementById('miniloader').classList.remove('d-none');
        $.ajax({
            url: "/adminpanal/product/add/api/",
            method: "GET",
            dataType: "json",
            data: {
                'product_num': product_num.value,
                'product_name': product_name.value,
                'product_price': product_price.value,
            },
            success: function (t) {
                console.log(t);
                if(t.status == 'exists'){
                    document.getElementById('error_msg').innerHTML = 'Product Already Exists!';
                    document.getElementById('error_msg').classList.add('text-danger');
                    document.getElementById('error_msg').classList.remove('d-none');
                    document.getElementById('miniloader').classList.add('d-none');
                    setTimeout(()=>{
                        document.getElementById('error_msg').innerHTML = '';
                        document.getElementById('error_msg').classList.remove('text-danger');
                        document.getElementById('error_msg').classList.add('d-none');
                    },3000);
                }


                if(t.status == 'No Get'){
                    document.getElementById('error_msg').innerHTML = 'Technical Error!';
                    document.getElementById('error_msg').classList.add('text-danger');
                    document.getElementById('error_msg').classList.remove('d-none');

                    setTimeout(()=>{
                        document.getElementById('error_msg').innerHTML = '';
                        document.getElementById('error_msg').classList.remove('text-danger');
                        document.getElementById('error_msg').classList.add('d-none');
                    },3000);
                }


                if(t.status == 'added'){
                    document.getElementById('error_msg').innerHTML = 'Product is added successfully.';
                    document.getElementById('error_msg').classList.add('text-success');
                    document.getElementById('error_msg').classList.remove('d-none');

                    product_num.classList.remove('bg-danger', 'text-white');
                    product_name.classList.remove('bg-danger', 'text-white');
                    product_price.classList.remove('bg-danger', 'text-white');
                    product_num.value = '';
                    product_name.value = '';
                    product_price.value = '';

                    var e = $("#productTbl");
                    e.bootstrapTable("showLoading");
                    e.bootstrapTable("append",{
                        'id':t.id,
                        'number':t.number,
                        'name':t.name,
                        'price':t.price,
                        'timestamp':t.timestamp,
                        'actions': `<button class="btn btn-dark w-100" onclick="deleteProduct('${t.id}')">Delete</button>`,
                    });
                    e.bootstrapTable("refresh");
                    e.bootstrapTable("hideLoading");
                    document.getElementById('miniloader').classList.add('d-none');
                    document.getElementById('products_num').innerHTML = parseInt(document.getElementById('products_num').innerHTML) + 1;

                    setTimeout(()=>{
                        document.getElementById('error_msg').innerHTML = '';
                        document.getElementById('error_msg').classList.remove('text-danger');
                        document.getElementById('error_msg').classList.add('d-none');
                    },3000);
                }
                
            },
        });
    }
}

function resetProduct(){
    document.getElementById('product_num').value = '';
    document.getElementById('product_name').value = '';
    document.getElementById('product_price').value = '';
}

function deleteProduct(pro_id){
    $.ajax({
        url: "/adminpanal/product/delete/api/",
        method: "GET",
        dataType: "json",
        data: {
            'product_id': pro_id,
        },
        success: function (t) {
            console.log(t);
            if(t.status == 'exists'){
                document.getElementById('error_msg').innerHTML = 'Can\'t Delete Product Linked To A Nozzle!';
                document.getElementById('error_msg').classList.add('text-danger');
                document.getElementById('error_msg').classList.remove('d-none');
                document.getElementById('error_msg').scrollIntoView({ behavior: 'smooth', block: 'end' });
                
                setTimeout(()=>{
                    document.getElementById('error_msg').innerHTML = '';
                    document.getElementById('error_msg').classList.remove('text-danger');
                    document.getElementById('error_msg').classList.add('d-none');
                },3000);
            }else{
                var e = $("#productTbl");
                e.bootstrapTable("showLoading");
                e.bootstrapTable('removeByUniqueId', pro_id);
                e.bootstrapTable("refresh");
                e.bootstrapTable("hideLoading");
                document.getElementById('products_num').innerHTML = parseInt(document.getElementById('products_num').innerHTML) - 1;
            }
        },
    });
}

var o = $("#productTbl");
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
                { field: "id", title: "ID" },
                { field: "number", title: "Number" },
                { field: "name", title: "Name" },
                { field: "price", title: "Price" },
                { field: "timestamp", title: "Timestamp" },
                { field: "actions", title: "Actions" },
            ],
        });
        o.bootstrapTable("showLoading");
        o.bootstrapTable("load", temp_table);
        o.bootstrapTable("refresh");
        o.bootstrapTable("hideLoading");
    })

document.getElementById("print_selected").addEventListener("click", function () {
    var selectedRows = [];
    selectedRows = $("#productTbl").bootstrapTable("getSelections");
    // console.log(selectedRows);
    var printWindow = window.open("", "_blank");
    var currentDate = new Date();
    printWindow.document.open();
    printWindow.document.write(
        "<html><head><title>Product Table</title>" +
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
    $("#productTbl thead th").each(function () {
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
