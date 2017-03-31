/*jslint browser:true, devel:true */
/*global app:true, tools:true, $:true */

var hasTouch = 'ontouchstart' in window,
    CLICK_EV = hasTouch ? "touchend" : "click",
    RESIZE_EV = 'onorientationchange' in window ? 'orientationchange' : 'resize',
    START_EV = hasTouch ? 'touchstart' : 'mousedown',
    MOVE_EV = hasTouch ? 'touchmove' : 'mousemove',
    END_EV = hasTouch ? 'touchend' : 'mouseup',
    CANCEL_EV = hasTouch ? 'touchcancel' : 'mouseup';

var Player = function() {
    'use strict';
    var object_under_mouse = "";
    var mainWindow = (function() {
        var VOLUME_MAX_VALUE = 27,
            settingsDialog;

        function togglePlayList () {
            var pl = tools.getElement("play_list_cont"),
                isHidden = tools.hasClass(pl, "hidden");
            tools.toggleClass(pl, "hidden");
            if (isHidden) {
                pl.setAttribute("data-on");
                pl.removeAttribute("data-off");
            } else {
                pl.setAttribute("data-off");
                pl.removeAttribute("data-on");
            }
        }

        function bind() {
            document.getElementById('m_previous').addEventListener(CLICK_EV, function(ev) {playPrevious(); });
            document.getElementById('m_play').addEventListener(CLICK_EV, function(ev) {play(); });
            document.getElementById('m_pause').addEventListener(CLICK_EV, function(ev) {pause(); });
            document.getElementById('m_stop').addEventListener(CLICK_EV, function(ev) {stop(); });
            document.getElementById('m_next').addEventListener(CLICK_EV, function(ev) {playNext(); });
            document.getElementById('m_volume').addEventListener("input", function(ev) {player.volume = this.value/VOLUME_MAX_VALUE});
        //    document.getElementById('m_eject').addEventListener(CLICK_EV, function(ev) {loadLyric()});

            document.getElementById('m_plButton').addEventListener(CLICK_EV, togglePlayList);
            document.getElementById('m_eject').addEventListener(CLICK_EV, settings.showDialog);
            document.getElementById('m_posbar').addEventListener("change", function(event) {goToPosition(event.target.value)});
            
            
            document.getElementById('add_track_btn').addEventListener(CLICK_EV, trackList.showDialog);
            

            window.addEventListener("mousedown", function(event) {
                object_under_mouse = event.target.id;
            });
            window.addEventListener("mouseup", function(event) {
                object_under_mouse = "";
            });

        }
        function init() {
            bind();
        }
        function setVolume(value){
            var uiValue = Math.round(value * VOLUME_MAX_VALUE);
            if (document.getElementById('m_volume').value != uiValue) {
                document.getElementById('m_volume').value = uiValue;
            }
            document.getElementById('m_volume').setAttribute("value", uiValue);
        }
        return {
            init: init,
            setVolume: setVolume
        };
    }());
    var eq = (function() {
        function init() {
            return true;
        }

        return {
            init: init
        };
    }());

    /*****************************************/
    var _volume = 0.5;
    var currentPlayer;

    function switchPlayers(){
        currentPlayer = getShadowPlayer();
    }
    function getShadowPlayer () {
        return document.getElementById((currentPlayer.id=="player1") ?  "player2" : "player1");
    }

    function goToPosition(newPos) {
        currentPlayer.currentTime = currentPlayer.duration * newPos;
    }

    function playFile(listItem){
        if (listItem) {
            var url = listItem.url,
                shadowPlayer = getShadowPlayer(),
                _currentPlayer = currentPlayer;
            if (currentPlayer.src != url) {
                playList.setCurrentSong(listItem);
                if (shadowPlayer.src == url) {
                    currentPlayer = shadowPlayer;
                    shadowPlayer = _currentPlayer;
                } else {
                    currentPlayer.src = url;
                }
            }
            currentPlayer.play();

            playList.getNextSong(function(nextSong) {
                if (nextSong && shadowPlayer.src != nextSong.url) {
                    shadowPlayer.src = nextSong.url;
                }
            });
        }
    }

    function loadedMetadata(ev){
        console.log(ev);
    }

    var playList,
        settings,
        trackList;
    function init() {
        settings = Settings();
        trackList = TrackList();
        mainWindow.init();
        eq.init();
        playList = new PlayList();
        playList.init();

		if (document.body.offsetWidth > 300) {
			$( "#playerContainer" ).draggable({ handle: "#main_window .titlebar" });
			$( "#play_list_cont" ).resizable({ snap: true }).draggable({ snap: true, /*handle: "#play_list_cont .titlebar"*/});
			$( "#play_list_cont_2" ).resizable({ snap: true }).draggable({ snap: true, /*handle: "#play_list_cont .titlebar"*/});
			$( "#eq_main" ).draggable({ snap: true/*, handle: "#eq_main .titlebar"*/});
		}
    }

    function play() {
        playList.getCurrentSong(playFile);
    }

    function playPrevious(){
        playList.getPrevSong(playFile);
    }

    function pause() {
        currentPlayer.pause();
    }

    function stop() {
        currentPlayer.pause();
        currentPlayer.currentTime = 0;
    }

    function playNext(){
        playList.getNextSong(playFile);
    }

    function setShuffle() {
        mainWindow.setShuffle();
        playList.setShuffle();
    }

    function setVolume(value) {
        currentPlayer.volume = _volume;
        getShadowPlayer().volume = _volume;
        mainWindow.setVolume(value);
    }



    var AudioContext = window.AudioContext || window.webkitAudioContext,
        analizer = document.getElementById("analizer"),
        ln = 19,
        analizer_bands=[];

    function initAnalizer(audio) {
        var an = {};

        if (analizer && !analizer.firstChild) {
            var div;
            for (var i = 0; i<ln; i++) {
                div = document.createElement("div");
                div.style.left = i * 4 + "px";
                analizer.appendChild(div);
            }
        }
        an.context = new AudioContext();
        an.node = an.context.createScriptProcessor(2048, 1, 1);
        //Создаем анализатор
        an.analyser = an.context.createAnalyser();
        an.analyser.smoothingTimeConstant = 0.3;
        an.analyser.fftSize = 512;
        an.bands = new Uint8Array(an.analyser.frequencyBinCount);

        audio.addEventListener('canplay', function () {
            if (!audio.initialized){
                an.source = an.context.createMediaElementSource(audio);
                an.source.connect(an.analyser);
                an.analyser.connect(an.node);
                an.node.connect(an.context.destination);
                an.source.connect(an.context.destination);
                an.node.onaudioprocess = function () {
                    an.analyser.getByteFrequencyData(an.bands);
                    if (!audio.paused) {
                        update(an.bands);
                    }
                };
                audio.initialized = true;
            }
        });

        function update(bands) {
            if (bands[0]) {
                analizer_bands = [].map.call(bands, function(el){return el || 4;});
            }
        }

        updateAnalizer();
        return audio;
    }


    function updateAnalizer(){
        if (analizer && analizer.children && analizer_bands.length){
            for (var i =0; i< ln; i++) {
                var loc = analizer.children[i];
                loc.style.height = (analizer_bands[i * 9] /256) * 20  + "px";
            }
        }
        window.requestAnimationFrame(updateAnalizer);
    }


    function initPlayer(audio) {
        function onProgress(ev) {
            if (object_under_mouse !== "m_posbar") {
                m_posbar.value =  ev.target.currentTime / ev.target.duration;
            }
        }
     //   initAnalizer(audio);
       // audio.addEventListener("ended", playNext);
        audio.onended = playNext.bind(this);
        audio.addEventListener('loadedmetadata', loadedMetadata, false);
    //    audio.addEventListener("timeupdate", onProgress, false);
        audio.ontimeupdate = onProgress;
        return audio;
    }
    initPlayer(document.getElementById('player2'));
    currentPlayer = initPlayer(document.getElementById('player1'));

    return {
        init: init,
        addItems: function () {
            playList.addItems.apply(this, arguments);
        },
        play: play,
        stop: stop,
        pause: pause,
        playFile: playFile,
        set volume(value) {
            _volume = value;
            setVolume(value);
        },
        get volume() {
            return _volume;
        },
        setShuffle: setShuffle
    };
};




var player;
window.onload= function ()	{
    player = new Player();
    player.init();
};
