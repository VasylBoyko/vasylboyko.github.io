function save_options() {
	[].forEach.call(document.querySelectorAll('input'), function(input){
		localStorage[input.id] = input.type=="checkbox" ? input.checked : input.value;
	})

}

// Restores select box state to saved value from localStorage.
function restore_options() {
    

  var allowed_option = {
        ass       : true,
        bitwise   : true,
        browser   : true,
        closure   : true,
        continue  : true,
        couch     : true,
        debug     : true,
        devel     : true,
        eqeq      : true,
        evil      : true,
        forin     : true,
        indent    :   10,
        maxerr    : 1000,
        maxlen    :  256,
        newcap    : true,
        node      : true,
        nomen     : true,
        passfail  : true,
        plusplus  : true,
        properties: true,
        regexp    : true,
        rhino     : true,
        unparam   : true,
        sloppy    : true,
        stupid    : true,
        sub       : true,
        todo      : true,
        vars      : true,
        white     : true
    };

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
document.getElementById('save').addEventListener('click', save_options);
document.getElementById("tabs").addEventListener("click", function(ev){
    var _removeActive = function(el){el.classList.remove('active')},
        _setActive = function(el){el.classList.add('active')};
    [].forEach.call(this.children, _removeActive);
    [].forEach.call(document.getElementById("tabs_content").children, _removeActive);
    [ev.target, document.getElementById(ev.target.getAttribute("data-content"))].forEach(_setActive);
});
