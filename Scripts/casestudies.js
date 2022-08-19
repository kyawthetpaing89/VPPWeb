function CaseStudiesLoad() {

    uploadfileConfig('divResource', 1);
    uploadfileConfig('divThumbnail', 2);

    BindIndustryCategory();
    BindCaseStudies();// show table
    BindProductCategoryCheckBox();

    $("#CaseStudiesModal").iziModal({
        title: 'Add CaseStudies',
        TransitionIn: 'FadeInRight',
        theme: 'light',
        headerColor: '#008fa2',
        padding: 10,
        overlayClose: false,
        width: '50%',
        zindex: 1050
    }); // popup setting

    $("#btnCaseStudiesClose").on('click', function () {
        CaseStudiesClose();
    })

    $("#btnCaseStudiesSave").on('click', function () {
        CaseStudiesSave();
    })

    $("#btnSearchCaseStudies").on('click', function () {
        BindCaseStudies();
    });

    $("#btnSearchCaseStudiesClear").on('click', function () {
        SearchCaseStudiesClear();
    });

    $("#chkAll").change(function () {
        $("[name='chkProductCategory']").prop('checked', this.checked);
    });
}

function BindIndustryCategory() {
    var obj = {
        ActiveStatus: '1'
    };
    CalltoApiController($("#HGetIndustryCategory").val(), obj, 'IndustryCategoryResponse');
}

function BindProductCategoryCheckBox() {
    var obj = {
        ActiveStatus: '1'
    };
    CalltoApiController($("#HGetMarketingProductCategory").val(), obj, 'ProductCategoryCheckBoxResponse');
}

function ProductCategoryCheckBoxResponse(response) {
    var data = JSON.parse(response);

    data.forEach(function (j) {
        var chkdiv = '<div class="checkbox-fade fade-in-primary col-sm-4" style="padding:0;margin-right:0">' +
            '<label>' +
            '<input id="chk' + j.ProductCategoryCode + '" type="checkbox" data-name="' + j.ProductCategory + '" name="chkProductCategory" value="' + j.ProductCategoryCode + '" class="input-danger">' +
            '<span class="cr">' +
            '<i class="cr-icon icofont icofont-ui-check txt-primary"></i>' +
            '</span>' +
            '<span>' + j.ProductCategory + '</span>' +
            '</label>' +
            '</div>';

        $("#divProductCategoryList").append(chkdiv);
    });
}


function IndustryCategoryResponse(response) {
    DropdownResponse(response, 'IndustryCategory', 'CategoryCode', 'CategoryName','', false);
    DropdownResponse(response, 'SIndustryCategory', 'CategoryCode', 'CategoryName','', true);
}

function SearchCaseStudiesClear() {
    $("#STitle").val('');
    $("#SStatus").val('');
    $("#SIndustryCategory").val('');
    BindCaseStudies();
}

function CaseStudiesClose() {
    $("#CaseStudiesModal").iziModal('close');
}

function BindCaseStudies() {
    $('#tblCaseStudies tbody').empty();

    var obj = {
        Title: $("#STitle").val(),
        ActiveStatus: $('#SStatus').children("option:selected").val(),
        CategoryCode: $('#SCategory').children("option:selected").val()
    };
    CalltoApiController($("#HGetCaseStudies").val(), obj, 'CaseStudiesResponse');
}

function AddCaseStudies() {
    $("#HMode").val('New');
    $("#btnSaveText").html("Save");
    ClearCaseStudies();
    $(".iziModal-header-title").html('Add CaseStudies');
    $("#CaseStudiesModal").iziModal('open');
}

function EditCaseStudies(row) {
    ClearCaseStudies();
    $("#HMode").val('Edit');

    var currentRow = $(row).closest("tr");
    var data = $('#tblCaseStudies').DataTable().row(currentRow).data();
    $("#txtCaseStudiesCode").val(data["CaseStudiesCode"]);
    $('input[name="rdoStatus"][value="' + data["ActiveStatus"] + '"]').prop('checked', true);
    $("#Cateogry").val(data["CategoryCode"]);
    $("#Importance").val(data["Importance"]);
    $("#txtTitle").val(data["Title"]);
    $("#txtDescription").val(data["FullDescription"]);
    $("#uploadmonth").val(data["UploadMonth"]);
    $("#uploadyear").val(data["UploadYear"]);
    $("#txtDownloadCount").val(data["DownloadCount"]);

    $("input[type=checkbox][name='chkProductCategory']").each(function () {
        if (data["ProductCategoryList"] != null) {
            if (data["ProductCategoryList"].search($(this).data("name")) > -1) {
                $(this).prop("checked", true);
            } else {
                $(this).prop("checked", false);
            }
        }
    });

    if (data["ResourceFile"]) {
        setuploadvalue('divResource', data["ResourceFile"]);
        setuploadFileName('divResource', data["ResourceFileName"])
    }

    if (data["ThumbnailImage"]) {
        setuploadvalue('divThumbnail', data["ThumbnailImage"]);
        setuploadFileName('divThumbnail', data["ThumbnailImageName"])
    }

    $("#btnSaveText").html("Update");
    $(".iziModal-header-title").html('Edit CaseStudies');
    $("#CaseStudiesModal").iziModal('open');
}

function ClearCaseStudies() {

    let date = new Date();
    const month = date.toLocaleString('default', { month: '2-digit' });
    $("#txtUploadBy").val($("#layoutloginName").html());
    $("#uploadmonth").val(month);
    $("#uploadyear").val(date.getFullYear());
    $("[name='chkProductCategory']").prop('checked', false);
    $("#Importance").val($("#Importance option:first").val());
    $("#IndustryCategory").val($("#IndustryCategory option:first").val());
    $("#rdoInactive").prop('checked', true);
    $("#txtCaseStudiesCode").val('');
    $("#txtTitle").val('');
    $("#txtDescription").val('');
    $("#txtDownloadCount").val('');

    uploadfileClear('divResource');
    uploadfileClear('divThumbnail');
}

function CaseStudiesResponse(response) {
    $('#tblCaseStudies').DataTable({
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
                text: '<i class="ion-plus-round"></i> Add CaseStudies',
                action: function (e, dt, node, config) {
                    AddCaseStudies();
                },
                titleAttr: 'Add CaseStudies'
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
            { "data": "CaseStudiesCode", width: "5%", className: "align-center" },
            { "data": "ActiveStatus", width: "5%", className: "align-center" },
            { "data": "Title", width: "22%" },
            { "data": "FullDescription", width: "31%" },
            { "data": "CategoryName", width: "8%" },
            { "data": "UploadMMMYYYY", width: "13%", className: "align-center" },
            { "data": "DownloadCount", width: "8%", className: "align-right" },
            { "data": "ResourceFile", width: "8%", className: "align-center" },
            { "data": "ThumbnailImage", width: "8%", className: "align-center" },
        ],
        "columnDefs": [
            {
                "targets": 0,
                "data": "EventCode",
                "render": function (data) {
                    return '<button type="button" title="Edit CaseStudies" style="width:70px" class="gridbtnedit" onclick="EditCaseStudies(this);"><i class="icon-note"></i> Edit</button>';
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
                "targets": 7,
                "data": "ResourceFile",
                "render": function (data) {
                    if (data != null) {
                        var extension = data.substr((data.lastIndexOf('.') + 1));
                        if (extension == 'pdf') {
                            return '<button type="button" title="Links" class="gridbtnpdf" onclick="showPreview(\'' + data + '\');"><i class="icofont icofont-file-pdf"></i></button>';
                        } else {
                            return '<button type="button" title="Links" class="gridbtnphoto" onclick="showPreview(\'' + data + '\');"><i class="icon-picture"></i></button>';
                        }
                    }
                    else {
                        return '';
                    }

                },
            },
            {
                "targets": 8,
                "data": "ThumbnailImage",
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

function getProductCategoryList() {
    productCategoryList = [];
    $("input[type=checkbox][name='chkProductCategory']").each(function () {
        productCategoryList.push({ "ProductCategoryCode": $(this).val(), "Value": $(this).is(":checked") });
    });

    return JSON.stringify(productCategoryList);
}

function CaseStudiesSave() {
    if (CaseStudiesErrorcheck()) {
        $('#divloader').show();
        var obj = {
            ActiveStatus: $('input[name="rdoStatus"]:checked').val(),
            CaseStudiesCode: $("#txtCaseStudiesCode").val(),
            IndustryCategoryCode: $('#IndustryCategory').children("option:selected").val(),
            ProductCategoryJson: getProductCategoryList(),
            Importance: $('#Importance').children("option:selected").val(),
            ResourceRemove: getUploadRemovedValue('divResource'),
            ResourceFile: getUploadValue('divResource'),
            ResourceFileName: getuploadFileName('divResource'),
            ThumbnailRemove: getUploadRemovedValue('divThumbnail'),
            ThumbnailImage: getUploadValue('divThumbnail'),
            ThumbnailImageName: getuploadFileName('divThumbnail'),
            Title: $("#txtTitle").val(),
            Description: $("#txtDescription").val(),
            UploadDate: $('#uploadmonth').children("option:selected").val() + '-01-' + $('#uploadyear').children("option:selected").val(),
            UpdatedBy: $("#hID").val(),
            Mode: $("#HMode").val(),
        };

        var formdata = new FormData();
        formdata.append('resource', getuploadFile('divResource'));
        formdata.append('thumbnail', getuploadFile('divThumbnail'));

        formdata.append('CaseStudiesModel', JSON.stringify(obj));

        $.ajax({
            url: $("#HCaseStudiesCUD").val(),
            type: "POST",
            cache: false,
            contentType: false,
            processData: false,
            data: formdata,
            success: function (response) {
                data = JSON.parse(response);
                MessageResponse(response, data[0].MessageID)

                if (data[0].MessageID.charAt(0) != 'E') {
                    $("#CaseStudiesModal").iziModal('close');
                }

                BindCaseStudies();
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

function CaseStudiesErrorcheck() {
    if (!$("#txtTitle").val()) {
        ShowMessage("E001", "Title");
        $("#txtTitle").focus();
        return false;
    }

    return true;
}