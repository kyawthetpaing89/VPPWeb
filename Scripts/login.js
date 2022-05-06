function LoginOnload() {
    $("#LoginEmail").focus();
}

$("#LoginPassword").keydown(function (e) {
    if (e.which == 13) {
        LoginClick();
    }
});

function LoginClick() {
    if (LoginErrorCheck()) {
        var obj = {
            Email: $("#LoginEmail").val(),
            Password: $("#LoginPassword").val(),
        };
        CalltoApiController($("#HGetVIPPartnerLoginCheck").val(), obj, 'LoginResponse');
    }
}

function LoginResponse(response) {
    var vippartner = JSON.parse(response);
    if (vippartner.length > 0) {
        var MessageID = vippartner[0].MessageID;
        if (MessageID == '0') {
            var userinfo = vippartner[0].RecordRef + '_' + vippartner[0].PartnerName;
            location.href = $("#HSetAuth").val() + '?StaffLoginInfo=' + userinfo;
        } else {
            ShowMessage(MessageID);
            $("#LoginEmail").focus();
        }        
    }
    else {
        ShowMessage("E002");
        return false;
    }
}

function LoginErrorCheck() {
    if (!$("#LoginEmail").val()) {
        ShowMessage('E001', 'Email');
        $("#LoginEmail").focus();

        return false;
    } else if (!$("#LoginPassword").val()) {
        ShowMessage('E001', 'Password');
        $("#LoginPassword").focus();

        return false;
    }

    return true;
}
