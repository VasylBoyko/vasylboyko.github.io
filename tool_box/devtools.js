var panelWindow;

chrome.devtools.panels.create("Custom commands", "icon_48.png", "logins.html", function(panel) {
	panel.onSearch.addListener(function(action, query){
	    
		var msg = 'onSearch callback action:' + action + ', query:' + query;
		console.log(msg);
		alert(msg);
		if(panelWindow) {
			panelWindow.body.innerHTML = msg;
		}
	});
	
	panel.onShown.addListener(function(window) {
		panelWindow = window;
		console.log('onShown callback');
	});
	
	panel.onHidden.addListener(function(window) {
		console.log('onHidden callback');
	});
/*	var btn = panel.createStatusBarButton("test_btn.png", "test_btn", false);
	btn.onClicked.addListener(function() {
    //	Button.update(string iconPath, string tooltipText, boolean disabled)
	    btn.update(null, null, true)
	});
*/
});

chrome.devtools.panels.sources.createSidebarPane("Search", function(sidebar) {
    sidebar.setPage("searchPanel/search.html");
    sidebar.setHeight("100px");
    sidebar.onShown.addListener(function (sidebarWindow) {
        sidebarWindow.sidebar = sidebar;
    })
});

chrome.devtools.panels.elements.createSidebarPane("Search", function(sidebar) {
    sidebar.setPage("searchPanel/search.html");
    sidebar.setHeight("100px");
    sidebar.onShown.addListener(function (sidebarWindow) {
        sidebarWindow.sidebar = sidebar;
    })
});

