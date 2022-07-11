function LoadVIPPartner() {

    $('#btnStandardUpload').on('click', function () {
        $('#VipPartnerUpload').val('');
        $('#VipPartnerUpload').click();
    });

    $("#VipPartnerUpload").change(function () {
        StandardImportCheck();
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

    BindPartner();
}

function BindPartner() {
    $('#tblVIPPartner tbody').empty();

    var obj = {

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
            { "data": "PartnerStatus", width: "5%", className: "align-center" },
            { "data": "Register_No", width: "5%", className: "align-center" },
            { "data": "Company_Name", width: "5%", className: "align-center" },
            { "data": "Country", width: "5%", className: "align-center" },
            { "data": "Address", width: "7%", className: "align-center" },
            { "data": "FirstName", width: "10%" },
            { "data": "LastName", width: "20%" },
            { "data": "Email", width: "20%" },
        ],
        "columnDefs": [
            {
                "targets": 0,
                "data": "ItemCode",
                "render": function (data) {
                    var t1 = 'New';
                    var c1 = 'label-primary';
                    if (data == '2') {
                        t1 = 'Welcome Email'
                        c1 = 'label-warning';
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
                        { "data": "ZipCode", "className": "align-center", width: "10%" },
                        { "data": "Country", width: "10%" },
                        { "data": "Website", width: "10%" },
                        { "data": "Location_No", width: "10%" },
                        { "data": "Partner_Type", width: "10%" },
                        { "data": "Business_Focus", width: "10%" },
                        { "data": "EmailNoti", width: "10%" },
                        { "data": "Prefix", width: "10%" },
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