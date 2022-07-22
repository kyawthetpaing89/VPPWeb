function LoadVIPPartner() {

    $('#btnStandardUpload').on('click', function () {
        $('#VipPartnerUpload').val('');
        $('#VipPartnerUpload').click();
    });

    $('#btnReviseUpload').on('click', function () {
        $('#VipPartnerReviseUpload').val('');
        $('#VipPartnerReviseUpload').click();
    });

    $("#VipPartnerUpload").change(function () {
        StandardImportCheck();
    });

    $("#VipPartnerReviseUpload").change(function () {
        ReviseImportCheck();
    });

    $("#PartnerImportModal").iziModal({
        title: 'VIP Partner Import',
        TransitionIn: 'FadeInRight',
        theme: 'light',
        headerColor: '#008fa2',
        padding: 10,
        top: 20,
        overlayClose: false,
        zindex: 1100,
        width: '80%'
    });

    $("#PartnerReviseImportModal").iziModal({
        title: 'VIP Partner Import',
        TransitionIn: 'FadeInRight',
        theme: 'light',
        headerColor: '#008fa2',
        padding: 10,
        top: 20,
        overlayClose: false,
        zindex: 1100,
        width: '80%'
    });

    $('#btnWelcomeEmail').on('click', function () {
        ShowConfirmMessage('Q004','SendWelcomeEmail')
    });

    $('#btnPartnerReviseImportClose').on('click', function () {
        PartnerReviseImportClose();
    });

    $("#btnPartnerReviseImportConfirm").on('click', function () {
        PartnerReviseImportConfirm();
    });

    $("#btnSearch").on('click', function () {
        BindPartner();
    });

    BindPartner();
    BindCountry();
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

function ReviseImportCheck() {
    $('#divloader').show();

    var formdata = new FormData();
    var fileRW = $('#VipPartnerReviseUpload')[0];
    formdata.append('VipPartnerReviseUpload', fileRW.files[0]);
    $.ajax({
        url: $("#HCheckReviseImport").val(),
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
                $("#PartnerReviseImportModal").iziModal('open');

                var saveEnable = true;

                $('#tblPartnerRevisePopUp').DataTable({
                    scrollY: '290px',
                    scrollX: true,
                    scrollCollapse: true,
                    fixedColumns: {
                        left: 4,
                    },
                    fixedHeader: true,
                    autoWidth: false,
                    data: jsonResult,
                    datasrc: "",
                    destroy: true,
                    searching: false,
                    "bPaginate": false,
                    "ordering": false,
                    "columns": [
                        { "data": "SEQ", "className": "align-center", width: "5%" },
                        { "data": "Status", "className": "align-center", width: "5%" },
                        { "data": "ErrorMessage", width: "10%" },
                        { "data": "Register_No", width: "10%" },
                        { "data": "Company_Name", width: "10%" },
                        { "data": "FirstName", width: "10%" },
                        { "data": "LastName", width: "10%" },
                        { "data": "Phone", width: "10%" },
                        { "data": "Email", width: "10%" },
                        { "data": "DateOfEvent", width: "10%" },
                        { "data": "DSSEventCode", width: "10%" },
                        { "data": "EventName", width: "10%" },
                        { "data": "CountryName", width: "10%" },
                        { "data": "RewardPoints", width: "10%" },
                    ],
                    "rowCallback": function (row, data, index) {
                        if (data.Status == "Error") {
                            saveEnable = false;
                            $('td', row).css('color', 'Red');
                        }
                    }
                });

                if (saveEnable == false) {
                    $("#divconfirmrevise").hide();
                }
                else {
                    $("#divconfirmrevise").show();
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

function BindPartner() {
    $('#tblVIPPartner tbody').empty();

    var obj = {
        Company_Name: $("#StxtCompanyName").val(),
        CountryID: $("#SCountry").children("option:selected").val(),
        Email: $("#StxtEmail").val(),
        Name: $("#StxtName").val(),
        PartnerStatus: $("#SPartnerStatus").children("option:selected").val(),
    };
    CalltoApiController($("#HGetVIPPartner").val(), obj, 'GetVIPPartnerResponse');
}

function GetVIPPartnerResponse(response) {
    $('#tblVIPPartner').DataTable({
        //responsive: true,
        scrollY: '1000px',
        scrollX: true,
        scrollCollapse: true,
        fixedColumns: {
            left: 2,
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
            { "data": "PartnerStatus", width: "10%", className: "align-center" },
            { "data": "Register_No", width: "10%", className: "align-center" },
            { "data": "Company_Name", width: "10%"},
            { "data": "Country", width: "10%"},
            { "data": "Address", width: "10%" },
            { "data": "FirstName", width: "10%" },
            { "data": "LastName", width: "10%" },
            { "data": "Email", width: "10%" },
            { "data": "City", width: "10%"},
            { "data": "ZipCode", width: "10%"},
            { "data": "Location_No", width: "10%"},
            { "data": "Partner_Type", width: "10%"},
            { "data": "Business_Focus", width: "10%" },
            { "data": "EmailNoti", width: "10%", className: "align-center" },
            { "data": "Prefix", width: "10%", className: "align-center" },
            { "data": "Phone", width: "10%" },
            { "data": "Job_Title", width: "10%" },
            { "data": "Website", width: "10%" },
        ],
        "columnDefs": [
            {
                "targets": 0,
                "data": "PartnerStatus",
                "render": function (data) {
                    var t1 = 'New';
                    var c1 = 'label-primary';
                    if (data == '2') {
                        t1 = 'Wel'
                        c1 = 'label-success';
                    } else if (data == '3') {
                        t1 = 'Re1'
                        c1 = 'label-inverse';
                    } else if (data == '4') {
                        t1 = 'Re2'
                        c1 = 'label-warning';
                    } else if (data == '5') {
                        t1 = 'RPM'
                        c1 = 'label-danger';
                    } else if (data == '0') {
                        return '';
                    }
                    return '<span class="pcoded-badge label '+ c1 +'">'+ t1 +'</span>';
                },
            },           
        ],
    });
}

function StandardImportCheck() {
    $('#divloader').show();

    var formdata = new FormData();
    var fileRW = $('#VipPartnerUpload')[0];
    formdata.append('VipPartnerUpload', fileRW.files[0]);
    $.ajax({
        url: $("#HCheckStandardImport").val(),
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
                $("#PartnerImportModal").iziModal('open');

                var saveEnable = true;

                $('#tblPartnerPopUp').DataTable({
                    scrollY: '290px',
                    scrollX: true,
                    scrollCollapse: true,
                    fixedColumns: {
                        left: 4,
                    },
                    fixedHeader: true,
                    autoWidth: false,
                    data: jsonResult,
                    datasrc: "",
                    destroy: true,
                    searching: false,
                    "bPaginate": false,
                    "ordering": false,
                    "columns": [
                        { "data": "SEQ", "className": "align-center", width: "5%" },
                        { "data": "Status", "className": "align-center", width: "5%" },
                        { "data": "ErrorMessage", width: "10%" },
                        { "data": "Register_No", width: "10%" },
                        { "data": "Company_Name", width: "10%" },
                        { "data": "Address", width: "10%" },
                        { "data": "City", width: "10%" },
                        { "data": "ZipCode", width: "10%" },
                        { "data": "Country", width: "10%" },
                        { "data": "Website", width: "10%" },
                        { "data": "Location_No", width: "10%" },
                        { "data": "Partner_Type", width: "10%" },
                        { "data": "Business_Focus", width: "10%" },
                        { "data": "EmailNoti", "className": "align-center", width: "10%" },
                        { "data": "Prefix", "className": "align-center", width: "10%" },
                        { "data": "FirstName", width: "10%" },
                        { "data": "LastName", width: "10%" },
                        { "data": "Phone", width: "10%" },
                        { "data": "Email", width: "10%" },
                        { "data": "Job_Title", width: "10%" },
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

function PartnerImportClose() {
    $("#PartnerImportModal").iziModal('close');
    $("#VipPartnerUpload").val('');
}

function PartnerImportConfirm() {
    $('#divloader').show();

    var obj = {
        UpdatedBy: $("#hID").val(),
    }

    var formdata = new FormData();
    var fileRW = $('#VipPartnerUpload')[0];
    formdata.append('VipPartnerUpload', fileRW.files[0]);
    formdata.append('PartnerModel', JSON.stringify(obj));

    $.ajax({
        url: $("#HPartnerStandardImportConfirm").val(),
        type: "POST",
        cache: false,
        contentType: false,
        processData: false,
        data: formdata,
        success: function (data) {
            var jsonResult = JSON.parse(data);
            var messageID = jsonResult[0].MessageID;

            MessageResponse(data, messageID);
            $("#PartnerImportModal").iziModal('close');

            BindPartner();
        },
        fail: function (response) {
            data = JSON.parse(response);
            MessageResponse(response, data[0].MessageID)
        },
        complete: function (data) {
            $('#divloader').hide();
            $("#VipPartnerUpload").val('');
        }
    });
}

function PartnerReviseImportClose() {
    $("#PartnerReviseImportModal").iziModal('close');
    $("#VipPartnerReviseUpload").val('');
}

function PartnerReviseImportConfirm() {
    $('#divloader').show();

    var obj = {
        UpdatedBy: $("#hID").val(),
    }

    var formdata = new FormData();
    var fileRW = $('#VipPartnerReviseUpload')[0];
    formdata.append('VipPartnerReviseUpload', fileRW.files[0]);
    formdata.append('PartnerModel', JSON.stringify(obj));

    $.ajax({
        url: $("#HPartnerReviseImportConfirm").val(),
        type: "POST",
        cache: false,
        contentType: false,
        processData: false,
        data: formdata,
        success: function (data) {
            var jsonResult = JSON.parse(data);
            var messageID = jsonResult[0].MessageID;

            MessageResponse(data, messageID);
            $("#PartnerReviseImportModal").iziModal('close');

            BindPartner();
        },
        fail: function (response) {
            data = JSON.parse(response);
            MessageResponse(response, data[0].MessageID)
        },
        complete: function (data) {
            $('#divloader').hide();
            $("#VipPartnerReviseUpload").val('');
        }
    });
}

//function SendWelcomeEmail() {
//    $('#divloader').show();
//    var obj = {
//        SendBy: $("#hID").val(),
//        PartnerStatus: '1'
//    }

//    var formdata = new FormData();
//    formdata.append('PartnerModel', JSON.stringify(obj));

//    $.ajax({
//        url: $("#HSendWelcomeMail").val(),
//        type: "POST",
//        cache: false,
//        contentType: false,
//        processData: false,
//        data: formdata,
//        success: function (data) {
//            var jsonResult = JSON.parse(data);
//            var messageID = jsonResult[0].MessageID;

//            MessageResponse(data, messageID);
//            $("#PartnerImportModal").iziModal('close');

//            BindPartner();
//        },
//        fail: function (response) {
//            data = JSON.parse(response);
//            MessageResponse(response, data[0].MessageID)
//        },
//        complete: function (data) {
//            $('#divloader').hide();
//            $("#VipPartnerUpload").val('');
//        }
//    });
//}

function PartnerloginLogLoad() {
    BindPartnerLoginLog();

    $("#PartnerLoginHistoryModal").iziModal({
        title: 'Reward Prize Import',
        TransitionIn: 'FadeInRight',
        theme: 'light',
        headerColor: '#008fa2',
        padding: 10,
        top: 70,
        overlayClose: false,
        zindex: 1100,
    });
}

function BindPartnerLoginLog() {
    $('#tblPartnerLoginLog tbody').empty();

    var obj = {

    };
    CalltoApiController($("#HGetPartnerLoginLog").val(), obj, 'PartnerLoginLogResponse');
}

function PartnerLoginLogResponse(response) {
    $('#tblPartnerLoginLog').DataTable({

        data: JSON.parse(response),
        datasrc: "",
        destroy: true,
        "bInfo": false,
        filter: true,
        "searching": true,
        "bPaginate": true,
        "bLengthChange": false,
        "pageLength": 50,
        "ordering": false,
        "columns": [
            { "data": "Email", width: "10%" },
            { "data": "Email", width: "20%" },
            { "data": "CountryName", width: "20%" },
            { "data": "FirstName", width: "20%" },
            { "data": "LastName", width: "20%" },     
            { "data": "LoginFrequent", width: "10%" },
        ],
        "columnDefs": [
            {
                "targets": 0,
                "data": "Email",
                "render": function (data) {                  
                    return '<button type = "button" style="width:70px;" class="btn btn-grd-info gridbtn" onclick= "LoginDetail(this);" > <i class="icon-note"></i>Detail</button >';
                },
            },
        ],
    });
}

function LoginDetail(row) {
    var currentRow = $(row).closest("tr");
    var data = $('#tblPartnerLoginLog').DataTable().row(currentRow).data();

    $("#PartnerLoginHistoryModal").iziModal('open');

    var obj = {
        Email: data["Email"],
    }

    CalltoApiController($("#HGetPartnerLoginLogDetail").val(), obj, 'PartnerLoginLogDetailResponse');
}

function PartnerLoginLogDetailResponse(response) {
    $('#tblPartnerLoginLogDetail').DataTable({

        data: JSON.parse(response),
        datasrc: "",
        destroy: true,
        searching: false,
        "bInfo": false,
        "bPaginate": false,
        "bLengthChange": false,
        "ordering": false,
        "columns": [
            { "data": "Email", width: "50%", className: "align-center" },
            { "data": "LoginDate", width: "50%", className: "align-center" },
        ],
    });
}

function PartnerLoginHistoryClose() {
    $("#PartnerLoginHistoryModal").iziModal('close');
}