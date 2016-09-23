
p = function (file, onHasData, onComplete) {
   const BYTES_PER_CHUNK = 1024 * 1024;
   var progress = 0;
   var file_url = "";
   
   
    function downloadChunk(file, callback) {
      if (file.downloadUrl) {
	    var accessToken = gapi.auth.getToken().access_token;
	    var xhr = new XMLHttpRequest();
	    var range = [progress, progress = Math.min(file.fileSize, progress + bufferLength)];
	    xhr.open('GET', file.downloadUrl);
	    xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
	    xhr.setRequestHeader('Range', 'bytes=' + range.join("-"));
	    xhr.responseType = 'blob'; 
		xhr.onload = function(e) {
            writeFile(e.response)
        };
      }
    
    
    function writeFile( blob ) {
        var filewriter = null;
        
        function writeData() {
            fileWriter.write(blob);
        }
        function onInitFs(fs) {
          fs.root.getFile('song.mp3', {create: true}, function(fileEntry) {
            file_url = fileEntry.toURL();
            fileEntry.createWriter(function(fw) {
              filewriter = fw;
              fileWriter.onwriteend = function(e) {
                console.log('Write completed.');
              };
        
              fileWriter.onerror = function(e) {
                console.log('Write failed: ' + e.toString());
              };
              writeData(blob);
            }, errorHandler);
        
          }, errorHandler);
        }
        
        if (! filewriter) {
            writeData(blob);
        } else {
            window.requestFileSystem(window.TEMPORARY, 1024 * 1024, onInitFs, errorHandler);
        }
    }
    
    downloadChunk(file)
    
}

webAudioPlayer = (function(){
	// создаем аудио контекст
	var context = new window.AudioContext(); //
	// переменные для буфера, источника и получателя
	var buffer, source, destination; 
	
	// функция для подгрузки файла в буфер
	var loadSoundFile = function(url) {
	  // делаем XMLHttpRequest (AJAX) на сервер
	  var xhr = new XMLHttpRequest();
	  xhr.open('GET', url, true);
	  xhr.responseType = 'arraybuffer'; 
	  xhr.onload = function(e) {
	    // декодируем бинарный ответ
	    context.decodeAudioData(this.response,
	    function(decodedArrayBuffer) {
	      // получаем декодированный буфер
	      buffer = decodedArrayBuffer;
	    }, function(e) {
	      console.log('Error decoding file', e);
	    });
	  };
	  xhr.send();
	}
	
	// функция начала воспроизведения
	var play = function(){
	  // создаем источник
	  source = context.createBufferSource();
	  // подключаем буфер к источнику
	  source.buffer = buffer;
	  // дефолтный получатель звука
	  destination = context.destination;
	  // подключаем источник к получателю
	  source.connect(destination);
	  // воспроизводим
	  source.start(0);
	}
	
	// функция остановки воспроизведения
	var stop = function() {
	  source.stop(0);
	}
	
	function load(fileId) {
	  var request = gapi.client.drive.files.get({
	    'fileId': fileId
	  });
	  request.execute(function(resp) {
	    console.log('Title: ' + resp.title);
	    console.log('Description: ' + resp.description);
	    console.log('MIME type: ' + resp.mimeType);
	    
	    //playFile(resp.downloadUrl);
	    
	    	downloadFile(resp, function(blob, append){
	     	context.decodeAudioData(blob,
		    function(decodedArrayBuffer) {
		      // получаем декодированный буфер
		      buffer = decodedArrayBuffer;
		    }, function(e) {
		      console.log('Error decoding file', e);
		    });
	     	
	     })
	  });
	}
	
	/**
	 * Download a file's content.
	 *
	 * @param {File} file Drive File instance.
	 * @param {Function} callback Function to call when the request is complete.
	 */
	 
	function playFile(url) {
		pl = new AudioTagSample();
		pl.play(url);
	}
	
	var mp3content,
		bufferLength = 1024 * 1024 * 0.5,
		progress = 0;
	
	function downloadFile(file, callback) {
	  if (file.downloadUrl) {
	    var accessToken = gapi.auth.getToken().access_token;
	    var xhr = new XMLHttpRequest();
	    var range = [progress, progress = Math.min(file.fileSize, progress + bufferLength)];
	    xhr.open('GET', file.downloadUrl);
	    xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
	    xhr.setRequestHeader('Range', 'bytes=' + range.join("-"));
	    xhr.responseType = 'arraybuffer'; 
	    xhr.onprogress = function(a,b,c){
	    	console.log(a)
	    	console.log(b)
	    	console.log(c)
	    	
	    }
	    /*xhr.onreadystatechange = function() {
		    if(this.status==200) {
		    	console.log(this.readyState);
		    }
		}*/
		xhr.onreadystatechange = function() { 
		  if(xhr.readyState == 4 ) {
		     
		     if  (progress < file.filesize) {
		     	progress = Math.max(progress + bufferLength, filesize);
		     	
		     }
		  }
		};
		
		/*
	    xhr.onload = function() {
	      callback(xhr.response);
	    };
	    */
	    
	    
	    xhr.onload = function() {
		/*	var byteCharacters = xhr.response;
			var byteNumbers = new Array(byteCharacters.length);
			for (var i = 0; i < byteCharacters.length; i++) {
				byteNumbers[i] = byteCharacters.charCodeAt(i);
			}
var byteArray = new Uint8Array(byteNumbers);*/
			str = xhr.response
    		function string2ArrayBuffer(string) {
        	    var bb = new BlobBuilder();
        	    bb.append(string);
        	    var f = new FileReader();
        	    f.onload = function(e) {
        	        callback(e.target.result);
        	    }
        	    f.readAsArrayBuffer(bb.getBlob());
        	}
			
			string2ArrayBuffer(str)
			
	     // callback(buf);
	    };
	    
	    xhr.onerror = function() {
	      callback(null);
	    };
	    xhr.send();
	  } else {
	    callback(null);
	  }
	}
	
	
//	loadSoundFile('example.mp3');
	return {
		load: load,
		play: play,
		stop: stop
	}
})();

function AudioTagSample() {
  this.audio = new Audio();
}

AudioTagSample.prototype.onload = function() {
  // Create the audio nodes.
  this.source = context.createMediaElementSource(this.audio);
  this.filter = context.createBiquadFilter();
  this.filter.type = this.filter.LOWPASS;
  this.filter.frequency.value = 500;

  // Connect the audio graph.
  this.source.connect(this.filter);
  this.filter.connect(context.destination);
};

AudioTagSample.prototype.play = function(url) {
  this.audio.src = url;
  this.audio.play();
};


test = function(){
            //if (localStorage.playlist){
        //player.addItems(JSON.parse(localStorage.playlist));
        //player.play();
  //  }


    var btn = document.createElement("button");
    btn.onclick = function(){
        var cb = function(d, f){
            console.log(d);
        }
        ID3.loadTags(unescape(play_list.firstChild.getAttribute("data-url"))+'&e=download&gd=true', cb)

        //tools.sendAjax(unescape(document.querySelector("[data-url]").getAttribute("data-url")), "get", "", function(resp){alert(resp)});
    };
   /// document.body.appendChild(btn);
    webAudioPlayer.load(unescape(document.querySelector("[data-url]").dataset.id));
}

