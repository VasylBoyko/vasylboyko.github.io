var selectionInfo_url = ""

function getLintOptions () {
  var res = {},
	allowed_option = {
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
		if (allowed_option[option] === true){
			res[option] = (localStorage[option] == "true");
		} else {
			res[option] = localStorage[option] || "";
		}
	})

	res.closure = false;
	return res;
}
function getHintOptions(){
	return {bitwise:true, curly:true, eqeqeq:true, forin:true, noarg:true, noempty:true, nonew:true, undef:true, unused:true, strict:true, expr:true, browser:true}
}
////////////////////////////////////////

var devtools = chrome.devtools || chrome.experimental.devtools,
	jsHintSideBar = null
	jsLintSideBar = null;

chrome.devtools.panels.sources.createSidebarPane("JSLint", function(sidebar) {
	jsLintSideBar = sidebar;
	
});
chrome.devtools.panels.sources.createSidebarPane("JSHint", function(sidebar) {jsHintSideBar = sidebar;});

function updateSidebar(sourceCode, sidebar, validator, options) {
	var isValid,
		report = [];
    if (sourceCode){
        isValid = validator(sourceCode, options);
        if (!isValid) {
            validator.errors.forEach(function(error) {
                if (error){
                    report.push(tools.padLeft(error.line+"", 5, " ") + ":" + tools.padLeft(error.character+"", 5, " ") + ":" + error.reason);
                } else {
                    report.push("...");
                }
            });
        }
    }
    if (sidebar) {
        sidebar.setObject(report);
    }
	return (validator && validator.errors) || [];
}

function error(message) {
  devtools.inspectedWindow.eval("console.error(unescape('" + escape(message) + "'));");
}

var prevMessage = "";
function onContentCommitted(resource, content) {
	if (resource.type === "script") {
        var res = updateSidebar(content, jsHintSideBar, JSHINT, getHintOptions()).concat(
                  updateSidebar(content, jsLintSideBar, JSLINT, getLintOptions()));
        var message = res.length ? tools.format("You have {0} errors. First one is: {1} in {2} line. Please fix this bug. ", res.length, res[0].reason, res[0].line) : "You have no errors";
        if (prevMessage != message) {
            chrome.extension.sendRequest({'speak': message});
            prevMessage = message;
        }
        
    } else {
        updateSidebar(null, jsHintSideBar);
        updateSidebar(null, jsLintSideBar);
    }
     updateToolsWnd(resource);    
}

function dump(obj){
	alert(Object.keys(obj))
}

chrome.devtools.inspectedWindow.onResourceContentCommitted.addListener(onContentCommitted);

chrome.devtools.panels.sources.createSidebarPane("Tools", function(sidebar) {
    toolsPanel = sidebar;
    sidebar.setPage("toolsBar.html");
//    sidebar.setHeight("8ex");
    sidebar.onShown.addListener(function(window) {
        toolsPanelWin = window;
    });
});
function updateToolsWnd(resource) {
  //  toolsPanelWin.updateContent(resource.url);
    var fileName = resource.url;
    if (/^file:\/\//.test(fileName)) {
        
        var fileNameSpan =  toolsPanelWin.document.getElementById("fileName"),
           type = "";
           
        fileNameSpan.innerHTML = fileName;
        currentFile = fileName;
        var beautify = toolsPanelWin.document.getElementById("beautify");
        if (/\.html$/.test(currentFile)) {
            type = "--type html";
        }
        if (/\.css$/.test(currentFile)) {
            type = "--type css";
        }               
        beautify.href = "extern://" + encodeURI("js-beautify -rj " + type + " " + currentFile.replace("file://", ""));
     }
};    


