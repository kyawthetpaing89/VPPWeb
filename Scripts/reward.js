function RewardPrizeLoad() {
    $("#RewardPrizeModal").iziModal({
        title: 'Add Reward Prize',
        TransitionIn: 'FadeInRight',
        theme: 'light',
        headerColor: '#008fa2',
        padding: 10,
        top: 70,
        overlayClose: false,
        zindex: 999
    });

    $("#RewardImportModal").iziModal({
        title: 'Reward Prize Import',
        TransitionIn: 'FadeInRight',
        theme: 'light',
        headerColor: '#008fa2',
        padding: 10,
        top: 70,
        overlayClose: false,
        zindex: 1100,
        width:'80%'
    });

    new Cleave('.point1', {
        numeral: true,
        //numeralThousandsGroupStyle: 'none'
    });

    new Cleave('.point2', {
        numeral: true,
        //numeralThousandsGroupStyle: 'none'
    });

    $('#txtValidTill').datepicker({
        uiLibrary: 'bootstrap4',
        format: 'dd mmm yyyy' 
    });

    BindRewardPrize();
    BindProductCategory();
    BindCountry();

    $('#productphoto').on('click', function () {
        $('#productupload').click();
    });

    $('#quotationphoto').on('click', function () {
        $('#quotationupload').click();
    });

    $('#btnUpload').on('click', function () {
        $('#rewardprizeupload').click();
    });

    $("#rewardprizeupload").change(function () {
        ImportCheck();
    });

    $('input[type=radio][name=rdoDetails]').change(function () {
        if (this.value == '0') {
            $("#divURL").show();
            $("#divDetailInfo").hide();
        }
        else if (this.value == '1') {
            $("#divURL").hide();
            $("#divDetailInfo").show();
        }
    });

    $("#divDetailInfo").hide();
}

function BindRewardPrize() {

    var v1 = '';
    if ($("#hVIPUserRole").val() == '2') {
        v1 = $("#hCountryList").val()
    }

    var obj = {
        CountryID: $("#SCountry").children("option:selected").val(),
        ProductCategoryID: $("#SCategory").children("option:selected").val(),
        ActiveStatus: $("#SStatus").children("option:selected").val(),
        CountryList : v1,
    };
    CalltoApiController($("#HGetRewardPrize").val(), obj, 'RewardPrizeResponse');
}

function RewardPrizeResponse(response) {
    $('#tblReward').DataTable({
        //responsive: true,
        scrollY: '1000px',
        scrollX: true,
        scrollCollapse: true,
        fixedColumns: {
            left: 3,
        },
        fixedHeader: true,
        autoWidth: false,
        data: JSON.parse(response),
        datasrc: "",
        destroy: true,
        searching: false,
        "bInfo": false,
        "bPaginate": true,
        "bLengthChange": false,
        "pageLength": 50,
        "ordering": false,
        "columns": [
            { "data": "ItemCode", width: "5%", className: "align-center"},
            { "data": "Status", width: "5%", className: "align-center"},
            { "data": "ItemCode", width: "7%", className: "align-center" },
            { "data": "ProductCategoryName", width: "13%" },
            { "data": "ProductName", className: "width20p" },
            { "data": "ProductPhoto", width: "7%", className: "align-center" },
            { "data": "Points", width: "5%", className: "align-right" },
            { "data": "ValidTill", width: "9%",className:"align-center" },
            { "data": "UnitCost", width: "7%",className: "align-right"},
            { "data": "SupplierName" ,width: "10%" },
            { "data": "CreatedDate", width: "10%", className: "align-center",},
            { "data": "Quotation", width: "10%",  className: "align-center", },
            { "data": "CreatedBy", width: "10%" },
        ],
        "columnDefs": [
            {
            "targets": 0,
            "data": "ItemCode",
            "render": function (data) {
                return '<button type="button" class="btn btn-grd-info gridbtn" onclick="RewardPrizeEdit(this);"><i class="icon-note"></i>Edit</button>';
                },
            },
            {
                targets: [0], "width": '20px'
            },
            {
                "targets": 5,
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
            {
                "targets": 11,
                "data": "Quotation",
                "render": function (data) {
                    if (!data) {
                        var imgpath = $("#HImageLocation").val() + "nophoto.jpg";
                    } else {
                        var imgpath = $("#HImageLocation").val() + data;
                    }
                    return '<image src="' + imgpath + '" style="width:50px;height:50px" />';
                },
            }
        ],
    });

}

function AddNewPrize() {
    ClearReward();

    $(".iziModal-header-title").html('Add Reward Prize');
    $("#ddlCountry").attr("disabled", false);
    $("#RewardPrizeModal").iziModal('open');

    $("#txtItemCode").focus();

    $("#HMode").val('New');

    $("#btnSaveText").html("Save");
}

function RewardPrizeEdit(row) {
    $("#HMode").val('Edit');

    var currentRow = $(row).closest("tr");
    var data = $('#tblReward').DataTable().row(currentRow).data();

    $('input[name="rdoStatus"][value="' + data["ActiveStatus"] + '"]').prop('checked', true);
    $("#ddlCountry").val(data["CountryID"]);
    $("#txtItemCode").val(data["ItemCode"]);
    $("#ddlCategory").val(data["ProductCategoryID"]);
    $("#txtProductName").val(data["ProductName"]);
    $("#txtPoints").val(data["Points"]);
    $("#txtValidTill").val(data["ValidTill"]);
    $('input[name="rdoDetails"][value="' + data["PageType"] + '"]').prop('checked', true);
    $("#txtURL").val(data["ExternalURL"]);
    $("#txtProductDescriptions").val(data["ProductDescriptions"]);
    $("#txtUnitCost").val(data["UnitCost"]);
    $("#txtSupplierName").val(data["SupplierName"]);

    if (data["PageType"] == '0') {
        $("#divURL").show();
        $("#divDetailInfo").hide();
    } else {
        $("#divURL").hide();
        $("#divDetailInfo").show();
    }

    if (!data["ProductPhoto"]) {
        $("#productphoto").attr("src", $("#HImageLocation").val() + "nophoto.jpg");
    } else {
        $("#productphoto").attr("src", $("#HImageLocation").val() + data["ProductPhoto"]);
    }

    if (!data["Quotation"]) {
        $("#quotationphoto").attr("src", $("#HImageLocation").val() + "nophoto.jpg");
    } else {
        $("#quotationphoto").attr("src", $("#HImageLocation").val() + data["Quotation"]);
    }
    

    $("#Hproductphoto").val(data["ProductPhoto"]);
    $("#Hquotation").val(data["Quotation"]);

    $(".iziModal-header-title").html('Edit Reward Prize');
    $("#ddlCountry").attr("disabled", true);
    $("#RewardPrizeModal").iziModal('open');
    $('input[name="rdoStatus"][value="' + data["ActiveStatus"] + '"]').focus();

    $("#btnSaveText").html("Update");
}

function RemoveProductPhoto() {
    $("#productphoto").attr("src", $("#HImageLocation").val() + "nophoto.jpg");
    $("#Hproductphoto").val('');
}

function RemoveQuotationPhoto() {
    $("#quotationphoto").attr("src", $("#HImageLocation").val() + "nophoto.jpg");
    $("#Hquotation").val('');
}

function BindProductCategory() {
    CalltoApiController($("#HGetProductCategory").val(), {}, 'ProductCategoryResponse');

    //BindDropdown({}, $("#HGetProductCategory").val(), 'SCategory', 'ProductCategoryID', 'ProductCategoryName', '', true);
    //BindDropdown({}, $("#HGetProductCategory").val(), 'ddlCategory', 'ProductCategoryID', 'ProductCategoryName', '', true);
}

function ProductCategoryResponse(response) {
    DropdownResponse(response, 'SCategory', 'ProductCategoryID', 'ProductCategoryName', '', true);
    DropdownResponse(response, 'ddlCategory', 'ProductCategoryID', 'ProductCategoryName', '', true);
}

function BindCountry() {
    var obj;
    if ($("#hVIPUserRole").val() == '1') {
        obj = {};
    } else {
        obj = {
            CountryList: $("#hCountryList").val(),
        }
    }
    
    CalltoApiController($("#HGetMimimumRedemptionPoints").val(), obj, 'CountryResponse');
}

function CountryResponse(response) {
    DropdownResponse(response, 'SCountry', 'CountryID', 'CountryName', '', true);
    DropdownResponse(response, 'ddlCountry', 'CountryID', 'CountryName', '', true);
}

function readURL(input, ctrl) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#' + ctrl)
                .attr('src', e.target.result);
        };

        reader.readAsDataURL(input.files[0]);

        $("#Hproductphoto").val('0');
    }
}

function RewardPrizeClose() {
    $("#RewardPrizeModal").iziModal('close');
}

function ClearReward() {
    $("#productphoto").attr("src", $("#imgnophoto").val());
    $("#quotationphoto").attr("src", $("#imgnophoto").val());
    $("#rdoInactive").prop('checked', true);
    $("#txtItemCode").val('');
    $("#ddlCategory").val('');
    $("#ddlCountry").val('');
    $("#txtProductName").val('');
    $("#txtPoints").val('');
    $("#txtValidTill").val('');
    $("#rdoURL").prop('checked', true);
    $('#txtProductDescriptions').val('');
    $("#txtURL").val('');
    $("#txtUnitCost").val('');
    $("#txtSupplierName").val('');

    $("#divURL").show();
    $("#divDetailInfo").hide();
}

function RewardPrizeSave() {
    if (RewardPrizeErrorCheck()) {
        $('#divloader').show();

        var obj = {
            ItemCode: $("#txtItemCode").val(),
            CountryID: $("#ddlCountry").children("option:selected").val(),
            ProductCategoryID: $('#ddlCategory').children("option:selected").val(),
            ProductName: $("#txtProductName").val(),
            Points: $("#txtPoints").val(),
            ValidTill: $("#txtValidTill").val(),
            UnitCost: $("#txtUnitCost").val(),
            SupplierName: $("#txtSupplierName").val(),
            ActiveStatus: $('input[name="rdoStatus"]:checked').val(),
            PageType: $('input[name="rdoDetails"]:checked').val(),
            ExternalURL: $("#txtURL").val(),
            ProductDescriptions: $("#txtProductDescriptions").val(),
            ProductPhoto: $("#Hproductphoto").val(),
            QuotationPhoto: $("#Hquotation").val(),
            UpdatedBy: $("#hID").val(),
            Mode: $("#HMode").val(),
        }

        var formdata = new FormData();

        var product = $('#productupload')[0];
        var quotation = $('#quotationupload')[0];

        formdata.append('product', product.files[0]);
        formdata.append('quotation', quotation.files[0]);

        formdata.append('RewardPrizeModel', JSON.stringify(obj));

        $.ajax({
            url: $("#HRewardPrizeCUD").val(),
            type: "POST",
            cache: false,
            contentType: false,
            processData: false,
            data: formdata,
            success: function (response) {
                data = JSON.parse(response);
                MessageResponse(response, data[0].MessageID)

                if (data[0].MessageID.charAt(0) != 'E') {
                    $("#RewardPrizeModal").iziModal('close');
                }

                BindRewardPrize();
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

function RewardPrizeErrorCheck() {
    if (!$("#txtItemCode").val()) {
        ShowMessage("E001", "Item Code");
        $("#ItemCode").focus();
        return false;
    } else if ($("#ddlCategory").val() == '') {
        ShowMessage("E001", "Category");
        $("#ddlCategory").focus();
        return false;
    } else if (!$("#txtPoints").val()) {
        ShowMessage("E001", "Reward Points Required");
        $("#txtPoints").focus();
        return false;
    } else if (!$("#txtUnitCost").val()) {
        ShowMessage("E001", "D-Link Unit Cost");
        $("#txtUnitCost").focus();
        return false;
    } else if ($("#rdoURL").is(":checked") && !$("#txtURL").val()) {
        ShowMessage("E001", "External URL");
        $("#txtURL").focus();
        return false;
    } else if ($("#rdoDetailPage").is(":checked") && !$("#txtProductDescriptions").val()) {
        ShowMessage("E001", "Product Description");
        $("#txtProductDescriptions").focus();
        return false;
    }

    if ($("#HMode").val() == 'New') {
        if ($("#rdoActive").is(":checked") && !$("#productupload").val()) {
            ShowMessage("E016");
            return false;
        }
    } else if ($("#HMode").val() == 'Edit') {
        if ($("#rdoActive").is(":checked") && !$("#Hproductphoto").val()) {
            ShowMessage("E016");
            return false;
        }
    }

    return true;
}

function GenerateItemCode() {
    $("#txtItemCode").val('');
    var obj = {
        CountryID: $("#ddlCountry").children("option:selected").val(),
    };
    CalltoApiController($("#HGenerateItemCode").val(), obj, 'GenerateItemCodeResponse');
}

function GenerateItemCodeResponse(response) {
    var data = JSON.parse(response);
    $("#txtItemCode").val(data[0].ItemCode);
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
    var fileRW = $('#rewardprizeupload')[0];
    formdata.append('rewardprizeupload', fileRW.files[0]);
    formdata.append('RewardPrizeModel', JSON.stringify(obj));
    $.ajax({
        url: $("#HCheckRewardImport").val(),
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
                $("#RewardImportModal").iziModal('open');

                var saveEnable = true;

                $('#tblRewardPopUp').DataTable({
                    responsive: true,
                    data:jsonResult,
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
                        { "data": "Category", width: "10%" },
                        { "data": "ProductName", width: "10%" },
                        { "data": "RewardPointsRequired", "className": "align-right", width: "10%" },
                        { "data": "ValidTill", "className": "align-center", width: "10%" },
                        { "data": "PageType", width: "10%" },
                        { "data": "ExternalURL", width: "10%" },
                        { "data": "ProductDescriptions", width: "10%" },
                        { "data": "UnitCost", "className": "align-right", width: "10%" },
                        { "data": "Supplier", width: "10%" },
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
    $("#RewardImportModal").iziModal('close');
    $("#rewardprizeupload").val('');
}

function ImportConfirm() {
    $('#divloader').show();

    var obj = {
        UpdatedBy: $("#hID").val(),
    }

    var formdata = new FormData();
    var fileRW = $('#rewardprizeupload')[0];
    formdata.append('rewardprizeupload', fileRW.files[0]);
    formdata.append('RewardPrizeModel', JSON.stringify(obj));

    $.ajax({
        url: $("#HRewardImportConfrim").val(),
        type: "POST",
        cache: false,
        contentType: false,
        processData: false,
        data: formdata,
        success: function (data) {
            var jsonResult = JSON.parse(data);
            var messageID = jsonResult[0].MessageID;

            MessageResponse(data, messageID);
            $("#RewardImportModal").iziModal('close');

            BindRewardPrize();
        },
        fail: function (response) {
            data = JSON.parse(response);
            MessageResponse(response, data[0].MessageID)
        },
        complete: function (data) {
            $('#divloader').hide();
            $("#rewardprizeupload").val('');
        }
    });
}