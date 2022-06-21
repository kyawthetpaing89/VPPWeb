
//Banner Country
function BannerPhotoLoad() {
    getBannerCountry();

    $('#divBanner1').on('click', function () {
        $('#banner1upload').click();
    });

    $('#divBanner2').on('click', function () {
        $('#banner2upload').click();
    });

    $('#divBanner3').on('click', function () {
        $('#banner3upload').click();
    });

    $('#divBanner4').on('click', function () {
        $('#banner4upload').click();
    });

    $('#divBanner5').on('click', function () {
        $('#banner5upload').click();
    });

    $('#divBanner6').on('click', function () {
        $('#banner6upload').click();
    });

    $('#divFooter1').on('click', function () {
        $('#footer1upload').click();
    });
}

function getBannerCountry() {
    if ($("#hVIPUserRole").val() == '1') {
        obj = {};
    } else {
        obj = {
            CountryList: $("#hCountryList").val(),
        }
    }
    CalltoApiController($("#HGetCountry").val(), obj, 'GetBannerCountryResponse');
}

function GetBannerCountryResponse(response) {
    DropdownResponse(response, 'ddlCountry', 'CountryID', 'CountryName', '', false);
    CountryChange();
}

function CountryChange() {
    $('#divloader').show();

    var obj = {
        CountryID: $("#ddlCountry").val(),
    }
    CalltoApiController($("#HGetBannerPhoto").val(), obj, 'BannerPhotoListingResponse');
}

function BannerPhotoListingResponse(response) {
    var data = JSON.parse(response);
    if (data.length > 0) {

        $("#BannerUrl1").val(data[0].BannerUrl1);
        $("#BannerUrl2").val(data[0].BannerUrl2);
        $("#BannerUrl3").val(data[0].BannerUrl3);
        $("#BannerUrl4").val(data[0].BannerUrl4);
        $("#BannerUrl5").val(data[0].BannerUrl5);
        $("#BannerUrl6").val(data[0].BannerUrl6);

        if (data[0].BannerPhoto1) {
            $("#HBannerphoto1").val(data[0].BannerPhoto1);
            $('#divBanner1').css("background-image", "url(" + $("#HImageLocation").val() + data[0].BannerPhoto1 + ")");
        } else {
            $("#HBannerphoto1").val('');
            $('#divBanner1').css("background-image", "url(" + $("#HImageLocation").val() + "noimage.jpg)");
        }

        if (data[0].BannerPhoto2) {
            $("#HBannerphoto2").val(data[0].BannerPhoto2);
            $('#divBanner2').css("background-image", "url(" + $("#HImageLocation").val() + data[0].BannerPhoto2 + ")");
        } else {
            $("#HBannerphoto2").val('');
            $('#divBanner2').css("background-image", "url(" + $("#HImageLocation").val() + "noimage.jpg)");
        }


        if (data[0].BannerPhoto3) {
            $("#HBannerphoto3").val(data[0].BannerPhoto3);
            $('#divBanner3').css("background-image", "url(" + $("#HImageLocation").val() + data[0].BannerPhoto3 + ")");
        } else {
            $("#HBannerphoto3").val('');
            $('#divBanner3').css("background-image", "url(" + $("#HImageLocation").val() + "noimage.jpg)");
        }

        if (data[0].BannerPhoto4) {
            $("#HBannerphoto4").val(data[0].BannerPhoto4);
            $('#divBanner4').css("background-image", "url(" + $("#HImageLocation").val() + data[0].BannerPhoto4 + ")");
        } else {
            $("#HBannerphoto4").val('');
            $('#divBanner4').css("background-image", "url(" + $("#HImageLocation").val() + "noimage.jpg)");
        }


        if (data[0].BannerPhoto5) {
            $("#HBannerphoto5").val(data[0].BannerPhoto5);
            $('#divBanner5').css("background-image", "url(" + $("#HImageLocation").val() + data[0].BannerPhoto5 + ")");
        } else {
            $("#HBannerphoto5").val('');
            $('#divBanner5').css("background-image", "url(" + $("#HImageLocation").val() + "noimage.jpg)");
        }


        if (data[0].BannerPhoto6) {
            $("#HBannerphoto6").val(data[0].BannerPhoto6);
            $('#divBanner6').css("background-image", "url(" + $("#HImageLocation").val() + data[0].BannerPhoto6 + ")");
        } else {
            $("#HBannerphoto6").val('');
            $('#divBanner6').css("background-image", "url(" + $("#HImageLocation").val() + "noimage.jpg)");
        }


        if (data[0].FooterPhoto1) {
            $("#HFooterphoto1").val(data[0].FooterPhoto1);
            $('#divFooter1').css("background-image", "url(" + $("#HImageLocation").val() + data[0].FooterPhoto1 + ")");
        } else {
            $("#HFooterphoto1").val('');
            $('#divFooter1').css("background-image", "url(" + $("#HImageLocation").val() + "noimage.jpg)");
        }
    } else {
        $('#divBanner1').css("background-image", "url(" + $("#HNoImageLocation").val() + ")");
        $('#divBanner2').css("background-image", "url(" + $("#HNoImageLocation").val() + ")");
        $('#divBanner3').css("background-image", "url(" + $("#HNoImageLocation").val() + ")");
        $('#divBanner4').css("background-image", "url(" + $("#HNoImageLocation").val() + ")");
        $('#divBanner5').css("background-image", "url(" + $("#HNoImageLocation").val() + ")");
        $('#divBanner6').css("background-image", "url(" + $("#HNoImageLocation").val() + ")");
        $('#divFooter1').css("background-image", "url(" + $("#HNoImageLocation").val() + ")");

        $("#BannerUrl1").val('');
        $("#BannerUrl2").val('');
        $("#BannerUrl3").val('');
        $("#BannerUrl4").val('');
        $("#BannerUrl5").val('');
        $("#BannerUrl6").val('');
    }
    $('#divloader').hide();
}

function BannerPhotoSave() {
    $('#divloader').show();

    var obj = {
        CountryID: $('#ddlCountry').children("option:selected").val(),
        Bannerphoto1: $("#HBannerphoto1").val(),
        Bannerphoto2: $("#HBannerphoto2").val(),
        Bannerphoto3: $("#HBannerphoto3").val(),
        Bannerphoto4: $("#HBannerphoto4").val(),
        Bannerphoto5: $("#HBannerphoto5").val(),
        Bannerphoto6: $("#HBannerphoto6").val(),
        BannerUrl1: $("#BannerUrl1").val(),
        BannerUrl2: $("#BannerUrl2").val(),
        BannerUrl3: $("#BannerUrl3").val(),
        BannerUrl4: $("#BannerUrl4").val(),
        BannerUrl5: $("#BannerUrl5").val(),
        BannerUrl6: $("#BannerUrl6").val(),
        Footerphoto1: $("#HFooterphoto1").val(),
        UpdatedBy: $("#hID").val(),
    }

    var formdata = new FormData();

    var banner1 = $('#banner1upload')[0];
    var banner2 = $('#banner2upload')[0];
    var banner3 = $('#banner3upload')[0];
    var banner4 = $('#banner4upload')[0];
    var banner5 = $('#banner5upload')[0];
    var banner6 = $('#banner6upload')[0];
    var footer1 = $('#footer1upload')[0];

    formdata.append('banner1', banner1.files[0]);
    formdata.append('banner2', banner2.files[0]);
    formdata.append('banner3', banner3.files[0]);
    formdata.append('banner4', banner4.files[0]);
    formdata.append('banner5', banner5.files[0]);
    formdata.append('banner6', banner6.files[0]);
    formdata.append('footer1', footer1.files[0]);

    formdata.append('CountryModel', JSON.stringify(obj));

    $.ajax({
        url: $("#HCountryPhotoUpdate").val(),
        type: "POST",
        cache: false,
        contentType: false,
        processData: false,
        data: formdata,
        success: function (response) {
            data = JSON.parse(response);
            MessageResponse(response, data[0].MessageID)

            CountryChange();
        },
        fail: function (response) {
            data = JSON.parse(response);
            MessageResponse(response, data[0].MessageID)
        },
        complete: function (data) {
            CountryChange();
            $('#divloader').hide();
        }
    });
}

function RemoveFooter() {
    if ($("#HFooterphoto1").val()) {
        $("#HFooterphoto1").val('');
        ShowConfirmMessage('Q003', 'FooterRemoveConfirm');
    }
}

function FooterRemoveConfirm() {
    $("#HRemoveBannerPhoto").val($("#HFooterphoto1").val());

    var obj = {
        CountryID: $('#ddlCountry').children("option:selected").val(),
        Bannerphoto1: $("#HBannerphoto1").val(),
        Bannerphoto2: $("#HBannerphoto2").val(),
        Bannerphoto3: $("#HBannerphoto3").val(),
        Bannerphoto4: $("#HBannerphoto4").val(),
        Bannerphoto5: $("#HBannerphoto5").val(),
        Bannerphoto6: $("#HBannerphoto6").val(),
        BannerUrl1: $("#BannerUrl1").val(),
        BannerUrl2: $("#BannerUrl2").val(),
        BannerUrl3: $("#BannerUrl3").val(),
        BannerUrl4: $("#BannerUrl4").val(),
        BannerUrl5: $("#BannerUrl5").val(),
        BannerUrl6: $("#BannerUrl6").val(),
        Footerphoto1: $("#HFooterphoto1").val(),
        RemoveBannerPhoto: $("#HRemoveBannerPhoto").val(),
    }

    CalltoApiController($("#HCountryPhotoUpdateapi").val(), obj, 'CountryPhotoUpdateapiResponse');
}

function RemoveBanner(bannerNo) {
    if ($("#HBannerphoto" + bannerNo).val()) {
        $("#HRemoveBannerNo").val(bannerNo);
        ShowConfirmMessage('Q002', 'BannerRemoveConfirm', bannerNo, '');
    }

}

function BannerRemoveConfirm() {
    $("#HRemoveBannerPhoto").val($("#HBannerphoto" + $("#HRemoveBannerNo").val()).val());
    $("#HBannerphoto" + $("#HRemoveBannerNo").val()).val('');
    $("#BannerUrl" + $("#HRemoveBannerNo").val()).val('');

    var obj = {
        CountryID: $('#ddlCountry').children("option:selected").val(),
        Bannerphoto1: $("#HBannerphoto1").val(),
        Bannerphoto2: $("#HBannerphoto2").val(),
        Bannerphoto3: $("#HBannerphoto3").val(),
        Bannerphoto4: $("#HBannerphoto4").val(),
        Bannerphoto5: $("#HBannerphoto5").val(),
        Bannerphoto6: $("#HBannerphoto6").val(),
        BannerUrl1: $("#BannerUrl1").val(),
        BannerUrl2: $("#BannerUrl2").val(),
        BannerUrl3: $("#BannerUrl3").val(),
        BannerUrl4: $("#BannerUrl4").val(),
        BannerUrl5: $("#BannerUrl5").val(),
        BannerUrl6: $("#BannerUrl6").val(),
        Footerphoto1: $("#HFooterphoto1").val(),
        RemoveBannerPhoto: $("#HRemoveBannerPhoto").val(),
    }

    CalltoApiController($("#HCountryPhotoUpdateapi").val(), obj, 'CountryPhotoUpdateapiResponse');
}

function CountryPhotoUpdateapiResponse(response) {
    data = JSON.parse(response);
    MessageResponse(response, data[0].MessageID)
}

//Banner Country

//Footer Country
function FooterCountryLoad() {
    getFooterCountry();
}

function getFooterCountry() {
    if ($("#hVIPUserRole").val() == '1') {
        obj = {};
    } else {
        obj = {
            CountryList: $("#hCountryList").val(),
        }
    }
    CalltoApiController($("#HGetCountry").val(), obj, 'GetFooterCountryResponse');
}

function GetFooterCountryResponse(response) {
    DropdownResponse(response, 'ddlCountry', 'CountryID', 'CountryName', '', false);
    FooterCountryChange();
}

function FooterCountryChange() {
    $('#divloader').show();

    var obj = {
        CountryID: $("#ddlCountry").val(),
    }
    CalltoApiController($("#HGetCountryFooter").val(), obj, 'FooterCountryChangeResponse');
}

function FooterCountryChangeResponse(response) {
    var data = JSON.parse(response);
    if (data.length > 0) {
        $("#txtCopyright").val(data[0].CopyrightText);
        $("#txtDlinkUrl").val(data[0].DLinkUrl);
        $("#txtLinkedIn").val(data[0].LinkedInUrl);
        $("#txtFacebookUrl").val(data[0].FacebookUrl);
        $("#txtTwitterUrl").val(data[0].TwitterUrl);
        $("#txtYoutubeUrl").val(data[0].YoutubeUrl);
        $("#txtInstagramUrl").val(data[0].InstagramUrl);
        $("#txtContactUs").val(data[0].ContactUs);
        $("#txtPrivacyPolicy").val(data[0].PrivacyPolicy);
        $("#txtTermsNConditions").val(data[0].TermsAndConditions);
    } else {
        $("#txtCopyright").val('');
        $("#txtDlinkUrl").val('');
        $("#txtLinkedIn").val('');
        $("#txtFacebookUrl").val('');
        $("#txtTwitterUrl").val('');
        $("#txtYoutubeUrl").val('');
        $("#txtInstagramUrl").val('');
        $("#txtContactUs").val('');
        $("#txtPrivacyPolicy").val('');
        $("#txtTermsNConditions").val('');
    }
    $('#divloader').hide();
}

function FooterPageFooterUpdate() {
    var obj = {
        CountryID: $("#ddlCountry").val(),
        CopyrightText: $("#txtCopyright").val(),
        DLinkUrl: $("#txtDlinkUrl").val(),
        LinkedInUrl: $("#txtLinkedIn").val(),
        FacebookUrl: $("#txtFacebookUrl").val(),
        TwitterUrl: $("#txtTwitterUrl").val(),
        YoutubeUrl: $("#txtYoutubeUrl").val(),
        InstagramUrl: $("#txtInstagramUrl").val(),
        ContactUs: $("#txtContactUs").val(),
        PrivacyPolicy: $("#txtPrivacyPolicy").val(),
        TermsAndConditions: $("#txtTermsNConditions").val(),
        UpdatedBy: $("#hID").val(),
    }
    CalltoApiController($("#HCountryFooterUpdate").val(), obj, 'FooterPageFooterUpdateResponse');
}

function FooterPageFooterUpdateResponse(response) {
    data = JSON.parse(response);
    MessageResponse(response, data[0].MessageID)
}
//Footer Country