function ProductListingLoad() {
    $("#ProductModal").iziModal({
        title: 'Add News',
        TransitionIn: 'FadeInRight',
        theme: 'light',
        headerColor: '#008fa2',
        padding: 10,
        top: 70,
        overlayClose: false,
        width:'70%',
        zindex: 1050
    });

    $("#ProductImportModal").iziModal({
        title: 'Product Import',
        TransitionIn: 'FadeInRight',
        theme: 'light',
        headerColor: '#008fa2',
        padding: 10,
        top: 70,
        overlayClose: false,
        width: '70%',
        zindex: 1050
    });

    $('#productphoto').on('click', function () {
        $('#productupload').click();
    });

    BindCountryCheckBox();
    BindProduct();

    $("#chkAll").change(function () {
        $("[name='chkCountry']").prop('checked', this.checked);
    });

    $('#btnUpload').on('click', function () {
        $('#productlistupload').click();
    });

    $("#productlistupload").change(function () {
        ImportCheck();
    });

    $(".iziModal-button-close").click(function () {
        $("#productlistupload").val('');
    });
}

function BindProduct() {
    $('#tblProduct tbody').empty();

    var v1 = '';
    if ($("#hVIPUserRole").val() == '2') {
        v1 = $("#hCountryList").val()
    }

    var obj = {
        //CountryID: $("#SCountry").children("option:selected").val(),
        ProductName: $("#SProductName").val(),
        ActiveStatus: $("#SStatus").children("option:selected").val(),
        CountryList: v1,
    };
    CalltoApiController($("#HGetProduct").val(), obj, 'ProductResponse');
}

function ProductResponse(response) {
    $('#tblProduct').DataTable({
        data: JSON.parse(response),
        datasrc: "",
        destroy: true,
        searching: false,
        "bInfo": false,
        "bPaginate": false,
        "ordering": false,
        "columns": [
            { "data": "ProductID", width: "5%", className: "align-center" },
            { "data": "Status", width: "10%", className: "align-center" },
            { "data": "ProductName", width: "30%" },
            { "data": "Countrylist", width: "25%" },
            { "data": "ProductPhoto", width: "10%", className: "align-center" },
            { "data": "CreatedDate", width: "10%", className: "align-center", },
            { "data": "CreatedBy", width: "10%" },
        ],
        "columnDefs": [
            {
                "targets": 0,
                "data": "ProductID",
                "render": function (data) {
                    return '<button type="button" class="btn btn-grd-info gridbtn" onclick="ProductEdit(this);"><i class="icon-note"></i>Edit</button>';
                },
            },
            {
                "targets": 2,
                "data": "ProductName",
                "render": function (data,type, row) {
                    return '<a href="'+ row.NewsUrl +'" target="_blank" style="color:#01a9ac" onclick="NewsNameClick(this)">'+ data +'</a>';
                },
            },
            {
                "targets": 4,
                "data": "ProductPhoto",
                "render": function (data) {
                    if (!data) {
                        var imgpath = $("#HImageLocation").val() + "nophoto.jpg";
                    } else {
                        var imgpath = $("#HImageLocation").val() + data;
                    }
                    return '<image src="' + imgpath + '" style="width:50px;height:50px" />';
                },
            },
        ],
    });
}

function BindCountryCheckBox() {
    CalltoApiController($("#HGetCountry").val(), {}, 'CountryCheckBoxResponse');
}

function CountryCheckBoxResponse(response) {
    var data = JSON.parse(response);

    data.forEach(function (j) {
        var chkdiv = '<div class="checkbox-fade fade-in-primary col-sm-3" style="padding:0;margin-right:0">' +
            '<label>' +
            '<input id="chk'+ j.CountryCode +'" type="checkbox" data-name="'+ j.CountryName +'" name="chkCountry" value="'+ j.CountryID +'" class="input-danger">' +
            '<span class="cr">' +
            '<i class="cr-icon icofont icofont-ui-check txt-primary"></i>' +
            '</span>' +
            '<span>' + j.CountryName +'</span>' +
            '</label>' +
            '</div>';

        $("#divCheckBoxList").append(chkdiv);
    });
}

function AddProduct() {
    $("#HMode").val('New');
    $("#btnSaveText").html("Save");
    ClearProduct();
    $("#ProductModal").iziModal('open');
}

function ProductEdit(row) {
    $("#HMode").val('Edit');

    var currentRow = $(row).closest("tr");
    var data = $('#tblProduct').DataTable().row(currentRow).data();

    $("#HProductID").val(data["ProductID"]);
    $('input[name="rdoStatus"][value="' + data["ActiveStatus"] + '"]').prop('checked', true);
    $("#txtProductName").val(data["ProductName"]);
    $("#txtNewsUrl").val(data["NewsUrl"]);

    if (!data["ProductPhoto"]) {
        $("#productphoto").attr("src", $("#HImageLocation").val() + "nophoto.jpg");
    } else {
        $("#productphoto").attr("src", $("#HImageLocation").val() + data["ProductPhoto"]);
    }

    $("#Hproductphoto").val(data["ProductPhoto"]);

    $("input[type=checkbox][name='chkCountry']").each(function () {
        
        if (data["Countrylist"].search($(this).data("name")) > -1) {
            $(this).prop("checked", true);
        } else {
            $(this).prop("checked", false);
        }     
    });

    $("#btnSaveText").html("Update");
    $("#ProductModal").iziModal('open');
}

function ClearProduct() {
    $("#productphoto").attr("src", $("#imgnophoto").val());
    $("#productupload").val('');
    $("#rdoInactive").prop('checked', true);
    $("#chkAll").prop('checked', false);
    $("#txtProductName").val('');
    $("#txtNewsUrl").val('');
    $("[name='chkCountry']").prop('checked', false);
    $("#HRemovePhoto").val('');
}

function ProductSave() {
    if (ProductErrorCheck()) {
        $('#divloader').show();

        var obj = {
            ProductID: $("#HProductID").val(),
            ProductName: $("#txtProductName").val(),
            NewsUrl: $("#txtNewsUrl").val(),
            ActiveStatus: $('input[name="rdoStatus"]:checked').val(),
            ProductPhoto: $("#Hproductphoto").val(),
            CountryJson: getCountryList(),
            RemovePhoto: $("#HRemovePhoto").val(),
            UpdatedBy: $("#hID").val(),
            Mode: $("#HMode").val(),
        };

        var formdata = new FormData();
        var product = $('#productupload')[0];

        formdata.append('product', product.files[0]);
        formdata.append('ProductModel', JSON.stringify(obj));

        $.ajax({
            url: $("#HProductCUD").val(),
            type: "POST",
            cache: false,
            contentType: false,
            processData: false,
            data: formdata,
            success: function (response) {
                data = JSON.parse(response);
                MessageResponse(response, data[0].MessageID)

                if (data[0].MessageID.charAt(0) != 'E') {
                    $("#ProductModal").iziModal('close');
                }

                BindProduct();
            },
            fail: function (response) {
                data = JSON.parse(response);
                MessageResponse(response, data[0].MessageID)
            },
            complete: function (data) {
                $('#divloader').hide();
            }
        });
    }
}

function getCountryList() {
    countryList = [];
    $("input[type=checkbox][name='chkCountry']").each(function () {
        countryList.push({ "CountryID": $(this).val(), "Value": $(this).is(":checked") });
    });

    return JSON.stringify(countryList);
}

function ProductErrorCheck() {
    if (!$("#txtProductName").val()) {
        ShowMessage("E001", "News Name");
        $("#txtProductName").focus();
        return false;
    } if (!$("#txtNewsUrl").val()) {
        ShowMessage("E001", "News Url");
        $("#txtNewsUrl").focus();
        return false;
    } else if ($("[name='chkCountry']:checked").length <= 0){
        ShowMessage("E006", "Country");
        return false;
    }

    if ($("#HMode").val() == 'New') {
        if ($("#rdoActive").is(":checked") && !$("#productupload").val()) {
            ShowMessage("E016", "Product");
            return false;
        }
    } else if ($("#HMode").val() == 'Edit') {
        if ($("#rdoActive").is(":checked") && !$("#Hproductphoto").val()) {
            ShowMessage("E016", "Product");
            return false;
        }
    }

    return true;
}

function ProductEntryClose() {
    $("#ProductModal").iziModal('close');
}

function RemoveProductPhoto() {
    $("#HRemovePhoto").val($("#Hproductphoto").val());
    $("#productphoto").attr("src", $("#HImageLocation").val() + "nophoto.jpg");
    $("#productupload").val('');
    $("#Hproductphoto").val('');
}

function ImportCheck() {
    $('#divloader').show();
    var v1 = '';
    if ($("#hVIPUserRole").val() == '2') {
        v1 = $("#hCountryList").val()
    }

    var obj = {
        CountryList: v1,
    }

    var formdata = new FormData();
    var fileRW = $('#productlistupload')[0];
    formdata.append('productListupload', fileRW.files[0]);
    formdata.append('ProductModel', JSON.stringify(obj));
    $.ajax({
        url: $("#HCheckProductImport").val(),
        type: "POST",
        cache: false,
        contentType: false,
        processData: false,
        data: formdata,
        success: function (data) {
            var jsonResult = JSON.parse(data);
            var messageID = jsonResult[0].MessageID;

            if (messageID != '0') {
                MessageResponse(data, messageID)
                return;
            } else {
                $("#ProductImportModal").iziModal('open');

                var saveEnable = true;

                $('#tblProductPopUp').DataTable({
                    responsive: true,
                    data: jsonResult,
                    datasrc: "",
                    destroy: true,
                    searching: false,
                    "bPaginate": false,
                    "ordering": false,
                    "columns": [
                        { "data": "SEQ", "className": "align-center", width: "5%" },
                        { "data": "Status", "className": "align-center", width: "5%" },
                        { "data": "ErrorMessage", width: "10%" },
                        { "data": "Country", width: "10%" },                 
                        { "data": "ProductName", width: "10%" },
                    ],
                    "rowCallback": function (row, data, index) {
                        if (data.Status == "Error") {
                            saveEnable = false;
                            $('td', row).css('color', 'Red');
                        }
                    }
                });

                if (saveEnable == false) {
                    $("#divconfirm").hide();
                }
                else {
                    $("#divconfirm").show();
                }
            }
        },
        fail: function (data) {
            ShowMessage('E007');
        },
        complete: function (data) {
            $('#divloader').hide();
        }
    });
}

function ImportClose() {
    $("#ProductImportModal").iziModal('close');
    $("#productlistupload").val('');
}


function ImportConfirm() {
    $('#divloader').show();

    var obj = {
        UpdatedBy: $("#hID").val(),
    }

    var formdata = new FormData();
    var fileRW = $('#productlistupload')[0];
    formdata.append('productListupload', fileRW.files[0]);
    formdata.append('ProductModel', JSON.stringify(obj));

    $.ajax({
        url: $("#HProductImportConfrim").val(),
        type: "POST",
        cache: false,
        contentType: false,
        processData: false,
        data: formdata,
        success: function (data) {
            var jsonResult = JSON.parse(data);
            var messageID = jsonResult[0].MessageID;

            MessageResponse(data, messageID);
            $("#ProductImportModal").iziModal('close');

            BindProduct();
        },
        fail: function (response) {
            data = JSON.parse(response);
            MessageResponse(response, data[0].MessageID)
        },
        complete: function (data) {
            $('#divloader').hide();
            $("#productlistupload").val('');
        }
    });
}

