function gotoErrorPage() {
    location.href = $("#HErrorPageUrl").val();
}

function BindDropdown(model, url, ctrlID, key, value, defaultvalue) {
    CalltoApiController(url, model, 'DropdownResponse', ctrlID, key, value, defaultvalue);
}

function DropdownResponse(response, ctrlID, key, value, defaultvalue) {
    var items = JSON.parse(response);
    $.each(items, function (i, item) {
        $("#" + ctrlID).append(
            $('<option></option>').val(item[key]).html(item[value]));
    });

    if (defaultValue != '') {
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

function removeImage(ctrl) {
    $('#' + ctrl)
        .attr('src', $("#noimage").val());
}