
function ProductCategoryLoad() {
    $("#ProductCategoryModal").iziModal({
        title: 'Add New Product Category',
        TransitionIn: 'FadeInRight',
        theme: 'light',
        headerColor: '#008fa2',
        padding: 10,
        top: 70,
        overlayClose: false,
        zindex: 999
    });

    new Cleave('.point1', {
        numeral: true,
        //numeralThousandsGroupStyle: 'none'
    });

    BindProductCategoryTable();
}

function BindProductCategoryTable() {
    var obj = {
        ProductCategory: $("#HProductCategoryID").val(),
    };
    CalltoApiController($("#HGetProductCategory").val(), obj, 'ProductCategoryResponse');
}

function ProductCategoryResponse(response) {
    $('#tblProductCategory').DataTable({
        responsive: true,
        data: JSON.parse(response),
        datasrc: "",
        destroy: true,
        searching: false,
        "bInfo": false,
        "bPaginate": false,
        "ordering": false,
        "columns": [
            { "data": "ProductCategoryID", width: "33%" },
            { "data": "ProductCategoryName",className:"align-left", width: "34%" },
            { "data": "OrderSeq", "className": "align-right", width: "33%" }
        ],
        "columnDefs": [{
            "targets": 0,
            "data": "ProductCategoryID",
            "render": function (data) {
                return '<button type="button" class="btn btn-grd-info gridbtn" onclick="ProductCategoryEdit(this);"><i class="icon-note"></i>Edit</button>';
            },
        }],
    });
}

function ProductCategoryEdit(row) {
    var currentRow = $(row).closest("tr");
    var data = $('#tblProductCategory').DataTable().row(currentRow).data();
    $("#HProductCategoryID").val(data["ProductCategoryID"]);
    $("#txtCategoryName").val(data["ProductCategoryName"]);
    $("#txtOrder").val(data["OrderSeq"]);

    $(".iziModal-header-title").html('Edit Product Category');

    $("#ProductCategoryModal").iziModal('open');

    $("#btnSaveText").html('Update');
    $("#HMode").val('Edit');
    $("#txtCategoryName").focus();
}

function AddNewCategory() {
    ClearProductCategory();

    $(".iziModal-header-title").html('Add New Product Category');
    $("#ProductCategoryModal").iziModal('open');
    $("#HMode").val('New');
}

function ProductCategorySave() {
    if (ProductCategoryErrorCheck()) {
        $('#divloader').show();
        var obj = {
            ProductCategoryID: $("#HProductCategoryID").val(),
            ProductCategoryName: $("#txtCategoryName").val(),
            OrderSeq: $("#txtOrder").val(),
            UpdatedBy: $("#hID").val(),
            Mode: $("#HMode").val()
        }

        CalltoApiController($("#HProductCategoryCUD").val(), obj, 'ProductCategorySaveResponse');
    }
}

function ProductCategoryErrorCheck() {
    if (!$("#txtCategoryName").val()) {
        ShowMessage("E001", 'Category Name');
        $("#txtCategoryName").focus();
    } else if (!$("#txtOrder").val()) {
        ShowMessage("E001", 'Order Sequence');
        $("#txtCategoryName").focus();
    }

    return true;
}

function ProductCategorySaveResponse(response) {
    BindProductCategoryTable();
    $('#divloader').hide();
    data = JSON.parse(response);
    MessageResponse(response, data[0].MessageID)
    $("#ProductCategoryModal").iziModal('close');
    ClearProductCategory();
}

function ClearProductCategory() {
    $("#HProductCategoryID").val('');
    $("#txtCategoryName").val('');
    $("#txtOrder").val('');
}

function ProductCategoryClose() {
    $("#ProductCategoryModal").iziModal('close');
}