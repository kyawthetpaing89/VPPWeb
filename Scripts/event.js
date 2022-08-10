function EventListingLoad() {

    BindEvent();// show table

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
    }); // popup setting

    BindCountryCheckBox();

    BindEventType();

    BindCountry();

    $("#chkAll").change(function () {
        $("[name='chkCountry']").prop('checked', this.checked);
    }); // check, uncheck (All) for country list check box

    $('#txtEventDate').datepicker({
        uiLibrary: 'bootstrap4',
        format: 'dd mmm yyyy'
    });

    $('#SEventDateFrom').datepicker({
        uiLibrary: 'bootstrap4',
        format: 'dd mmm yyyy'
    });

    $('#SEventDateTo').datepicker({
        uiLibrary: 'bootstrap4',
        format: 'dd mmm yyyy'
    });
    
    new Cleave('.eventcost', {
        numeral: true,
    }); // thousand separator & number only accept

    new Cleave('.points', {
        numeral: true,
    }); // thousand separator & number only accept

    ControlDisable(); //Enable, Disable Venue and Address depend on Environment(Physical, Online)

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
        $("#CalendarName").show();
        $("#CalendarName").html($("#calendarupload")[0].files[0].name);
        $("#btnCalendarRemove").show();
    });

    $('#flyerupload').on('change', function () {
        $("#btnFlyer").show();
        $("#FlyerName").show();
        $("#FlyerName").html($("#flyerupload")[0].files[0].name);
        $("#btnFlyerRemove").show();

        var extension = $("#FlyerName").html().substr(($("#FlyerName").html().lastIndexOf('.') + 1));
        if (extension == 'pdf') {
            $("#flyerico").removeClass('icofont-image');
            $("#flyerico").addClass('icofont-file-pdf');
        } else {
            $("#flyerico").removeClass('icofont-file-pdf');
            $("#flyerico").addClass('icofont-image');
        }

    });

    $("#btnFlyerRemove").on('click', function () {
        $("#hflyeruploadvalue").val('');
        $("#FlyerName").hide();
        $("#FlyerName").html('');
        $("#btnFlyer").hide();
        $("#btnFlyerRemove").hide();
    });

    $("#btnCalendarRemove").on('click', function () {
        $("#hcalendaruploadvalue").val('');
        $("#CalendarName").hide();
        $("#CalendarName").html('');
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

    $("#btnFlyer").on('click', function () {
        if ($("#FlyerName").html() != '' && $("#HMode").val() == 'Edit') {
            if ($("#txtEventCode").val()) {
                var extension = $("#FlyerName").html().substr(($("#FlyerName").html().lastIndexOf('.') + 1));
                var url = $("#HImageLocation").val() + 'Event/' + $("#txtEventCode").val() + '.' + extension;
                window.open(
                    url,
                    '_blank' // <- This is what makes it open in a new window.
                );
            }
        }
        
    });

    $("#btnSearchClear").on('click', function () {
        ClearAdvancedSearch();
    });

    $("#btnSearchEvent").on('click', function () {
        BindEvent();
    });
}

function ClearAdvancedSearch() {
    $("#SCountry").val('');
    $("#SEventType").val('');
    $("#SEventDateFrom").val('');
    $("#SEventDateTo").val('');
    BindEvent();
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

    CalltoApiController($("#HGetCountry").val(), obj, 'CountryResponse');
}

function CountryResponse(response) {
    DropdownResponse(response, 'SCountry', 'CountryID', 'CountryName', '', true);
}

function AddEvent() {
    $("#HMode").val('New');
    ClearEventModal();
    ResetEventTimeControl();
    $("#EventModal").iziModal('open');
}

function BindEvent() {
    $('#tblEvent tbody').empty();

    var v1 = '';
    if ($("#hVIPUserRole").val() == '2') {
        v1 = $("#hCountryList").val()
    }

    var obj = {
        PartnerCountry: $("#SCountry").children("option:selected").val(),
        EventTypeID: $("#SEventType").children("option:selected").val(),
        EventDateFrom: $("#SEventDateFrom").val(),
        EventDateTo: $("#SEventDateTo").val(),
        Title: $("#STitle").val(),
        //ProductName: $("#SProductName").val(),
        //ActiveStatus: $("#SStatus").children("option:selected").val(),
        CountryList: v1,
    };
    CalltoApiController($("#HGetEvent").val(), obj, 'EventResponse');
}

function EventResponse(response) {
    $('#tblEvent').DataTable({
        scrollY: '500px',
        scrollCollapse: true,
        dom: 'Bfltip',
        data: JSON.parse(response),
        datasrc: "",
        destroy: true,
        searching: true,
        "bInfo": true,
        "bPaginate": true,
        "bLengthChange": false,
        "pageLength": 50,
        "ordering": true,
        "oLanguage": {
            "sSearch": "Quick Search:"
        },
        buttons: [
            {
                className: 'btn btn-sm',
                text: '<i class="ion-plus-round"></i> Add Event',
                action: function (e, dt, node, config) {
                    AddEvent();
                },
                titleAttr: 'Add Event'
            },
            {
                className: 'btn btn-sm advsearch',
                text: '<i id="asi" class="icofont icofont-caret-down"></i> Advanced Search',
                action: function (e, dt, node, config) {
                    if (!$('#AdvanceSearch').is(':visible')) {
                        $("#asi").removeClass('icofont-caret-down');
                        $("#asi").addClass('icofont icofont-caret-up');
                    } else {
                        $("#asi").removeClass('icofont-caret-up');
                        $("#asi").addClass('icofont-caret-down');
                    }
                    $("#AdvanceSearch").slideToggle(500);
                },
                init: function (dt, node, config) {
                    
                },
                titleAttr: 'Advanced Search'
            }
        ],
        "columns": [
            { "data": "EventCode", width: "5%", className: "align-center" },
            { "data": "Countrylist", width: "5%", className: "align-center" },
            { "data": "EventDate", width: "8%", className: "align-center" },
            { "data": "EventTypeName", width: "13%" },
            { "data": "Title", width: "34%" },
            { "data": "ShowVenue", width: "7%" },
            { "data": "RegisteredPeople", width: "8%", className: "align-right" },
            { "data": "EventFlyer", width: "4%", className: "align-center"},
            { "data": "CostUSD", width: "10%", className: "align-right" },
            { "data": "RewardPoints", width: "5%", className: "align-right pr10" },
        ],
        "columnDefs": [
            {
                "targets": 0,
                "data": "EventCode",
                "render": function (data) {
                    return '<button type="button" title="Edit Event" style="width:70px" class="gridbtnedit" onclick="EventEdit(this);"><i class="icon-note"></i> Edit</button><hr style="margin:2px" />' +
                        '<button type="button" title="Register Event" style="width:70px" class="gridbtnregister" onclick="GoRegisterLink(this);"><i class="icofont icofont-external-link"></i> Register</button>';
                },
            },
            {
                "targets": 2,
                "data": "EventDate",
                "render": function (data,type,row) {
                    return row.EventDate + '<br/>' + row.EventTime;
                },
            },
            {
                "targets": 7,
                "data": "EventFlyer",
                "render": function (data) {
                    return '<button type="button" title="Flyer Photo" class="gridbtnphoto" onclick="FlyerPhoto(this);"><i class="icon-picture"></i></button>';
                },
            },
        ],
    });
}

function GoRegisterLink(row) {
    var currentRow = $(row).closest("tr");
    var data = $('#tblEvent').DataTable().row(currentRow).data();

    var url = $("#HTrainingRegister").val() + '?EventCode=' + data["EventCode"];
    window.open(
        url,
        '_blank' // <- This is what makes it open in a new window.
    );
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
            EventTimeFrom: $(".timefrom").attr('value'),
            EventTimeTo: $(".timeto").attr('value'),
            EventName: $("#txtEventName").val(),
            EventTypeID: $('#EventType').children("option:selected").val(),
            CourseCode: $('#CourseCode').val(),
            Title: $("#txtTitle").val(),
            Agenda: $("#txtAgenda").val(),
            Speakers: $("#txtSpeaker").val(),
            Language: $('#ddlLanguage').children("option:selected").val(),
            Certificate: $('input[name="rdoCertificate"]:checked').val(),
            CostUSD: $("#txtCost").val(),
            RewardPoints: $("#txtRewardPoints").val(),
            Environment: $('input[name="rdoEnvironment"]:checked').val(),
            Venue: $('#Venue').val(),
            EventAddress: $("#txtAddress").val(),
            EventLink: $("#txtEventLink").val(),
            OutlookCalendarICS: $("#hcalendaruploadvalue").val(),
            OutlookCalendarFileName: $("#CalendarName").html(),
            EventFlyer: $("#hflyeruploadvalue").val(),
            EventFlyerFileName: $("#FlyerName").html(),
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

function FlyerPhoto(row) {
    var currentRow = $(row).closest("tr");
    var data = $('#tblEvent').DataTable().row(currentRow).data();

    var url = $("#HImageLocation").val() + data["EventFlyer"];
    window.open(
        url,
        '_blank' // <- This is what makes it open in a new window.
    );
}

function EventEdit(row) {
    ResetEventTimeControl();
    $("#HMode").val('Edit');

    var currentRow = $(row).closest("tr");
    var data = $('#tblEvent').DataTable().row(currentRow).data();
    $("#txtEventCode").val(data["EventCode"]);
    $('input[name="rdoStatus"][value="' + data["ActiveStatus"] + '"]').prop('checked', true);
    $("#txtEventDate").val(data["EventDate"]);
    $("#txtEventTimeFrom").val(data["EventTimeFrom"]);
    //$(".timefrom").attr("value", '00:00');
    //$(".timeto").attr("value", '00:00');
    $(".timefrom").attr("value", data["EventTimeFrom"]);
    $(".timeto").attr("value", data["EventTimeTo"]);
    $("#txtEventTimeTo").val(data["EventTimeTo"]);
    $("#txtEventName").val(data["EventName"]);
    $("#EventType").val(data["EventTypeID"]);
    $("#CourseCode").val(data["CourseCode"]);
    $("#txtTitle").val(data["Title"]);
    $("#txtAgenda").val(data["Agenda"]);
    $("#txtSpeaker").val(data["Speakers"]);
    $("#ddlLanguage").val(data["Language"]);
    $('input[name="rdoCertificate"][value="' + data["Certificate"] + '"]').prop('checked', true);
    $("#txtCost").val(data["CostUSD"]);
    $("#txtRewardPoints").val(data["RewardPoints"]);
    $('input[name="rdoEnvironment"][value="' + data["Environment"] + '"]').prop('checked', true);
    $("#Venue").val(data["Venue"]);
    $("#txtAddress").val(data["EventAddress"]);
    $("#txtEventLink").val(data["EventLink"]);
    $("#CalendarName").html(data["OutlookCalendarFileName"]);
    $("#FlyerName").html(data["EventFlyerFileName"]);

    var extension = $("#FlyerName").html().substr(($("#FlyerName").html().lastIndexOf('.') + 1));
    if (extension == 'pdf') {
        $("#flyerico").removeClass('icofont-image');
        $("#flyerico").addClass('icofont-file-pdf');
    } else {
        $("#flyerico").removeClass('icofont-file-pdf');
        $("#flyerico").addClass('icofont-image');
    }

    $("input[type=checkbox][name='chkCountry']").each(function () {

        if (data["Countrylist"].search($(this).data("name")) > -1) {
            $(this).prop("checked", true);
        } else {
            $(this).prop("checked", false);
        }
    });

    ControlDisable();

    $("#hcalendaruploadvalue").val(data["OutlookCalendarICS"]);
    $("#hflyeruploadvalue").val(data["EventFlyer"]);

    if (!$("#hcalendaruploadvalue").val()) {
        $("#CalendarName").hide();
        $("#btnCalendar").hide();
        $("#btnCalendarRemove").hide();
    } else {
        $("#CalendarName").show();
        $("#btnCalendar").show();
        $("#btnCalendarRemove").show();
    }

    if (!$("#hflyeruploadvalue").val()) {
        $("#FlyerName").hide();
        $("#btnFlyer").hide();
        $("#btnFlyerRemove").hide();
    } else {
        $("#FlyerName").show();
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
    } else if (!$("#txtTitle").val()) {
        ShowMessage("E001", "Title");
        $("#txtTitle").focus();
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
    var obj = {
        ActiveStatus : '1'
    }
    CalltoApiController($("#HGetEventType").val(), obj, 'GetEventTypeResponse');
}

function GetEventTypeResponse(response) {
    DropdownResponse(response, 'EventType', 'EventTypeID', 'EventTypeName', '', false);
    DropdownResponse(response, 'SEventType', 'EventTypeID', 'EventTypeName', '', true);
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
    $("#btnSaveText").html("Save");
    $("#rdoInactive").prop('checked', true);
    $("#txtEventCode").val('');
    $("#chkAll").prop('checked', false);
    $("[name='chkCountry']").prop('checked', false);
    $("#txtEventDate").val('');
    $("#txtEventTime").val('');
    $("#txtEventName").val('');
    $(".timefrom").attr("value", '00:00');
    $(".timeto").attr("value", '00:00');
    $("#EventType").val($("#EventType option:first").val());
    $("#CourseCode").val($("#CourseCode").val());
    $("#txtTitle").val('');
    $("#txtAgenda").val('');
    $("#txtSpeaker").val('');
    $("#ddlLanguage").val($("#ddlLanguage option:first").val());
    $("#rdoCNo").prop('checked', true);
    $("#txtCost").val('');
    $("#rdoPhysical").prop('checked', true);
    $("#Venue").val('');
    $("#txtAddress").val('');
    $("#txtEventLink").val('');
    $("#hcalendaruploadvalue").val('');
    $("#hflyeruploadvalue").val('');
    $('#calendarupload').val('');
    $('#flyerupload').val('');


    $("#CalendarName").val('');
    $("#FlyerName").val('');

    $("#btnCalendar").hide();
    $("#CalendarName").hide();
    $("#btnCalendarRemove").hide();
    $("#btnFlyer").hide();
    $("#FlyerName").hide();
    $("#btnFlyerRemove").hide();

    ControlDisable();
}

function ResetEventTimeControl() {
    $('.dateandtime').remove();
    $('#txtEventTimeFrom').addClass('dateandtime timefrom form-control form-control-sm');
    $('#txtEventTimeTo').addClass('dateandtime timeto form-control form-control-sm');
    $('.dateandtime').dateAndTime();
}