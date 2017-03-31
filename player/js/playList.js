function PlayList() {
 
///window.addEventListener("DOMContentLoaded", init, false);
    
    
    var _fileList = [],
        currentSong = null,
        list = document.getElementById('play_list');

	function shuffle(array) {
      var currentIndex = array.length, temporaryValue, randomIndex;
      while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }
      return array;
    }

    function setShuffle() {
        
    }

	function getItem(listItem, callback) {
        var itemId = listItem.dataset.id,
            item =  _fileList.filter(function(el) {return el.id == itemId})[0];
        if (item) {
            if (false && item.url) {
                callback(item);
            } else if (item.source === "google_drive") {
                resolveGoogleUrl(itemId, function(url) {
                    item.url = url;
                    callback(item);
                });
            } else if (item.source === "one_drive") {
                resolveOneDriveUrl(itemId, function(url) {
                    item.url = url;
                    callback(item);
                });
            }
        }
    }
    function bind() {
        list.addEventListener("dblclick", function(ev) {getItem(ev.target, player.playFile);});
        list.addEventListener("touchend", function(ev) {getItem(ev.target, player.playFile);});
    }
    function init() {
        indexDbAPI.init(function() {
            indexDbAPI.get("default", function(playlist) {
                addItems(playlist.list_items);
            });
        });
        bind();
    }
    function addItems(fileList) {
        _fileList = _fileList.concat(fileList);
        tools.append(list, fileList.sort(function(a, b) { a = a.album + a.fileName; b = b.album + b.fileName;  return a == b ? 0 : (a > b ? 1 : -1);}).map(function(el){
            return "<div tabindex='0' data-id='" + el.id + "'>" + el.fileName + "</div>";
		}).join(""));
		localStorage.playlist = JSON.stringify(_fileList);
		$("#play_list").sortable().selectable();
    }
    /*function addItems(fileList) {
        _fileList = _fileList.concat(fileList);
        tools.append(list, fileList.sort(function(a, b) { a = a.parents[0].id + a.title; b = b.parents[0].id + b.title;  return a == b ? 0 : (a > b ? 1 : -1);}).map(function(el){
			return "<div tabindex='0' data-id='" + el.id + "' data-url='" + escape(el.downloadUrl.replace('&gd=true', '')) + "'>" + el.title + "</div>";
		}).join(""));
		localStorage.playlist = JSON.stringify(_fileList);
		$("#play_list").sortable().selectable();
    }*/
    function setCurrentSong(list_item){
		if (currentSong) {
			currentSong.className = "";
		}
        
		currentSong = document.querySelector("div[data-id='" + list_item.id + "']");
        if (currentSong) {
		    currentSong.className = "selected";
        }
	}
	
	function getNextSong (callback) {
		return getItem((currentSong && currentSong.nextElementSibling) || list.firstElementChild, callback);
	}
	function getPrevSong (callback) {
		return getItem((currentSong && currentSong.previousElementSibling) || list.lastElementChild, callback);
	}
	function getCurrentSong(callback) {
		return getItem(currentSong || (currentSong = list.firstElementChild), callback);
	}
	
	function sort() {
		var df = document.createDocumentFragment();
		[].map.call(list.children, function(el){return el})
			.sort(function(a, b){return a.innerHTML == b.innerHTML ? 0 : (a.innerHTML > b.innerHTML ? 1 : -1);})
			.forEach(function(el){df.appendChild(el)}
		);
		list.appendChild(df);
	}
	
    function save() {
        indexDbAPI.update(
            {
                id: "default",
                items: _fileList
            },
            function(){console.log("list saved")}, 
            function(){console.log("failed to save list")}
        );
    }

    return {
        init: init,
        save: save,
        addItems: addItems,
        setCurrentSong: setCurrentSong,
        getNextSong: getNextSong,
        getPrevSong: getPrevSong,
        getCurrentSong: getCurrentSong,
        setShuffle: setShuffle
    };
}
