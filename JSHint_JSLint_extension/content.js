var port = chrome.runtime.connect({name: "knockknock"});
    
port.onMessage.addListener(function(msg) {
  // alert(3)
});

var port2 = chrome.runtime.connect({name: "knockknock3"});
    
port2.onMessage.addListener(function(msg) {
  // alert(3);
});


function setSelectedElement(el) {
 //  alert(el && el.tagName)
   // chrome.extension.sendRequest({'update': el.tagName});
    //chrome.runtime.sendMessage({update: el.tagName}, function(response) {
//      console.log(response.farewell);
   // });
//    alert(1);
    port.postMessage({joke: "Knock knock"});
  /*  chrome.runtime.sendMessage({greeting: "hello"}, function(response) {           });
        alert(2)
*/ 
}



