function Settings() {
    var dialog = $("#dialog-settings").dialog({
        autoOpen: false,
        height: 450,
        width: 650,
        minHeight: 300,
        minWidth: 300,	
        modal: true,
        buttons: {
        "Save": function() {
            applySettings();
            saveSettings();
            dialog.dialog( "close" );
        },
        "Apply": applySettings,
        Cancel: function() {
          dialog.dialog( "close" );
        }
        },
        close: function() {

        }
    });

    $( "#tabs" ).tabs().addClass( "ui-tabs-vertical ui-helper-clearfix" );
    $( "#tabs li" ).removeClass( "ui-corner-top" );
    $( "#skin_list" ).selectable({
      selected: function( event, ui ) {
        console.log(1);
      },
      selecting: function( event, ui ) {
        console.log(2);
      }
    });
    
    function applySettings() {

    }

    function saveSettings() {

    }
    

    return {
        showDialog: function() {
            dialog.dialog( "open" );
        }
    }
}

function TrackList() {
    var dialog = $("#file-dialog").dialog({
        autoOpen: false,
        height: 450,
        width: 650,
        minHeight: 300,
        minWidth: 300,  
        modal: true,
        buttons: {
        "Apply": applySettings,
        "Cancel": function() {
          dialog.dialog( "close" );
        }
        },
        close: function() {

        }
    }), loadedTracks;

    $( "#sources_tabs" ).tabs().addClass( "ui-tabs-vertical ui-helper-clearfix" );
    $( "#sources_tabs li" ).removeClass( "ui-corner-top" );
    $( "#track_list" ).selectable({
      selected: function( event, ui ) {
        console.log(1);
      },
      selecting: function( event, ui ) {
        console.log(2);
      }
    });
    function loadTracks() {
      document.getElementById("gd_track_list").innerHTML = "";
      loadAllMp3(function (files) {
        loadedTracks = files;
        var df = document.createDocumentFragment();
        files.sort(function(el1, el2) {
            if (el1.album === el2.album ) {
                return el1.fileName > el2.fileName? 1 : -1;
            }
            return el1.album > el2.album  ? 1 : -1;
        }).forEach(function (file) {
          var li = document.createElement("li");
          li.setAttribute("data-id", file.id);
          li.innerHTML = file.fileName;
          df.appendChild(li)
        });
        
        document.getElementById("gd_track_list").appendChild(df);
      })
      
    }
    
    function applySettings() {
        player.addItems(loadedTracks);
    }

    function saveSettings() {

    }

    return {
        showDialog: function() {
            dialog.dialog("open");
            loadTracks("");
        }
    }
}