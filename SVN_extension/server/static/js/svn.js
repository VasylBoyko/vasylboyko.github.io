function loadXMLDoc(dname)
{
	xhttp=new XMLHttpRequest();
	xhttp.open("GET",dname,false);
	xhttp.send("");
	return xhttp.responseXML;
}

function loadTextDoc(dname)
{
	xhttp=new XMLHttpRequest();
	xhttp.open("GET",dname,false);
	xhttp.send("");
	return xhttp.responseText;
}

function loadData(){
	xml=loadXMLDoc("status_xml/");
	xsl=loadXMLDoc("xslt/status.xslt");

	xsltProcessor=new XSLTProcessor();
	xsltProcessor.importStylesheet(xsl);
	resultDocument = xsltProcessor.transformToFragment(xml,document);

	target = tools.getElement("changed_files");
	target.innerHTML = "";
	target.appendChild(resultDocument);
}

function loadLog(fileName){
	xml=loadXMLDoc("logs_xml?filename=" + encodeURIComponent(fileName));
	xsl=loadXMLDoc("xslt/log.xslt");

	xsltProcessor=new XSLTProcessor();
	xsltProcessor.importStylesheet(xsl);
	resultDocument = xsltProcessor.transformToFragment(xml,document);

	target = tools.getElement("file_log");
	target.innerHTML = "";
	target.appendChild(resultDocument);
}

escapeHTML = function (str) {
  return str.replace(/>/g,'&gt;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
};

function loadDiff(fileName){
	text = escapeHTML(loadTextDoc("diff?filename=" + encodeURIComponent(fileName)));
	tools.getElement("file_diff").innerHTML = text.split("\n").map(function(el) {
		if (!el.indexOf("+")){
			return '<div class="added">' + el + '</div>';
		} else  if (!el.indexOf("-")){
			return '<div class="removed">' +el + '</div>';
		} else  if (!el.indexOf("@@")){
			return '<div class="description">' +el + '</div>';
		}
        return el + "\n";
	}).join("");
	
}


var currentRow;
function onFileListClicked(event){
	var row = tools.getParent(event.target, function(el){return el.tagName == "TR"}, document.body);
	var file_name = row && row.getAttribute("data-file");
	if (file_name) {
		loadDiff(file_name);
		loadLog(file_name);
		if (currentRow){
			tools.removeClass(currentRow, "selected");
		}
		currentRow = row;
		tools.addClass(currentRow, "selected");
	}
}

function onUpdateClicked(){
	tools.append("svn_console", "<pre>" + loadTextDoc("update") + "</pre>");
	tools.getElement("scroll_here").scrollIntoViewIfNeeded();
}


/*
var hrefData = decodeURI(location.href.replace(/.*\?/,"")).split("&"),
	params={};

hrefData.forEach(function(el){
	var elData = el.split("=");
	params[elData[0]]= elData.length>1 ? elData[1] : "";
});
*/

/*alert(params.url);*/

/*

https://developers.google.com/chrome-developer-tools/docs/debugging-clients#sublime_text
http://developer.chrome.com/extensions/devtools.html#injecting

/*

if (location.protocol === 'chrome-devtools:') (function() {
    'use strict';
    // Whatever you want to do with the devtools.
})();
*/

function bindUI () {
	$('#file_props a').click(function (e) {
	  e.preventDefault()
	  $(this).tab('show')
	})
}


window.onload = function(){
	bindUI()
	loadData();
}
