function save_options() {
	[].forEach.call(document.querySelectorAll('input'), function(input){
		localStorage[input.id] = input.type=="checkbox" ? input.checked : input.value;
	});
	window.close();
}

function restore_options() {
  var allowed_option = {
        folder: "",
		port: ""
    };
	document.getElementById('save').addEventListener('click', save_options);
	[].forEach.call(Object.keys(allowed_option), function(option){
		var el = document.getElementById(option);
		if (el){
			if (allowed_option[option] === true){
				el.checked = (localStorage[option] == "true");
			} else {
				el.value = localStorage[option] || "";
			}
		}
	});
}
document.addEventListener('DOMContentLoaded', restore_options);	
