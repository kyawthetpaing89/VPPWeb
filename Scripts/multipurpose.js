function GetCompanyInfo() {
    $("#Text1").focus();
}

function CompanyInfoUpdate() {
    $('#divloader').show();
    var obj = {
        ID: $("#HMultipurposeID").val(),
        KeyCode: $("#HKeyCode").val(),
        Text1: $("#Text1").val(),
        UpdatedBy: $("#hID").val(),
    }

    CalltoApiController($("#HMultipurposeUpdate").val(), obj, 'CompanyInfoUpdateResponse');
}

function CompanyInfoUpdateResponse(response) {
    $('#divloader').hide();
    data = JSON.parse(response);
    MessageResponse(response,data[0].MessageID)
}
