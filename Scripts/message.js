function ShowMessage(msgid, ReplaceText) {
    var Mmodel = {
        MessageID: msgid,
    };
    CalltoApiController($("#HGetMessage").val(), Mmodel, 'MessageResponse', msgid, ReplaceText)
}

function MessageResponse(data, msgid, ReplaceText) {
    var msgdata = JSON.parse(data);

    var c1 = msgid.charAt(0);
    var icon = ''
    if (c1 == 'I') {
        icon = 'info';
    }
    else if (c1 == 'E') {
        icon = 'error';
    }
    else if (c1 == '') {
        icon = 'success';
    }

    const Toast = Swal.mixin({
        toast: true,
        position: 'center',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })

    Toast.fire({
        icon: icon,
        title: msgdata[0].MessageID,
        text: msgdata[0].MessageText.replace("{0}", ReplaceText)
    })
}

function ShowConfirmMessage(msgid, functionname, param1) {
    var Mmodel = {
        MessageID: msgid,
    };

    CalltoApiController('../api/MessageApi/GetMessage', Mmodel, 'ConfrimMessageResponse', functionname, param1)
}

function ConfrimMessageResponse(data, functionname, param1,param2,param3) {
    var msgdata = JSON.parse(data);

    var mtext = msgdata[0].MessageText.replace('{0}', param1);
    mtext = mtext.replace('{1}', param2);

    Swal.fire({
        title: msgdata[0].MessageID,
        text: mtext,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
    }).then((result) => {
        if (result.value) {
            var fn = window[functionname];
            fn(param1);
        }
    })
}
