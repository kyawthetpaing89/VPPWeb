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

    $('#productphoto').on('click', function () {
        $('#productupload').click();
    });

    $('#quotationphoto').on('click', function () {
        $('#quotationupload').click();
    });
}

function BindRewardPrize() {
    var obj = {
        CountryCode: '',
    };
    CalltoApiController($("#HGetRewardPrize").val(), obj, 'RewardPrizeResponse');
}

function RewardPrizeResponse(response) {
    $('#tblReward').DataTable({
        responsive: true,
        data: JSON.parse(response),
        datasrc: "",
        destroy: true,
        searching: false,
        "bInfo": false,
        "bPaginate": false,
        "ordering": false,
        "columns": [
            { "data": "ItemCode", width: "10%" },
            { "data": "Status", width: "10%", className: "align-center"},
            { "data": "ItemCode", width: "10%" },
            { "data": "ProductCategoryName", width: "10%" },
            { "data": "ProductDescription", width: "10%" },
            { "data": "ProductPhoto", width: "10%", className: "align-center" },
            { "data": "Points", width: "10%", className: "align-right" },
            { "data": "ValidTill", width: "10%",className:"align-center" },
            { "data": "UnitCost", width: "10%", className: "align-right"},
            { "data": "SupplierName", width: "10%" },
            { "data": "CreatedDate", width: "10%", className: "align-center" },
            { "data": "Quotation", width: "10%", className: "align-center" },
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
                "targets": 5,
                "data": "ProductPhoto",
                "render": function (data) {
                    var imgpath = $("#HImageLocation").val() + data;
                    return '<image src="'+ imgpath +'" style="width:50px;height:50px" />';
                },
            },
            {
                "targets": 11,
                "data": "Quotation",
                "render": function (data) {
                    var imgpath = $("#HImageLocation").val() + data;
                    return '<image src="' + imgpath + '" style="width:50px;height:50px" />';
                },
            }
        ],
    });
}

function AddNewPrize() {
    ClearReward();

    $(".iziModal-header-title").html('Add Reward Prize');
    $("#RewardPrizeModal").iziModal('open');

    $("#txtItemCode").focus();

    $("#HMode").val('New');
}

function BindProductCategory() {
    BindDropdown({}, $("#HGetProductCategory").val(), 'ddlCategory', 'ProductCategoryID', 'ProductCategoryName','',true);
}

function readURL(input, ctrl) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#' + ctrl)
                .attr('src', e.target.result);
        };

        reader.readAsDataURL(input.files[0]);
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
    $("#txtProductDescription").val('');
    $("#txtPoints").val('');
    $("#txtValidTill").val('');
    $('#txtDetails').val('');
    $("#txtUnitCost").val('');
    $("#txtSupplierName").val('');
}

function RewardPrizeSave() {
    if (RewardPrizeErrorCheck()) {
        $('#divloader').show();

        var obj = {
            ItemCode: $("#txtItemCode").val(),
            ProductCategoryID: $('#ddlCategory').children("option:selected").val(),
            ProductDescription: $("#txtProductDescription").val(),
            Points: $("#txtPoints").val().replace(",",""),
            ValidTill: $("#txtValidTill").val(),
            Details: $('#txtDetails').val(),
            UnitCost: $("#txtUnitCost").val().replace(",",""),
            SupplierName: $("#txtSupplierName").val(),
            ActiveStatus: $('input[name="rdoStatus"]:checked').val(),
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
    }

    return true;
}
