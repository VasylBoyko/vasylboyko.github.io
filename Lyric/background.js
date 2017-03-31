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
	    var url = "https://lyrics.wikia.com/api.php?action=lyrics&artist=" + encodeURIComponent(artist) + "&song=" + encodeURIComponent(title) + "&fmt=json";
	    fetch(url).then(function (response) {
	        return response.text();
        }).then(function(response) {
            var song = {};
		    response.split("\n").map(function(el){return el.match(/'(.*)':'(.*)',?$/)}).forEach(function(el){if (el) {song[el[1]] = el[2]}});
	        if (song.lyrics === 'Not found') {
	            return {action: "notFound"};
	        } else if (song.url) {
	            artist = song.artist;
	            title = song.song;
	            url = song.url
	            chrome.tabs.sendMessage(tabId, {action: "gotLyricPage", lyric: "Loading...", artist: artist, title: title});
	            return fetch(song.url).then(function (res) {
                    return res.text();
	            }).then(function(text) {
                    var a = text.match(/<div class='lyricbox'>([\s\S]*)<p>NewPP limit report/);
                    if (a && a[1]) {
                        text = a[1];
                    };
                    return {action: "gotLyricPage", lyric: text, artist: artist, title: title};
                });
		    } else {
		        return Promise.reject(response);
		    }
        }).then(function(result) {
            chrome.tabs.sendMessage(tabId, result);
        }).catch(function (description){
    	    chrome.tabs.sendMessage(tabId, {action: "errorOnLoad", description: description});
	    });
    }
    
    if (request.action == "get_lyric") {
       loadLyric(request.artist, request.title);
    }
});

