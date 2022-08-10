function VideosLoad() {
    BindVideos();// show table

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
    $('input[name="rdoStatus"][value="' + data["ActiveStatus"] + '"]').prop('checked', true);
    $("#txtUploadDate").val(data["UploadDate"]);
    $("#txtTitle").val(data["Title"]);
    $("#txtVideoLink").val(data["VideoUrl"]);
    $("#txtDescription").val(data["Description"]);   
    $("#thumbnailImageName").html(data["ThumbnailImageName"]);

    $("#hthumbnailuploadvalue").val(data["ThumbnailImage"]);

    if (!$("#hthumbnailuploadvalue").val()) {
        $("#btnThumbnail").hide();
        $("#thumbnailImageName").hide();
        $("#btnThumbnailRemove").hide();
    } else {
        $("#btnThumbnail").show();
        $("#thumbnailImageName").show();
        $("#btnThumbnailRemove").show();
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
    const day = date.toLocaleString('default', { day: '2-digit' });
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.toLocaleString('default', { year: 'numeric' });
    $("#txtUploadDate").val(day + ' ' + month + ' ' + year);

    $("#rdoInactive").prop('checked', true);
    $("#txtVideoCode").val('');
    $("#txtTitle").val('');
    $("#txtVideoLink").val('');
    $("#txtDescription").val('');

    $("#hthumbnailremovevalue").val('');
    $("#hthumbnailuploadvalue").val('');
    $("#thumbnailImageupload").val('');
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
            { "data": "Title", width: "28%"},
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
                "targets": 2,
                "data": "VideoUrl",
                "render": function (data) {
                    if (data != null) {
                        return '<a href="' + data + '" target="_blank">' + data + '</a>';
                    }
                    else {
                        return '';
                    }
                },
            },
            {
                "targets": 3,
                "data": "ThumbnailImage",
                "render": function (data) {
                    if (data != null) {
                        return '<button type="button" title="Thumbnail" class="gridbtnphoto" onclick="ThumbnailImage(this);"><i class="icon-picture"></i></button>';
                    }
                    else {
                        return '';
                    }
                    
                },
            },
        ],
    });
}

function ThumbnailImage(row) {
    var currentRow = $(row).closest("tr");
    var data = $('#tblVideos').DataTable().row(currentRow).data();
    var url = $("#HImageLocation").val() + data["ThumbnailImage"];
    window.open(
        url,
        '_blank' // <- This is what makes it open in a new window.
    );
}

function VideoSave() {
    if (VideoErrorcheck()) {
        $('#divloader').show();

        var obj = {
            ActiveStatus: $('input[name="rdoStatus"]:checked').val(),
            VideoCode: $("#txtVideoCode").val(),
            UploadDate: $("#txtUploadDate").val(),
            Title: $("#txtTitle").val(),
            ThumbnailImageRemove: $("#hthumbnailremovevalue").val(),
            ThumbnailImage: $("#hthumbnailuploadvalue").val(),
            ThumbnailImageName: $("#thumbnailImageName").html(),
            VidoeUrl: $("#txtVideoLink").val(),
            Description: $("#txtDescription").val(),
            UpdatedBy: $("#hID").val(),
            Mode: $("#HMode").val(),
        };

        var formdata = new FormData();
        var thumbnailimage = $('#thumbnailImageupload')[0];

        formdata.append('thumbnailimage', thumbnailimage.files[0]);

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
    if (!$("#txtUploadDate").val()) {
        ShowMessage("E001", "Date");
        $("#txtUploadDate").focus();
        return false;
    } else if (!$("#txtTitle").val()) {
        ShowMessage("E001", "Title");
        $("#txtTitle").focus();
        return false;
    }

    return true;
}