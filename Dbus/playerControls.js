
    function Player (iFace, el) {
        var self = this;
        el.style.display = "block";
        this.iface = iFace;

        document.getElementById("playPause").onclick = function () {
            iFace.PlayPause()
        }

        Object.defineProperty(this, "Metadata", {
            get: function () {
                var result;
                self.iface.Metadata(function (err, res) {
                    if (err) {
                        console.error("Faild to get 'Metadata' value", err)
                        return null
                    }
                    result = res;
                });
                
                return result;
            },
            set: function (value) {
                self.iface.Metadata = value;
            }
        });

/*
  on: [Function],
  addListener: [Function],
  removeListener: [Function],
  Previous: [Function],
  Next: [Function],
  Stop: [Function],
  Play: [Function],
  Pause: [Function],
  PlayPause: [Function],
  Seek: [Function],
  OpenUri: [Function],
  SetPosition: [Function],

  Metadata: [Getter/Setter],
  PlaybackStatus: [Getter/Setter],
  LoopStatus: [Getter/Setter],
  Volume: [Getter/Setter],
  Shuffle: [Getter/Setter],
  Position: [Getter/Setter],
  Rate: [Getter/Setter],
  MinimumRate: [Getter/Setter],
  MaximumRate: [Getter/Setter],
  CanControl: [Getter/Setter],
  CanPlay: [Getter/Setter],
  CanPause: [Getter/Setter],
  CanSeek: [Getter/Setter]

  iface.on('Seeked', (ifaceName, value) => {
        console.log(value)
  });
*/        
    }


    exports.Create = function (iFace, el) {
        return new Player(iFace, el)
    }

