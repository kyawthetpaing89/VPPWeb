function TrainingTypeListingLoad() {
    $("#TrainingTypeModal").iziModal({
        title: 'Add Training Type',
        TransitionIn: 'FadeInRight',
        theme: 'light',
        headerColor: '#008fa2',
        padding: 10,
        top: 70,
        overlayClose: false,
        width: '70%',
        zindex: 1050
    });

    BindTrainingType();
}

function BindTrainingType() {
    $('#tblTrainingType tbody').empty();

    var obj = {
        TrainingTypeName: $("#STrainingTypeName").val(),
        ActiveStatus: $("#SStatus").children("option:selected").val(),
        //CountryList: v1,
    };
    CalltoApiController($("#HGetTrainingType").val(), obj, 'TrainingTypeResponse');
}

function TrainingTypeResponse(response) {
    $('#tblTrainingType').DataTable({
        data: JSON.parse(response),
        datasrc: "",
        destroy: true,
        searching: false,
        "bInfo": false,
        "bPaginate": false,
        "ordering": false,
        "columns": [
            { "data": "TrainingTypeID", width: "5%", className: "align-center" },
            { "data": "Status", width: "10%", className: "align-center" },
            { "data": "TrainingTypeName", width: "30%" },
            { "data": "CreatedDate", width: "10%", className: "align-center", },
            { "data": "CreatedBy", width: "10%" },
        ],
        "columnDefs": [
            {
                "targets": 0,
                "data": "TrainingTypeID",
                "render": function (data) {
                    return '<button type="button" class="btn btn-grd-info gridbtn" onclick="TrainingEdit(this);"><i class="icon-note"></i>Edit</button>';
                },
            },
        ],
    });
}

function AddTrainingType() {
    $("#HMode").val('New');
    $("#btnSaveText").html("Save");
    ClearTrainingType();
    $("#TrainingTypeModal").iziModal('open');
}

function ClearTrainingType() {
    $("#rdoInactive").prop('checked', true);
    $("#txtTrainingTypeName").val('');
}

function TrainingTypeEntryClose() {
    $("#TrainingTypeModal").iziModal('close');
}

function TrainingTypeSave() {
    if (TrainingTypeErrorCheck()) {
        $('#divloader').show();

        var obj = {
            TrainingTypeID: $("#HTrainingTypeID").val(),
            TrainingTypeName: $("#txtTrainingTypeName").val(),
            ActiveStatus: $('input[name="rdoStatus"]:checked').val(),
            UpdatedBy: $("#hID").val(),
            Mode: $("#HMode").val(),
        }

        CalltoApiController($("#HTrainingTypeCUD").val(), obj, 'TrainingTypeSaveResponse');
    }
}

function TrainingTypeSaveResponse(response) {
    data = JSON.parse(response);
    MessageResponse(response, data[0].MessageID)

    if (data[0].MessageID.charAt(0) != 'E') {
        $("#TrainingTypeModal").iziModal('close');
    }

    BindTrainingType();
    $('#divloader').hide();
}

function TrainingTypeErrorCheck() {
    if (!$("#txtTrainingTypeName").val()) {
        ShowMessage("E001", "TrainingType Name");
        $("#txtTrainingTypeName").focus();
        return false;
    }

    return true;
}

function TrainingEdit(row) {
    $("#HMode").val('Edit');

    var currentRow = $(row).closest("tr");
    var data = $('#tblTrainingType').DataTable().row(currentRow).data();

    $("#HTrainingTypeID").val(data["TrainingTypeID"]);
    $('input[name="rdoStatus"][value="' + data["ActiveStatus"] + '"]').prop('checked', true);
    $("#txtTrainingTypeName").val(data["TrainingTypeName"]);

    $("#btnSaveText").html("Update");
    $("#TrainingTypeModal").iziModal('open');
}