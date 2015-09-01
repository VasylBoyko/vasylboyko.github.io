function dump(obj){
	alert("bg.js: " +  Object.keys(obj))
	
}

//loadTimes,csi,Event,app,browserAction,devtools,
//extension,i18n,management,notifications,permissions,runtime,tabs,test,tts,ttsEngine,types,windows

function speak(text){
	chrome.tts.speak(text);
}

function initBackground() {
  chrome.extension.onRequest.addListener(
      function(request, sender, sendResponse) {
		  
        if (request['init']) {
          sendResponse({'key': localStorage['speakKey']});
        } else if (request['speak']) {
          speak(request['speak']);
        }
      });
}

initBackground();
