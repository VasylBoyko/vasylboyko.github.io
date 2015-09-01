chrome.webRequest.onBeforeSendHeaders.addListener(function(data) {
    data.requestHeaders = data.requestHeaders.filter(function(el){return el.name !== "Referer"});
    return {requestHeaders: data.requestHeaders};
}, {
    urls: ["https://lyrics.wikia.com/*"],
    types: ["xmlhttprequest"]
},["requestHeaders","blocking"]);

chrome.runtime.onMessage.addListener(function(request, sender, callback) {
    var tabId = sender.tab.id, artist, title;
    
    function loadLyric(artist, title, callback) {
        function onError(description){
    	    chrome.tabs.sendMessage(tabId, {action: "errorOnLoad", description: description});
	    }

        function sendAjax(method, url, callback, error) {
	        var xhr = new XMLHttpRequest();
	        xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
			        if (xhr.status === 200) {
				        callback(xhr.responseText);
			        } else {
				        error && error("request error");
			        }
		        }
	        }
	        xhr.open("GET", url, true);
	        xhr.send("");	
        }     
	    
	    var url = "https://lyrics.wikia.com/api.php?action=lyrics&artist=" + encodeURIComponent(artist) + "&song=" + encodeURIComponent(title) + "&fmt=json";
	    sendAjax("GET", url, function(response) {
            var song = {};
		    response.split("\n").map(function(el){return el.match(/'(.*)':'(.*)',?$/)}).forEach(function(el){if (el) {song[el[1]] = el[2]}});
	        if (song.lyrics === 'Not found') {
		        chrome.tabs.sendMessage(tabId, {action: "notFound"});
	        } else if (song.url) {
	            artist = song.artist;
	            title = song.song;
	            chrome.tabs.sendMessage(tabId, {action: "gotLyricPage", lyric: "Loading...", artist: artist, title: title});
		        sendAjax("GET", song.url, function(response2) {
			        callback(response2);
		        }, onError);
		    } else {
		        onError(response);
		    }
	    }, onError);
    }
    
    if (request.action == "get_lyric") {
       artist = request.artist;
       title = request.title;
       loadLyric(artist, title, function(text) {
           text = text.split("atechange=null,c()}:r.onload=c;s.parentNode.insertBefore(r,s)};}})();</script>")[1].split("<p>NewPP limit report")[0];
           chrome.tabs.sendMessage(tabId, {action: "gotLyricPage", lyric: text, artist: artist, title: title});
       });
    }
});
