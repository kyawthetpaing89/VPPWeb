function enquirylistingload() {
    BindEnquiry();

    $('#SDateFrom').datepicker({
        uiLibrary: 'bootstrap4',
        format: 'dd mmm yyyy'
    });

    $('#SDateTo').datepicker({
        uiLibrary: 'bootstrap4',
        format: 'dd mmm yyyy'
    });
}

function ClearEnquirySearch() {
    $("#SEmail").val('');
    $("#SFullName").val('');
    $("#SDateFrom").val('');
    $("#SDateTo").val('');
    $("#SStatus").val('');
}

function BindEnquiry() {
    $('#tblEnquiry tbody').empty();

    var obj = {
        Email: $("#SEmail").val(),
        FullName: $("#SFullName").val(),
        DateFrom: $("#SDateFrom").val(),
        DateTo: $("#SDateTo").val(),
        EnquiryStatus: $("#SStatus").children("option:selected").val(),
        //CountryList: v1,
    };
    CalltoApiController($("#HGetEnquiry").val(), obj, 'EnquiryListResponse');
}

function EnquiryListResponse(response) {
    $('#tblEnquiry').DataTable({
        scrollY: '700px',
        fixedHeader: true,
        data: JSON.parse(response),
        datasrc: "",
        destroy: true,
        searching: false,
        "bInfo": false,
        "bPaginate": false,
        "ordering": false,
        "columns": [
            { "data": "Email", width: "10%"},
            { "data": "FullName", width: "25%" },
            { "data": "Enquiry", width: "40%" },
            { "data": "EnquiryDate", width: "15%", className: "align-center" },
            { "data": "Status", width: "10%", className: "align-center"},
        ]
    });
}