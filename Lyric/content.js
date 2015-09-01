document.body.addEventListener('lyric_request', function(ev) {
   chrome.runtime.sendMessage({
       action: "get_lyric",
       artist: ev.detail.artist,
       title: ev.detail.title
   });
});

chrome.runtime.onMessage.addListener(function(request, sender, callback) {
    var lyricBox = document.getElementById("lyricBox");

    if (request.action == "gotLyricPage") {
        lyricBox.innerHTML = ['<h2>', request.title, '</h2>', '<h3>', request.artist, '</h3>', request.lyric].join("")
    } else if (request.action == "errorOnLoad") {
        console.error(request);
    } else if (request.action == "notFound") {
        lyricBox.innerHTML = "<h1>Lyric not found</h1>";
    }
});
