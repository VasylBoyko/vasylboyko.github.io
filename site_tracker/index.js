"use strict";

var sys = require("system"),
    page = require("webpage").create(),
    logResources = false,
	user = encodeURIComponent(process.env.GL_USER),
	pass = encodeURIComponent(process.env.GL_PASS),
    url = 'https://' + user + ':' + pass + '@portal-ua.globallogic.com/officetime/#graph/LWO/701/month/0';

function printArgs() {
    var i, ilen;
    for (i = 0, ilen = arguments.length; i < ilen; ++i) {
        console.log("    arguments[" + i + "] = " + JSON.stringify(arguments[i]));
    }
    console.log("");
}

////////////////////////////////////////////////////////////////////////////////
page.viewportSize = { width: 600, height: 1000 };
//the clipRect is the portion of the page you are taking a screenshot of
page.clipRect = { top: 0, left: 0, width: 750, height: 1000 };
page.zoomFactor = 0.75;
page.open(url)
page.onInitialized = function() {
    console.log("page.onInitialized");
    printArgs.apply(this, arguments);
};
page.onLoadStarted = function() {
    console.log("page.onLoadStarted");
    printArgs.apply(this, arguments);
};
page.onLoadFinished = function(status) {
    console.log("page.onLoadFinished");
    printArgs.apply(this, arguments);
	if(status === "success") {
		setTimeout(function () {
			page.scrollPosition = {left: 0,	top: 0}
			console.log("img rendering");
			page.render('/home/vb/Pictures/desklet/example.png');
			console.log("img rendered");
		}, 1000)
	}
};

setInterval(function () {
	page.open(url)
}, 60000)
