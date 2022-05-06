function CalltoApiController(url, model, f1, p1, p2, p3, p4, p5) {
    $.ajax({
        url: url.replace("%2F", "/"),
        method: 'POST',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(model),
        async: true,
        headers:
        {
            Authorization: 'Basic ' + btoa('DLINKAPI' + ':' + 'DLink12345!')
        },
        success: function (data) {
            var fn = window[f1];
            fn(data, p1, p2, p3, p4, p5);
        },
    });
}