﻿function VideosLoad() {
    BindVideos();// show table
    BindProductCategoryCheckBox();

    uploadfileConfig('divThumbnail', 2);

    $("#VideoModal").iziModal({
        title: 'Add Video',
        TransitionIn: 'FadeInRight',
        theme: 'light',
        headerColor: '#008fa2',
        padding: 10,
        //top: 30,
        overlayClose: false,
        width: '50%',
        zindex: 1050
    }); // popup setting

    $('#btnUploadThumbnail').on('click', function () {
        $('#thumbnailImageupload').val('');
        $('#thumbnailImageupload').click();
    });


    $('#thumbnailImageupload').on('change', function () {
        $("#btnThumbnail").show();
        $("#thumbnailImageName").show();
        $("#thumbnailImageName").html($("#thumbnailImageupload")[0].files[0].name);
        $("#btnThumbnailRemove").show();
    });


    $('#txtUploadDate').datepicker({
        uiLibrary: 'bootstrap4',
        format: 'dd mmm yyyy'
    });

    $("#btnVideoClose").on('click', function () {
        VideoClose();
    })

    $("#btnVideoSave").on('click', function () {
        VideoSave();
    })

    $("#btnThumbnailRemove").on('click', function () {
        $("#hthumbnailremovevalue").val($("#hthumbnailuploadvalue").val());
        $("#hthumbnailuploadvalue").val('');
        $("#thumbnailImageupload").val('');
        $("#thumbnailImageName").hide();
        $("#thumbnailImageName").html('');
        $("#btnThumbnail").hide();
        $("#btnThumbnailRemove").hide(); 
    });

    $("#btnSearchVideos").on('click', function () {
        BindVideos();
    });

    $("#btnSearchVideosClear").on('click', function () {
        SearchVideosClear();
    });

    $("#chkAll").change(function () {
        $("[name='chkProductCategory']").prop('checked', this.checked);
    });
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

function SearchVideosClear() {
    $("#STitle").val('');
    BindVideos();
}

function VideoClose() {
    $("#VideoModal").iziModal('close');
}

function BindVideos() {
    $('#tblVideos tbody').empty();

    var obj = {
        Title: $("#STitle").val()
    };
    CalltoApiController($("#HGetVideos").val(), obj, 'VideosResponse');
}

function AddVideo() {
    $("#HMode").val('New');
    $("#btnSaveText").html("Save");
    ClearVideo();
    $(".iziModal-header-title").html('Add Video');
    $("#VideoModal").iziModal('open');
}


function EditVideo(row) {
    ClearVideo();
    $("#HMode").val('Edit');

    var currentRow = $(row).closest("tr");
    var data = $('#tblVideos').DataTable().row(currentRow).data();
    $("#txtVideoCode").val(data["VideoCode"]);
    $("#Importance").val(data["Importance"]);
    $('input[name="rdoStatus"][value="' + data["ActiveStatus"] + '"]').prop('checked', true);
    $("#txtUploadDate").val(data["UploadDate"]);
    $("#uploadmonth").val(data["UploadMonth"]);
    $("#uploadyear").val(data["UploadYear"]);
    $("#txtTitle").val(data["Title"]);
    $("#txtVideoLink").val(data["VideoUrl"]);
    $("#txtDescription").val(data["Description"]);   
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

    if (data["ThumbnailImage"]) {
        setuploadvalue('divThumbnail', data["ThumbnailImage"]);
        setuploadFileName('divThumbnail', data["ThumbnailImageName"])
    }

    $("#btnSaveText").html("Update");
    $(".iziModal-header-title").html('Edit Video');
    $("#VideoModal").iziModal('open');
}


function ClearVideo(){
    $("#btnThumbnail").hide();
    $("#thumbnailImageName").hide();
    $("#btnThumbnailRemove").hide();

    let date = new Date();
    const month = date.toLocaleString('default', { month: '2-digit' });

    $("#txtUploadBy").val($("#layoutloginName").html());
    $("#uploadmonth").val(month);
    $("#uploadyear").val(date.getFullYear());
    $("[name='chkProductCategory']").prop('checked', false);
    $("#Importance").val($("#Importance option:first").val());
    $("#rdoInactive").prop('checked', true);
    $("#txtVideoCode").val('');
    $("#txtTitle").val('');
    $("#txtVideoLink").val('');
    $("#txtDescription").val('');
    $("#txtDownloadCount").val('');

    uploadfileClear('divThumbnail');
}

function VideosResponse(response) {
    $('#tblVideos').DataTable({
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
                text: '<i class="ion-plus-round"></i> Add Video',
                action: function (e, dt, node, config) {
                    AddVideo();
                },
                titleAttr: 'Add Video'
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
            { "data": "VideoCode", width: "5%", className: "align-center" },
            { "data": "ActiveStatus", width: "5%", className: "align-center" },
            { "data": "Title", width: "23%"},
            { "data": "VideoUrl", width: "25%"},
            { "data": "ThumbnailImage", width: "8%", className: "align-center" },
            { "data": "UploadDate", width: "9%", className: "align-center"  },
            { "data": "Description", width: "25%"},
        ],
        "columnDefs": [
            {
                "targets": 0,
                "data": "EventCode",
                "render": function (data) {
                    return '<button type="button" title="Edit Video" style="width:70px" class="gridbtnedit" onclick="EditVideo(this);"><i class="icon-note"></i> Edit</button>';
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
                "targets": 3,
                "data": "VideoUrl",
                "render": function (data) {
                    if (data != null) {
                        return '<a style="font-size:12px" href="' + data + '" target="_blank">' + data + '</a>';
                    }
                    else {
                        return '';
                    }
                },
            },
            {
                "targets": 4,
                "data": "ThumbnailImage",
                "render": function (data) {
                    if (data != null) {
                        return '<button type="button" title="Thumbnail" class="gridbtnphoto" onclick="showPreview(\'' + data +'\');""><i class="icon-picture"></i></button>';
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

function VideoSave() {
    if (VideoErrorcheck()) {
        $('#divloader').show();

        var obj = {
            ActiveStatus: $('input[name="rdoStatus"]:checked').val(),
            ProductCategoryJson: getProductCategoryList(),
            VideoCode: $("#txtVideoCode").val(),
            Importance: $('#Importance').children("option:selected").val(),
            UploadDate: $('#uploadmonth').children("option:selected").val() + '-01-' + $('#uploadyear').children("option:selected").val(),
            Title: $("#txtTitle").val(),
            ThumbnailRemove: getUploadRemovedValue('divThumbnail'),
            ThumbnailImage: getUploadValue('divThumbnail'),
            ThumbnailImageName: getuploadFileName('divThumbnail'),
            VidoeUrl: $("#txtVideoLink").val(),
            Description: $("#txtDescription").val(),
            UpdatedBy: $("#hID").val(),
            Mode: $("#HMode").val(),
        };

        var formdata = new FormData();
        var thumbnailimage = $('#thumbnailImageupload')[0];

        formdata.append('thumbnail', getuploadFile('divThumbnail'));

        formdata.append('VideoModel', JSON.stringify(obj));

        $.ajax({
            url: $("#HVideoCUD").val(),
            type: "POST",
            cache: false,
            contentType: false,
            processData: false,
            data: formdata,
            success: function (response) {
                data = JSON.parse(response);
                MessageResponse(response, data[0].MessageID)

                if (data[0].MessageID.charAt(0) != 'E') {
                    $("#VideoModal").iziModal('close');
                }

                BindVideos();
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

function VideoErrorcheck() {
    if (!$("#txtTitle").val()) {
        ShowMessage("E001", "Title");
        $("#txtTitle").focus();
        return false;
    }

    return true;
}