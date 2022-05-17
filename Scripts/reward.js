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
            { "data": "Status", width: "10%" },
            { "data": "ItemCode", width: "10%" },
            { "data": "ProductCategoryName", width: "10%" },
            { "data": "ProductDescription", width: "10%" },
            { "data": "ProductPhoto", width: "10%" },
            { "data": "Points", width: "10%" },
            { "data": "ValidTill", width: "10%" },
            { "data": "UnitCost", width: "10%" },
            { "data": "SupplierName", width: "10%" },
            { "data": "CreatedDate", width: "10%" },
            { "data": "Quotation", width: "10%" },
            { "data": "CreatedBy", width: "10%" },
        ],
        "columnDefs": [{
            "targets": 0,
            "data": "ItemCode",
            "render": function (data) {
                return '<button type="button" class="btn btn-grd-info gridbtn" onclick="RewardPrizeEdit(this);"><i class="icon-note"></i>Edit</button>';
            },
        }],
    });
}

function AddNewPrize() {
    ClearReward();

    $(".iziModal-header-title").html('Add Reward Prize');
    $("#RewardPrizeModal").iziModal('open');

    $("#txtItemCode").focus();

    BindProductCategory();
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
