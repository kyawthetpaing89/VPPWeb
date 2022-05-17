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

    BindRewardPrize();
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