function EventListingLoad() {

    BindEvent();

    $("#EventModal").iziModal({
        title: 'Add Event',
        TransitionIn: 'FadeInRight',
        theme: 'light',
        headerColor: '#008fa2',
        padding: 10,
        top: 30,
        overlayClose: false,
        width: '50%',
        zindex: 1050
    });

    //$("#btnNewEvent").on("click", function () {
    //    $("#HMode").val('New');
    //    ClearEventModal();
    //    $("#EventModal").iziModal('open');
    //});

    BindCountryCheckBox();
    BindEventType();

    $("#chkAll").change(function () {
        $("[name='chkCountry']").prop('checked', this.checked);
    });

    $('#txtEventDate').datepicker({
        uiLibrary: 'bootstrap4',
        format: 'dd mmm yyyy'
    });

    new Cleave('.eventcost', {
        numeral: true,
    });

    new Cleave('.points', {
        numeral: true,
    });

    ControlDisable();

    $('input[type=radio][name=rdoEnvironment]').change(function () {
        ControlDisable();
    });

    $('#btnUploadCalendar').on('click', function () {
        $('#calendarupload').val('');
        $('#calendarupload').click();
    });

    $('#btnUploadFlyer').on('click', function () {
        $('#flyerupload').val('');
        $('#flyerupload').click();
    });

    $('#calendarupload').on('change', function () {
        $("#btnCalendar").show();
        $("#btnCalendarRemove").show();
    });

    $('#flyerupload').on('change', function () {
        $("#btnFlyer").show();
        $("#btnFlyerRemove").show();
    });

    $("#btnFlyerRemove").on('click', function () {
        $("#hflyeruploadvalue").val('');

        $("#btnFlyer").hide();
        $("#btnFlyerRemove").hide();
    });

    $("#btnCalendarRemove").on('click', function () {
        $("#hcalendaruploadvalue").val('');

        $("#btnCalendar").hide();
        $("#btnCalendarRemove").hide();
    });

    $("#btnCalendar").hide();
    $("#btnCalendarRemove").hide();
    $("#btnFlyer").hide();
    $("#btnFlyerRemove").hide();

    $("#btnEventSave").on('click', function () {
        EventSave();
    })

    $("#btnEventClose").on('click', function () {
        EventClose();
    })

    $(".iziModal-button-close").on('click', function () {
        EventClose();
    });
}

function AddEvent() {
    $("#HMode").val('New');
    ClearEventModal();
    $("#EventModal").iziModal('open');
}

function BindEvent() {
    $('#tblEvent tbody').empty();

    //var v1 = '';
    //if ($("#hVIPUserRole").val() == '2') {
    //    v1 = $("#hCountryList").val()
    //}

    var obj = {
        //ProductName: $("#SProductName").val(),
        //ActiveStatus: $("#SStatus").children("option:selected").val(),
        //CountryList: v1,
    };
    CalltoApiController($("#HGetEvent").val(), obj, 'EventResponse');
}

function EventResponse(response) {
    $('#tblEvent').DataTable({
        dom: 'Bfltip',
        data: JSON.parse(response),
        datasrc: "",
        destroy: true,
        searching: true,
        "bInfo": false,
        "bPaginate": false,
        "ordering": false,
        buttons: [
            {
                className: 'btn btn-block btn-grd-info',
                text: '<i class="ion- plus - round"></i> Add Event',
                action: function (e, dt, node, config) {
                    AddEvent();
                },
                titleAttr: 'Refresh Log'
            }
        ],
        "columns": [
            { "data": "EventCode", width: "7%", className: "align-center" },
            { "data": "EventCode", width: "7%", className: "align-center" },
            { "data": "EventDate", width: "8%", className: "align-center" },
            { "data": "EventTime", width: "8%" },
            { "data": "EventName", width: "10%" },
            { "data": "Countrylist", width: "30%", },
            { "data": "EventTypeName", width: "10%"},
            { "data": "CostUSD", width: "5%", className: "align-right" },
            { "data": "RewardPoints", width: "5%", className: "align-right pr10" },
        ],
        "columnDefs": [
            {
                "targets": 0,
                "data": "EventCode",
                "render": function (data) {
                    return '<button type="button" class="btn btn-grd-info gridbtn" onclick="EventEdit(this);"><i class="icon-note"></i>Edit</button>';
                },
            },
        ],
    });
}

function EventSave() {
    if (EventErrorcheck()) {
        $('#divloader').show();

        var obj = {
            ActiveStatus: $('input[name="rdoStatus"]:checked').val(),
            ProductID: $("#HProductID").val(),
            EventCode: $("#txtEventCode").val(),
            CountryJson: getCountryList(),
            EventDate: $("#txtEventDate").val(),
            EventTime: $("#txtEventTime").val(),
            EventName: $("#txtEventName").val(),
            EventTypeID: $('#EventType').children("option:selected").val(),
            CourseCode: $('#CourseCode').children("option:selected").val(),
            Title: $("#txtTitle").val(),
            Agenda: $("#txtAgenda").val(),
            Speakers: $("#txtSpeaker").val(),
            CostUSD: $("#txtCost").val(),
            RewardPoints: $("#txtRewardPoints").val(),
            Environment: $('input[name="rdoEnvironment"]:checked').val(),
            Venue: $('#Venue').children("option:selected").val(),
            EventAddress: $("#txtAddress").val(),
            EventLink: $("#txtEventLink").val(),
            OutlookClanderICS: $("#hcalendaruploadvalue").val(),
            EventFlyer: $("#hflyeruploadvalue").val(),
            UpdatedBy: $("#hID").val(),
            Mode: $("#HMode").val(),
        };

        var formdata = new FormData();
        var calendar = $('#calendarupload')[0];
        var flyer = $('#flyerupload')[0];

        formdata.append('calendar', calendar.files[0]);
        formdata.append('flyer', flyer.files[0]);

        formdata.append('EventModel', JSON.stringify(obj));

        $.ajax({
            url: $("#HEventCUD").val(),
            type: "POST",
            cache: false,
            contentType: false,
            processData: false,
            data: formdata,
            success: function (response) {
                data = JSON.parse(response);
                MessageResponse(response, data[0].MessageID)

                if (data[0].MessageID.charAt(0) != 'E') {
                    $("#EventModal").iziModal('close');
                }

                BindEvent();
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

function EventEdit(row) {
    $("#HMode").val('Edit');

    var currentRow = $(row).closest("tr");
    var data = $('#tblEvent').DataTable().row(currentRow).data();

    $("#txtEventCode").val(data["EventCode"]);
    $('input[name="rdoStatus"][value="' + data["ActiveStatus"] + '"]').prop('checked', true);
    $("#txtEventDate").val(data["EventDate"]);
    $("#txtEventTime").val(data["EventTime"]);
    $("#txtEventName").val(data["EventName"]);
    $("#EventType").val(data["EventTypeID"]);
    $("#CourseCode").val(data["CourseCode"]);
    $("#txtTitle").val(data["Title"]);
    $("#txtAgenda").val(data["Agenda"]);
    $("#txtSpeaker").val(data["Speakers"]);
    $("#txtCost").val(data["CostUSD"]);
    $("#txtRewardPoints").val(data["RewardPoints"]);
    $('input[name="rdoEnvironment"][value="' + data["Environment"] + '"]').prop('checked', true);
    $("#Venue").val(data["Venue"]);
    $("#txtAddress").val(data["EventAddress"]);
    $("#txtEventLink").val(data["EventLink"]);

    $("input[type=checkbox][name='chkCountry']").each(function () {

        if (data["Countrylist"].search($(this).data("name")) > -1) {
            $(this).prop("checked", true);
        } else {
            $(this).prop("checked", false);
        }
    });

    ControlDisable();

    $("#hcalendaruploadvalue").val(data["OutlookClanderICS"]);
    $("#hflyeruploadvalue").val(data["EventFlyer"]);

    if (!$("#hcalendaruploadvalue").val()) {
        $("#btnCalendar").hide();
        $("#btnCalendarRemove").hide();
    } else {
        $("#btnCalendar").show();
        $("#btnCalendarRemove").show();
    }

    if (!$("#hflyeruploadvalue").val()) {
        $("#btnFlyer").hide();
        $("#btnFlyerRemove").hide();
    } else {
        $("#btnFlyer").show();
        $("#btnFlyerRemove").show();
    }

    $("#btnSaveText").html("Update");
    $(".iziModal-header-title").html('Edit Event');
    $("#EventModal").iziModal('open');
}

function getCountryList() {
    countryList = [];
    $("input[type=checkbox][name='chkCountry']").each(function () {
        countryList.push({ "CountryID": $(this).val(), "Value": $(this).is(":checked") });
    });

    return JSON.stringify(countryList);
}

function EventClose() {
    ClearEventModal();
    $("#EventModal").iziModal('close');
}

function EventErrorcheck() {
    if ($("[name='chkCountry']:checked").length <= 0) {
        ShowMessage("E006", "Country");
        return false;
    } else if (!$("#txtEventDate").val()) {
        ShowMessage("E001", "Event Date");
        $("#txtEventDate").focus();
        return false;
    } else if (!$("#txtEventTime").val()) {
        ShowMessage("E001", "Event Time");
        $("#txtEventTime").focus();
        return false;
    } else if (!$("#txtEventName").val()) {
        ShowMessage("E001", "Event Name");
        $("#txtEventName").focus();
        return false;
    } else if (!$("#txtTitle").val()) {
        ShowMessage("E001", "Title");
        $("#Title").focus();
        return false;
    } else if (!$("#txtAgenda").val()) {
        ShowMessage("E001", "Agenda");
        $("#txtAgenda").focus();
        return false;
    } else if (!$("#txtSpeaker").val()) {
        ShowMessage("E001", "Speaker");
        $("#txtSpeaker").focus();
        return false;
    } else if (!$("#txtCost").val()) {
        ShowMessage("E001", "Cost(USD)");
        $("#txtCost").focus();
        return false;
    } else if (!$("#txtRewardPoints").val()) {
        ShowMessage("E001", "Reward Points");
        $("#txtRewardPoints").focus();
        return false;
    }

    if ($('input[name="rdoEnvironment"]:checked').val() == '0') {
        if (!$("#Venue").val()) {
            ShowMessage("E001", "Venue");
            $("#Venue").focus();
            return false;
        } else if (!$("#txtAddress").val()) {
            ShowMessage("E001", "Address");
            $("#txtAddress").focus();
            return false;
        }
    } else {
        if (!$("#txtEventLink").val()) {
            ShowMessage("E001", "Event Link");
            $("#txtEventLink").focus();
            return false;
        }
    }

    return true;
}

function BindCountryCheckBox() {
    CalltoApiController($("#HGetCountry").val(), {}, 'CountryCheckBoxResponse');
}

function CountryCheckBoxResponse(response) {
    var data = JSON.parse(response);

    data.forEach(function (j) {
        var chkdiv = '<div class="checkbox-fade fade-in-primary col-sm-3" style="padding:0;margin-right:0">' +
            '<label>' +
            '<input id="chk' + j.CountryCode + '" type="checkbox" data-name="' + j.CountryName + '" name="chkCountry" value="' + j.CountryID + '" class="input-danger">' +
            '<span class="cr">' +
            '<i class="cr-icon icofont icofont-ui-check txt-primary"></i>' +
            '</span>' +
            '<span>' + j.CountryName + '</span>' +
            '</label>' +
            '</div>';

        $("#divCheckBoxList").append(chkdiv);
    });
}

function BindEventType() {
    CalltoApiController($("#HGetEventType").val(), {}, 'GetEventTypeResponse');
}

function GetEventTypeResponse(response) {
    DropdownResponse(response, 'EventType', 'EventTypeID', 'EventTypeName', '', false);
}

function ControlDisable() {
    if ($('input[name="rdoEnvironment"]:checked').val() == '0') {
        $("#Venue").attr('readonly', false);
        $('#txtAddress').attr('readonly', false);
        $('#txtEventLink').attr('readonly', true);
        $('#txtEventLink').val('');
    } else {
        $("#Venue").attr('readonly', true);
        $('#txtAddress').attr('readonly', true);
        $('#txtEventLink').attr('readonly', false);
        $('#Venue').val('');
        $('#txtAddress').val('');
    }
}

function ClearEventModal() {
    $(".iziModal-header-title").html('Add Event')

    $("#rdoInactive").prop('checked', true);
    $("#txtEventCode").val('');
    $("#chkAll").prop('checked', false);
    $("[name='chkCountry']").prop('checked', false);
    $("#txtEventDate").val('');
    $("#txtEventTime").val('');
    $("#txtEventName").val('');
    $("#EventType").val($("#EventType option:first").val());
    $("#CourseCode").val($("#EventType option:first").val());
    $("#txtTitle").val('');
    $("#txtAgenda").val('');
    $("#txtSpeaker").val('');
    $("#txtCost").val('');
    $("#rdoPhysical").prop('checked', true);
    $("#Venue").val('');
    $("#txtAddress").val('');
    $("#txtEventLink").val('');
    $("hcalendaruploadvalue").val('');
    $("hflyeruploadvalue").val('');

    $("#btnCalendar").hide();
    $("#btnCalendarRemove").hide();
    $("#btnFlyer").hide();
    $("#btnFlyerRemove").hide();
}
