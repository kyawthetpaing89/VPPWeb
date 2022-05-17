function MinimumRedemptionPointsLoad() {

    $("#RedemptionPointsModal").iziModal({
        title: 'Edit Minimum Redemption Points',
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

    BindRedemptionTable();
}

function BindRedemptionTable() {
    var obj = {
        CountryID: $("#HCountryID").val(),
    };
    CalltoApiController($("#HGetMimimumRedemptionPoints").val(), obj, 'MinimumRedemptionPointsResponse');
}

function MinimumRedemptionPointsResponse(response) {
    $('#tblMinimumRedemptionPoints').DataTable({
        responsive: true,
        data: JSON.parse(response),
        datasrc: "",
        destroy: true,
        searching: false,
        "bInfo": false,
        "bPaginate": false,
        "ordering": false,
        "columns": [
            { "data": "CountryID", width: "33%" },
            { "data": "CountryName", width: "34%" },
            { "data": "Points", "className": "align-right", width: "33%" }
        ],
        "columnDefs": [{
            "targets": 0,
            "data": "CountryID",
            "render": function (data) {
                return '<button type="button" class="btn btn-grd-info gridbtn" onclick="RedemptionPointsEdit(this);"><i class="icon-note"></i>Edit</button>';
            },
        }],
    });
}

function RedemptionPointsEdit(row) {
    var currentRow = $(row).closest("tr");
    var data = $('#tblMinimumRedemptionPoints').DataTable().row(currentRow).data();
    $("#HCountryID").val(data["CountryID"]);
    $("#txtCountry").val(data["CountryName"]);
    $("#txtPoints").val(data["Points"]);

    $("#RedemptionPointsModal").iziModal('open');

    $("#btnSaveText").html('Update');
    $("#txtPoints").focus();
}

function RedemptionPointsSave() {
    if (!$("#txtPoints").val()) {
        ShowMessage("E001", "Points");
        $("#txtPoints").focus();
        return;
    }

    $('#divloader').show();
    var obj = {
        CountryID: $("#HCountryID").val(),
        CountryName: $("#txtCountry").val(),
        Points: $("#txtPoints").val().replace(",", ""),
        UpdatedBy: $("#hID").val(),
        Mode: 'Edit'
    }

    CalltoApiController($("#HMimimumRedemptionPointsUpdate").val(), obj, 'RedemptionPointsSaveResponse');
}

function RedemptionPointsSaveResponse(response) {
    $('#divloader').hide();
    data = JSON.parse(response);
    MessageResponse(response, data[0].MessageID)

    $("#RedemptionPointsModal").iziModal('close');
    $("#HCountryID").val('');
    BindRedemptionTable();
}

function RedemptionPointsClose() {
    $("#RedemptionPointsModal").iziModal('close');
}
