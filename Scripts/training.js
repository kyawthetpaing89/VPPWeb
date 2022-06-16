
//Training Type Start
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
                    return '<button type="button" class="btn btn-grd-info gridbtn" onclick="TrainingTypeEdit(this);"><i class="icon-note"></i>Edit</button>';
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

function TrainingTypeEdit(row) {
    $("#HMode").val('Edit');

    var currentRow = $(row).closest("tr");
    var data = $('#tblTrainingType').DataTable().row(currentRow).data();

    $("#HTrainingTypeID").val(data["TrainingTypeID"]);
    $('input[name="rdoStatus"][value="' + data["ActiveStatus"] + '"]').prop('checked', true);
    $("#txtTrainingTypeName").val(data["TrainingTypeName"]);

    $("#btnSaveText").html("Update");
    $("#TrainingTypeModal").iziModal('open');
}
//Training Type End

//TrainingListing Start
function TrainingListingLoad() {
    $("#TrainingModal").iziModal({
        title: 'Add Training',
        TransitionIn: 'FadeInRight',
        theme: 'light',
        headerColor: '#008fa2',
        padding: 10,
        top: 10,
        overlayClose: false,
        width: '70%',
        zindex: 1050
    });

    GetTrainingType();
    BindTrainingListing();

    new Cleave('.place1', {
        numeral: true,
        //numeralThousandsGroupStyle: 'none'
    });

    $('#txtTrainingDate').datepicker({
        uiLibrary: 'bootstrap4',
        format: 'dd mmm yyyy'
    });

    new Cleave('.place1', {
        numeral: true,
        //numeralThousandsGroupStyle: 'none'
    });

    $('#txtTrainingDate').datepicker({
        uiLibrary: 'bootstrap4',
        format: 'dd mmm yyyy'
    });

    $('#txtTrainingDate').blur(function () {
        if ($('#txtTrainingDate').val()) {
            var d1 = $('#txtTrainingDate').val();

            if (d1.length == 8) {
                var dd = d1.substring(0, 2);
                var mm = d1.substring(2, 4);
                var yy = d1.substring(4, 8);
                d1 = dd + ' ' + mm + ' ' + yy;
            }

            if (Date.parse(d1)) {
                $('#txtTrainingDate').val(new Date(d1).toLocaleDateString('en-GB', {
                    day: '2-digit', month: 'short', year: 'numeric'
                }).replace(/ /g, ' '));
            } else {
                ShowMessage("E017");
            }
        }      
    });

    $('#STrainingDateFrom').datepicker({
        uiLibrary: 'bootstrap4',
        format: 'dd mmm yyyy'
    });

    $('#STrainingDateFrom').blur(function () {
        if ($('#STrainingDateFrom').val()) {
            var d1 = $('#STrainingDateFrom').val();

            if (d1.length == 8) {
                var dd = d1.substring(0, 2);
                var mm = d1.substring(2, 4);
                var yy = d1.substring(4, 8);
                d1 = dd + ' ' + mm + ' ' + yy;
            }

            if (Date.parse(d1)) {
                $('#STrainingDateFrom').val(new Date(d1).toLocaleDateString('en-GB', {
                    day: '2-digit', month: 'short', year: 'numeric'
                }).replace(/ /g, ' '));
            } else {
                ShowMessage("E017");
            }
        }
    });

    $('#STrainingDateTo').datepicker({
        uiLibrary: 'bootstrap4',
        format: 'dd mmm yyyy'
    });

    $('#STrainingDateTo').blur(function () {
        if ($('#STrainingDateTo').val()) {
            var d1 = $('#STrainingDateTo').val();

            if (d1.length == 8) {
                var dd = d1.substring(0, 2);
                var mm = d1.substring(2, 4);
                var yy = d1.substring(4, 8);
                d1 = dd + ' ' + mm + ' ' + yy;
            }

            if (Date.parse(d1)) {
                $('#STrainingDateTo').val(new Date(d1).toLocaleDateString('en-GB', {
                    day: '2-digit', month: 'short', year: 'numeric'
                }).replace(/ /g, ' '));
            } else {
                ShowMessage("E017");
            }
        }
    });

    $(".border-left-0").focus(function () {
        $("#txtDescription").focus();
    });

    $('[name=rdoEnvironment]').change(function () {
        if (this.value == '1') {
            $("#txtTrainingVenue").prop("readonly", true);
        }
        else if (this.value == '2') {
            $("#txtTrainingVenue").prop("readonly", false);
        }
    });
}

function GetTrainingType() {
    var obj = {
        ActiveStatus: '1',
    };
    CalltoApiController($("#HGetTrainingType").val(), obj, 'GetTrainingTypeResponse');
}

function GetTrainingTypeResponse(response) {
    DropdownResponse(response, 'ddlTrainingType', 'TrainingTypeID', 'TrainingTypeName', '', false);
    DropdownResponse(response, 'ddlSTrainingType', 'TrainingTypeID', 'TrainingTypeName', '', true);
}

function BindTrainingListing() {
    $('#tblTraining tbody').empty();

    var obj = {
        TrainingName: $("#STrainingName").val(),
        ActiveStatus: $("#SStatus").children("option:selected").val(),
        TrainingTypeID: $('#ddlSTrainingType').children("option:selected").val(),
        TrainingEnvironment: $('#STrainingEnvironment').children("option:selected").val(),
        TrainingDateFrom: $("#STrainingDateFrom").val(),
        TrainingDateTo: $("#STrainingDateTo").val(),
        //CountryList: v1,
    };
    CalltoApiController($("#HGetTraining").val(), obj, 'TrainingResponse');
}

function TrainingResponse(response) {
    $('#tblTraining').DataTable({
        scrollY: '1000px',
        scrollX: true,
        scrollCollapse: true,
        fixedColumns: {
            left: 4,
        },
        fixedHeader: true,
        autoWidth: false,
        data: JSON.parse(response),
        datasrc: "",
        destroy: true,
        searching: false,
        "bInfo": false,
        "bPaginate": false,
        "ordering": false,
        "columns": [
            { "data": "TrainingID", width: "5%" },
            { "data": "Status", width: "5%", className: "align-center" },
            { "data": "TrainingTypeName", width: "12%" },
            { "data": "TrainingName", width: "18%" },
            { "data": "TrainingEnvironment", width: "8%" },
            { "data": "AvailablePlaces", width: "8%", className: "align-right" },
            //{ "data": "Description", width: "30%" },
            { "data": "TrainingDate", width: "10%", className: "align-center" },
            { "data": "CreatedDate", width: "10%", className: "align-center" },
            { "data": "CreatedBy", width: "10%" },
        ],
        "columnDefs": [
            {
                "targets": 0,
                "data": "TrainingID",
                "render": function (data) {
                    return '<button type="button" class="btn btn-grd-info gridbtn" onclick="TrainingEdit(this);"><i class="icon-note"></i>Edit</button>';
                },
            },
        ],
    });
}

function AddNewTraining() {
    
    ClearTraining();

    $(".iziModal-header-title").html('Add Training');
    $("#TrainingModal").iziModal('open');

    $("#txtTrainingName").focus();

    $("#HMode").val('New');

    $("#btnSaveText").html("Save");
}

function TrainingEdit(row) {
    $("#HMode").val('Edit');

    var currentRow = $(row).closest("tr");
    var data = $('#tblTraining').DataTable().row(currentRow).data();

    $('input[name="rdoStatus"][value="' + data["ActiveStatus"] + '"]').prop('checked', true);
    $("#HTrainingID").val(data["TrainingID"]);
    $("#txtTrainingName").val(data["TrainingName"]);
    $("#ddlTrainingType").val(data["TrainingTypeID"]);
    $('input[name="rdoEnvironment"][value="' + data["EnvironmentValue"] + '"]').prop('checked', true);
    $("#txtTrainingVenue").val(data["TrainingVenue"]);
    $("#txtPlaces").val(data["AvailablePlaces"]);
    $("#txtTrainingDate").val(data["TrainingDate"]);
    $("#txtDescription").val(data["Description"]);

    if (data["EnvironmentValue"] == '1') {
        $("#txtTrainingVenue").prop("readonly", true);
    } else {
        $("#txtTrainingVenue").prop("readonly", false);
    }

    $(".iziModal-header-title").html('Edit Training');

    $("#TrainingModal").iziModal('open');
    $("#txtTrainingName").focus();

    $("#btnSaveText").html("Update");
}

function ClearTraining() {
    $("#rdoInactive").prop('checked', true);
    $("#txtTrainingName").val('');
    $("#ddlTrainingType").val('1');
    $("#rdoOnline").prop('checked', true);
    $("#txtTrainingVenue").val('');
    $("#txtTrainingVenue").prop("readonly", true);
    $("#txtPlaces").val('');
    $("#txtTrainingDate").val('');
    $("#txtDescription").val('');
}

function TrainingEntryClose() {
    $("#TrainingModal").iziModal('close');
}

function TrainingSave() {
    if (TrainingErrorCheck()) {
        $('#divloader').show();

        var obj = {
            TrainingID: $("#HTrainingID").val(),
            TrainingName: $("#txtTrainingName").val(),
            TrainingTypeID: $('#ddlTrainingType').children("option:selected").val(),
            TrainingVenue: $("#txtTrainingVenue").val(),
            TrainingEnvironment: $('input[name="rdoEnvironment"]:checked').val(),
            AvailablePlaces: $("#txtPlaces").val(),
            TrainingDate: $("#txtTrainingDate").val(),
            Description: $("#txtDescription").val(),
            ActiveStatus: $('input[name="rdoStatus"]:checked').val(),
            UpdatedBy: $("#hID").val(),
            Mode: $("#HMode").val(),
        }

        CalltoApiController($("#HTrainingCUD").val(), obj, 'TrainingSaveResponse');
    }
}

function TrainingSaveResponse(response) {
    data = JSON.parse(response);
    MessageResponse(response, data[0].MessageID)

    if (data[0].MessageID.charAt(0) != 'E') {
        $("#TrainingModal").iziModal('close');
    }

    BindTrainingListing();
    $('#divloader').hide();
}

function TrainingErrorCheck() {
    if (!$("#txtTrainingName").val()) {
        ShowMessage("E001", "Training Name");
        $("#txtTrainingName").focus();
        return false;
    } else if (!$("#ddlTrainingType").val()) {
        ShowMessage("E001", "TrainingType");
        $("#ddlTrainingType").focus();
        return false;
    } else if ((!$("#txtTrainingVenue").val()) && $('#rdoClassroom').is(':checked')) {
        ShowMessage("E001", "Training Venue");
        $("#txtTrainingVenue").focus();
        return false;
    } else if (!$("#txtPlaces").val()) {
        ShowMessage("E001", "Available Places")
        $("#txtPlaces").focus();
        return false;
    } else if (!$("#txtTrainingDate").val()) {
        ShowMessage("E001", "Training Date")
        $("#txtTrainingDate").focus();
        return false;
    } else if (!$("#txtDescription").val()) {
        ShowMessage("E001", "Description")
        $("#txtDescription").focus();
        return false;
    }

    return true;
}

function ClearTrainingSearch() {
    $("#STrainingName").val('');
    $("#ddlSTrainingType").val('');
    $("#STrainingEnvironment").val('');
    $("#STrainingDateFrom").val('');
    $("#STrainingDateTo").val('');
    $("#SStatus").val('');
}
//TrainingListing End