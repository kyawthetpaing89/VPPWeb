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

        CalltoApiController($("#HGetUserLoginCheck").val(), obj, 'LoginResponse');
    }
}

function LoginResponse(response) {
    var user = JSON.parse(response);
    if (user.length > 0) {
        var MessageID = user[0].MessageID;
        if (MessageID == '0') {
            var userinfo = user[0].RecordRef + '_' + user[0].FirstName + '_' + user[0].LastName + '_' + user[0].VIPUserRole  + '_'  + user[0].ListOfCountries;
            location.href = $("#HSetAuth").val() + '?UserLoginInfo=' + userinfo + '&ReturnUrl=' + $("#RURL").val();
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
