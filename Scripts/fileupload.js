function uploadfileConfig(div, type) {
	var filetype = 'application/pdf,image/*';
	if (type == 2) {
		filetype = 'image/*';
    }
	var uploaddiv =
		'<div class="input-group"> 																' +
		'	<span id="upload1"  class="input-group-addon addonUpload uploadbackground">          ' +
		'		<i class="ion-ios-cloud-upload"></i>&nbsp;upload                                ' +
		'	</span>                                                                             ' +
		'	<input id="txtfuName1" type="text" readonly class="form-control form-control-sm">			' +
		'	<span id="spanicon1" class="input-group-addon addonImage uploadbackground">           ' +
		'		<i id="icon1" class="icofont icofont-image"></i>                             ' +
		'	</span>                                                                             ' +
		'	<span id="spandelete1" class="input-group-addon addonTrashbin uploadbackground">    ' +
		'		<i class="icofont icofont-ui-delete"></i>                                       ' +
		'	</span>                                                                             ' +
		'</div>' +
		'	<input type="hidden" id="fuvalue1" />                                               ' +
		'	<input type="hidden" id="furemovevalue1" />                                         ' +
		'	<input id="fu1" accept="'+ filetype +'" class="hidden" type="file">        ';

	$('#' + div).append(uploaddiv);

	$(document).on('click', '#' + div + ' #upload1', function () {
		$('#' + div + ' #fu1').val('');
		$('#' + div + ' #fu1').click();
    })

	$(document).on('change', '#' + div + ' #fu1', function () {
		$('#' + div + ' #txtfuName1').val($('#' + div + ' #fu1')[0].files[0].name);

		//change image icon ( pdf or image)
		var extension = $('#' + div + ' #fu1')[0].files[0].name.substr(($('#' + div + ' #fu1')[0].files[0].name.lastIndexOf('.') + 1));
		if (extension == 'pdf') {
			$('#' + div + ' #icon1').removeClass('icofont-image');
			$('#' + div + ' #icon1').addClass('icofont-file-pdf');
			$('#' + div + ' #spanicon1').removeClass('addonImage');
			$('#' + div + ' #spanicon1').addClass('addonPdf');

		} else {
			$('#' + div + ' #icon1').removeClass('icofont-file-pdf');
			$('#' + div + ' #icon1').addClass('icofont-image');
			$('#' + div + ' #spanicon1').removeClass('addonPdf');
			$('#' + div + ' #spanicon1').addClass('addonImage');
		}

		$('#' + div + ' #fuvalue1').val($('#' + div + ' #fu1')[0].files[0].name);
	})

	$(document).on('click', '#' + div + ' #spanicon1', function () {
		if ($('#' + div + ' #fu1').val()) {
			openTab(URL.createObjectURL($('#' + div + ' #fu1')[0].files[0]));
		} else if ($('#' + div + ' #fuvalue1').val()) {
			openTab($("#HImageLocation").val() + $('#' + div + ' #fuvalue1').val());
        }
	})

	$(document).on('click', '#' + div + ' #spandelete1', function () {
		if ($('#' + div + ' #fuvalue1').val()) {
			$('#' + div + ' #furemovevalue1').val($('#' + div + ' #fuvalue1').val());
			$('#' + div + ' #fu1').val('');
			$('#' + div + ' #fuvalue1').val('');
			$('#' + div + ' #txtfuName1').val('');
		} 
	})
}

function uploadfileClear(div) {
	$('#' + div + ' #fu1').val('');
	$('#' + div + ' #txtfuName1').val('');
	$('#' + div + ' #fuvalue1').val('');
	$('#' + div + ' #furemovevalue1').val('');
}

function getUploadRemovedValue(div) {
	return $('#' + div + ' #furemovevalue1').val();
}

function setUploadRemovevalue(div) {
	$('#' + div + ' #furemovevalue1').val($('#' + div + ' #fuvalue1').val());
}

function setuploadvalue(div,value){
	$('#' + div + ' #fuvalue1').val(value);
}

function getUploadValue(div) {
	return $('#' + div + ' #fuvalue1').val();
}

function getuploadFile(div) {
	if ($('#' + div + ' #fu1').val()) {
		return $('#' + div + ' #fu1')[0].files[0];
    }		
	else
		return '';
}

function getuploadFileName(div) {
	if ($('#' + div + ' #fu1').val()) {
		return $('#' + div + ' #fu1')[0].files[0].name;
	} else if ($('#' + div + ' #fuvalue1').val()) {
		return $('#' + div + ' #txtfuName1').val();
    }
	else
		return '';
}

function setuploadFileName(div, value) {

	var extension = value.substr((value.lastIndexOf('.') + 1));
	if (extension == 'pdf') {
		$('#' + div + ' #icon1').removeClass('icofont-image');
		$('#' + div + ' #icon1').addClass('icofont-file-pdf');
		$('#' + div + ' #spanicon1').removeClass('addonImage');
		$('#' + div + ' #spanicon1').addClass('addonPdf');

	} else {
		$('#' + div + ' #icon1').removeClass('icofont-file-pdf');
		$('#' + div + ' #icon1').addClass('icofont-image');
		$('#' + div + ' #spanicon1').removeClass('addonPdf');
		$('#' + div + ' #spanicon1').addClass('addonImage');
	}

	$('#' + div + ' #txtfuName1').val(value);
}