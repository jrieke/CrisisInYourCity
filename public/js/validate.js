//Load load validate function once page loads
$(document).ready(function() {
	$('#submitBtn').click(function() {
       	validate();
    });
});

function validate() {
	//checks if it's inserted and if it's alphanumeric
	var form = $('#viewHashTag').validate({
		rules : {
			hashtag: {
				alphanumeric : true,
				required : true
			}
		}
	});
	if(form.form()) {
		$('#viewHashTag').submit();
	}
}