/*
https://chromium.googlesource.com/chromium/blink/+/6ae9ef3358b207bed4c7b7b1e5dae3b8cd1293ab/LayoutTests/inspector/extensions/extensions-events.html

http://code.google.com/p/chromium/issues/detail?id=295888
https://codereview.chromium.org/23904024/diff/21001/Source/devtools/front_end/SourceFrame.js

*/

var selectionInfo_url = "",
	should_be_reloaded = false,
	svn_sidebar = null;

chrome.devtools.panels.create("SVN",
                              "icon_48.png",
                              "page.html",
                              function(panel) {
	//panel: onShown,onHidden,onSearch,createStatusBarButton,show
	panel.onHidden.addListener(function(panel_window) {
		should_be_reloaded = true;
	});

	panel.onShown.addListener(function(panel_window){
		if (should_be_reloaded){
			should_be_reloaded = false;
			panel_window.location.href = panel_window.location.href;
		}
	});
});
