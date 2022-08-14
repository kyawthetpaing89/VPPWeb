//open new tab safari
function openTab(url) {
    // Create link in memory
    var a = window.document.createElement("a");
    a.target = '_blank';
    a.href = url;

    // Dispatch fake click
    var e = window.document.createEvent("MouseEvents");
    e.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    a.dispatchEvent(e);
};

function gotoErrorPage() {
    location.href = $("#HErrorPageUrl").val();
}

function BindDropdown(model, url, ctrlID, key, value, defaultvalue,addblankrow) {
    CalltoApiController(url, model, 'DropdownResponse', ctrlID, key, value, defaultvalue,addblankrow);
}

function DropdownResponse(response, ctrlID, key, value, defaultvalue,addblankrow) {
    var items = JSON.parse(response);
    if (addblankrow == true) {
        $("#" + ctrlID).append(
            $('<option></option>').val('').html('All'));
    }

    $.each(items, function (i, item) {
        $("#" + ctrlID).append(
            $('<option></option>').val(item[key]).html(item[value]));
    });

    if (defaultvalue != '') {
        $("#" + ctrlID).val(defaultvalue);
    }
}

function readURL(input, ctrl) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#' + ctrl)
                .attr('src', e.target.result);
        };

        reader.readAsDataURL(input.files[0]);
    }
}

function changeBackground(input,ctrl) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#' + ctrl).css("background-image", "url(" + e.target.result +")");
        };

        reader.readAsDataURL(input.files[0]);
    }
}

function removeImage(ctrl) {
    $('#' + ctrl)
        .attr('src', $("#noimage").val());
}