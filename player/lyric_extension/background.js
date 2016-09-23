chrome.webRequest.onBeforeSendHeaders.addListener(function(data) {
    data.requestHeaders = data.requestHeaders.filter(function(el){return el.name !== "Referer"});
    return {requestHeaders: data.requestHeaders};
}, {
    urls: ["https://lyrics.wikia.com/*"],
    types: ["xmlhttprequest"]
},["requestHeaders","blocking"]);

function sendAjax(method, url, callback, error) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
			if (xhr.status === 200) {
				callback(xhr.responseText)
			} else {
				error && error(xhr);
			}
		}
	}
	xhr.open("GET", url, true);
	xhr.send("");	
}

function loadLyric(artist, title, callback) {
	var onError = function(){}
	sendAjax("GET", "https://lyrics.wikia.com/api.php?artist=" + artist + "&song=" + title + "&fmt=json", function(response) {
		var arr = response.match(/'url':'(.*)'\s\}/);
		if (arr) {
			sendAjax("GET", arr[1], function(response2) {
				callback(response2);
			}, onError);			
		} else {
			onError();
		}
	}, onError);
}

chrome.runtime.onMessage.addListener(function(request, sender, callback) {
    var tabId = sender.tab.id; 
    if (request.action == "get_lyric") {
       loadLyric(request.artist, request.title, function(text) {
           chrome.tabs.sendMessage(tabId, {action: "gotLyricPage", frameHTML: text});
       });
    }
});
