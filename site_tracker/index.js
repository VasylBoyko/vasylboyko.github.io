"use strict";

var sys = require("system"),
    page = require("webpage").create(),
    logResources = false,
	user = encodeURIComponent(sys.env.GL_USER),
	pass = encodeURIComponent(sys.env.GL_PASS),
    url = 'https://' + user + ':' + pass + '@portal-ua.globallogic.com/officetime/#graph/LWO/701/month/0';

page.viewportSize = { width: 600, height: 1000 };
page.clipRect = { top: 0, left: 0, width: 750, height: 1000 };
page.zoomFactor = 0.75;
page.onLoadFinished = function(status) {
	if(status === "success") {
		setTimeout(function () {
			page.scrollPosition = {left: 0,	top: 0}
			page.render('/home/vb/Pictures/desklet/example.png');
//			console.info("Updated " + (new Date()).toLocaleString());
		}, 1000);
	} else {
		console.error("page.onLoadFinished: faild to load page. Status: " + status);
	}
};

console.info("Started " + (new Date()).toLocaleString());

page.open(url)
setInterval(function () {
	page.open(url)
}, 60000)
