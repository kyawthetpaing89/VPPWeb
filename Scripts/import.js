function ImportLogLoad() {

    $("#RewardPrizeDetailModal").iziModal({
        title: 'Reward Prize Import Detail',
        TransitionIn: 'FadeInRight',
        theme: 'light',
        headerColor: '#008fa2',
        padding: 10,
        top: 70,
        overlayClose: false,
        zindex: 1100,
        width:'80%'
    });

    $("#ProductDetailModal").iziModal({
        title: 'Product Import Detail',
        TransitionIn: 'FadeInRight',
        theme: 'light',
        headerColor: '#008fa2',
        padding: 10,
        top: 70,
        overlayClose: false,
        zindex: 1100,
        width: '80%'
    });

    BindImportLogTable();
}

function BindImportLogTable() {
    CalltoApiController($("#HGetImportLog").val(), {}, 'ImportLogResponse');
}

function ImportLogResponse(response) {
    $('#tblImportLog').DataTable({
        responsive: true,
        data: JSON.parse(response),
        datasrc: "",
        destroy: true,
        searching: false,
        "bInfo": false,
        "bPaginate": false,
        "ordering": false,
        "columns": [
            { "data": "ImportID", width: "10%" },
            { "data": "ImportTypeName", width: "15%" },
            { "data": "FileName", width: "15%" },
            { "data": "RecordCount", "className": "align-right", width: "20%" },
            { "data": "ImportedDate", "className": "align-center", width: "20%" },
            { "data": "ImportedName", width: "20%" },
        ],
        "columnDefs": [{
            "targets": 0,
            "data": "ImportLogID",
            "render": function (data) {
                return '<button type="button" class="btn btn-grd-info gridbtn" style="width:auto;" onclick="ImportDetail(this);"><i class="ion-navicon-round"></i>Detail</button>';
            },
        }],
    });
}

function ImportDetail(row) {

    $("#tblImportRewardPrizeDetail tbody").empty();

    var currentRow = $(row).closest("tr");
    var data = $('#tblImportLog').DataTable().row(currentRow).data();
    var obj = {
        ImportLogID: data["ImportLogID"],
    }

    if (data["ImportType"] == '1') {
        $("#tblImportRewardPrizeDetail tbody").empty();

        CalltoApiController($("#HGetImportRewardPrize").val(), obj, 'RewardPrizeDetailResponse');

        $("#RewardPrizeDetailModal").iziModal('open');
    } else if (data["ImportType"] == '2') {
        $("#tblImportProductDetail tbody").empty();

        CalltoApiController($("#HGetImportProduct").val(), obj, 'ProductDetailResponse');

        $("#ProductDetailModal").iziModal('open');
    }
}

function RewardPrizeDetailResponse(response) {
    $('#tblImportRewardPrizeDetail').DataTable({
        responsive: true,
        data: JSON.parse(response),
        datasrc: "",
        destroy: true,
        searching: false,
        "bInfo": false,
        "bPaginate": false,
        "ordering": false,
        "columns": [
            { "data": "ImportSEQ", "className": "align-right", width: "5%" },
            { "data": "ItemCode", width: "10%" },
            { "data": "CountryName",  width: "10%" },
            { "data": "ProductCategoryName", width: "15%" },
            { "data": "Points", "className": "align-right", width: "10%" },
            { "data": "ValidTill", "className": "align-center", width: "10%" },
            { "data": "ProductName", width: "10%" },
            { "data": "UnitCost", "className": "align-right", width: "10%" },
            { "data": "SupplierName", width: "10%" },
        ],
    });
}

function ProductDetailResponse(response) {
    $('#tblImportProductDetail').DataTable({
        responsive: true,
        data: JSON.parse(response),
        datasrc: "",
        destroy: true,
        searching: false,
        "bInfo": false,
        "bPaginate": false,
        "ordering": false,
        "columns": [
            { "data": "ImportSEQ", "className": "align-right", width: "5%" },
            { "data": "ProductName", width: "32%" },
            { "data": "Country", width: "32%" },
            { "data": "NewsUrl", width: "31%" },
        ],
    });
}

function ImportRewardPrizeDetailClose() {
    $("#RewardPrizeDetailModal").iziModal('close');
}

function ImportProductDetailClose() {
    $("#ProductDetailModal").iziModal('close');
}

