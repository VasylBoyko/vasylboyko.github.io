document.body.addEventListener('lyric_request', function(ev) {
   chrome.runtime.sendMessage({
       action: "get_lyric",
       artist: ev.detail.artist,
       title: ev.detail.title
   });
});

chrome.runtime.onMessage.addListener(function(request, sender, callback) {
    if (request.action == "gotLyricPage") {
        var lyric_wnd = document.getElementById("lyric_wnd");
        var frameHTML = request.frameHTML;
        frameHTML = frameHTML.split("atechange=null,c()}:r.onload=c;s.parentNode.insertBefore(r,s)};}})();</script>")[1];
        frameHTML = frameHTML.split("<p>NewPP limit report")[0];
        var lyricBox = document.getElementById("lyricBox");
        lyricBox.innerHTML = frameHTML;
    }
});
