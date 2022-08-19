function PromotionLoad() {

    uploadfileConfig('divPromotionImage', 2);

    BindPromotion();// show table
    BindCountry();

    $("#PromotionModal").iziModal({
        title: 'Add Promotion',
        TransitionIn: 'FadeInRight',
        theme: 'light',
        headerColor: '#008fa2',
        padding: 10,
        //top: 30,
        overlayClose: false,
        width: '50%',
        zindex: 1050
    }); // popup setting

    $("#btnPromotionClose").on('click', function () {
        PromotionClose();
    })

    $("#btnPromotionSave").on('click', function () {
        PromotionSave();
    })

    $("#btnSearchPromotion").on('click', function () {
        BindPromotion();
    });

    $("#btnSearchPromotionClear").on('click', function () {
        SearchPromotionClear();
    });

    $("#chkAll").change(function () {
        $("[name='chkCountry']").prop('checked', this.checked);
    });
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

function SearchPromotionClear() {
    $("#STitle").val('');
    $("#SStatus").val('');
    $("#SCountry").val('');
    BindPromotion();
}

function PromotionClose() {
    $("#PromotionModal").iziModal('close');
}

function BindPromotion() {
    $('#tblPromotion tbody').empty();

    var obj = {
        Title: $("#STitle").val(),
        ActiveStatus: $('#SStatus').children("option:selected").val(),
        Country: $('#SCountry').children("option:selected").val(),
    };
    CalltoApiController($("#HGetPromotion").val(), obj, 'PromotionResponse');
}

function AddPromotion() {
    $("#HMode").val('New');
    $("#btnSaveText").html("Save");
    ClearPromotion();
    $(".iziModal-header-title").html('Add Promotion');
    $("#PromotionModal").iziModal('open');
}

function EditPromotion(row) {
    ClearPromotion();
    $("#HMode").val('Edit');

    var currentRow = $(row).closest("tr");
    var data = $('#tblPromotion').DataTable().row(currentRow).data();
    $("#txtPromotionCode").val(data["PromotionCode"]);
    $('input[name="rdoStatus"][value="' + data["ActiveStatus"] + '"]').prop('checked', true);
    $("#txtTitle").val(data["Title"]);
    $("#txtDescription").val(data["Description"]);
    $("#uploadmonth").val(data["UploadMonth"]);
    $("#uploadyear").val(data["UploadYear"]);

    $("input[type=checkbox][name='chkCountry']").each(function () {
        if (data["CountryList"] != null) {
            if (data["CountryList"].search($(this).data("name")) > -1) {
                $(this).prop("checked", true);
            } else {
                $(this).prop("checked", false);
            }
        }
    });

    if (data["PromotionImage"]) {
        setuploadvalue('divPromotionImage', data["PromotionImage"]);
        //setUploadRemovevalue('divResource');
        setuploadFileName('divPromotionImage', data["PromotionImageName"])
    }

    $("#btnSaveText").html("Update");
    $(".iziModal-header-title").html('Edit Promotion');
    $("#PromotionModal").iziModal('open');
}

function ClearPromotion() {

    let date = new Date();
    const month = date.toLocaleString('default', { month: '2-digit' });

    $("#txtUploadBy").val($("#layoutloginName").html());
    $("#uploadmonth").val(month);
    $("#uploadyear").val(date.getFullYear());
    $("[name='chkCountry']").prop('checked', false);
    $("#rdoInactive").prop('checked', true);
    $("#txtPromotionCode").val('');
    $("#txtTitle").val('');
    $("#txtDescription").val('');

    uploadfileClear('divPromotionImage');
}

function PromotionResponse(response) {
    $('#tblPromotion').DataTable({
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
                text: '<i class="ion-plus-round"></i> Add Promotion',
                action: function (e, dt, node, config) {
                    AddPromotion();
                },
                titleAttr: 'Add Promotion'
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
            { "data": "PromotionCode", width: "5%", className: "align-center" },
            { "data": "ActiveStatus", width: "5%", className: "align-center" },
            { "data": "CountryList", width: "10%"},
            { "data": "Title", width: "22%" },
            { "data": "Description", width: "31%" },
            { "data": "UploadMMMYYYY", width: "13%", className: "align-center" },
            { "data": "PromotionImage", width: "8%", className: "align-center" },
        ],
        "columnDefs": [
            {
                "targets": 0,
                "data": "EventCode",
                "render": function (data) {
                    return '<button type="button" title="Edit Promotion" style="width:70px" class="gridbtnedit" onclick="EditPromotion(this);"><i class="icon-note"></i> Edit</button>';
                },
            },
            {
                "targets": 1,
                "data": "ActiveStatus",
                "render": function (data) {
                    if (data == '1')
                        return '<i class="activeicon icofont icofont-toggle-on"></i>';
                    else {
                        return '<i class="inactiveicon icofont icofont-toggle-off"></i>'
                    }
                },
            },
            {
                "targets": 6,
                "data": "PromotionImage",
                "render": function (data) {
                    if (data != null) {
                        return '<button type="button" title="Thumbnail" class="gridbtnphoto" onclick="showPreview(\'' + data + '\');"><i class="icon-picture"></i></button>';
                    }
                    else {
                        return '';
                    }

                },
            },
        ],
    });
}

function showPreview(data) {
    var url = $("#HImageLocation").val() + data
    openTab(url);
}

function getCountryList() {
    countryList = [];
    $("input[type=checkbox][name='chkCountry']").each(function () {
        countryList.push({ "CountryID": $(this).val(), "Value": $(this).is(":checked") });
    });

    return JSON.stringify(countryList);
}

function PromotionSave() {
    if (PromotionErrorcheck()) {
        $('#divloader').show();
        var obj = {
            ActiveStatus: $('input[name="rdoStatus"]:checked').val(),
            PromotionCode: $("#txtPromotionCode").val(),
            CountryJson: getCountryList(),
            PromotionRemove: getUploadRemovedValue('divPromotionImage'),
            PromotionImage: getUploadValue('divPromotionImage'),
            PromotionImageName: getuploadFileName('divPromotionImage'),
            Title: $("#txtTitle").val(),
            Description: $("#txtDescription").val(),
            UploadDate: $('#uploadmonth').children("option:selected").val() + '-01-' + $('#uploadyear').children("option:selected").val(),
            UpdatedBy: $("#hID").val(),
            Mode: $("#HMode").val(),
        };

        var formdata = new FormData();
        formdata.append('promotion', getuploadFile('divPromotionImage'));

        formdata.append('PromotionModel', JSON.stringify(obj));

        $.ajax({
            url: $("#HPromotionCUD").val(),
            type: "POST",
            cache: false,
            contentType: false,
            processData: false,
            data: formdata,
            success: function (response) {
                data = JSON.parse(response);
                MessageResponse(response, data[0].MessageID)

                if (data[0].MessageID.charAt(0) != 'E') {
                    $("#PromotionModal").iziModal('close');
                }

                BindPromotion();
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

function PromotionErrorcheck() {
    if (!$("#txtTitle").val()) {
        ShowMessage("E001", "Title");
        $("#txtTitle").focus();
        return false;
    }

    return true;
}