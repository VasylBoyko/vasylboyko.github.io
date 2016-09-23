var CLIENT_ID = '790035903816-3d73bb39iogl6ddav2ph47tel1dinsba.apps.googleusercontent.com';
var SCOPES = [
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/drive.file'
].join(" ");

function handleClientLoad() {
    window.setTimeout(checkAuth, 1);
}

function checkAuth(callback) {
    gapi.auth.authorize({'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': true}, function(authResult) {
      handleAuthResult(authResult, callback);
    });
}

var access_token;
function handleAuthResult(authResult, callback) {
    var authButton = document.getElementById('authorizeButton');
    authButton.style.display = 'none';
    if (authResult && !authResult.error) {
        access_token = authResult.access_token;
        gapi.client.load('drive', 'v2', function() {
            callback && callback();
        });
    } else {
        // No access token could be retrieved, show the button to start the authorization flow.
        authButton.style.display = 'block';
        authButton.onclick = function() {
            gapi.auth.authorize(
                {'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': false},
                handleAuthResult);
        };
    }
}

function loadAllMp3(success) {
    retrieveAllFiles(function(files) {
        files = (files || []).filter(function(el){return el && el.fileExtension && el.fileExtension === "mp3"});
        files = files.map(function(el) {return {
            source: "google_drive", 
            id: el.id,
            album: el.parents[0].id, 
            fileName: el.title, 
            fileExtension: el.fileExtension};
        });
        //player.addItems(files);
        if (success) {
            success(files);
        }
    });
}

function retrieveAllFiles(callback) {
    var retrievePageOfFiles = function(request, result) {
        request.execute(function(resp) {
            result = result.concat(resp.items);
            var nextPageToken = resp.nextPageToken;
            if (nextPageToken) {
                request = gapi.client.drive.files.list({
                    'pageToken': nextPageToken
                });
                retrievePageOfFiles(request, result);
            } else {
                callback(result);
            }
        });
    };
    var initialRequest = gapi.client.drive.files.list({'q': "mimeType = 'audio/mpeg'", 'fields': 'items(id,fileExtension,title,originalFilename,parents)', maxResults: 0});
        retrievePageOfFiles(initialRequest, []);
}

function resolveGoogleUrl(fileId, callback, failure) {
  var request = gapi.client.drive.files.get({
      'fileId': fileId, 
      'fields': 'downloadUrl'
  });
  request.execute(function(resp) {
    if (!resp.error) {
      callback && callback(resp.downloadUrl.replace('&gd=true', ''));    
    } else if (resp.error.code == 401 || resp.error.code == 403) {
      // Access token might have expired.
 /*   OR:
      {
       "error": {
        "errors": [
         {
          "domain": "usageLimits",
          "reason": "dailyLimitExceededUnreg",
          "message": "Daily Limit for Unauthenticated Use Exceeded. Continued use requires signup.",
          "extendedHelp": "https://code.google.com/apis/console"
         }
        ],
        "code": 403,
        "message": "Daily Limit for Unauthenticated Use Exceeded. Continued use requires signup."
       }
      }
*/
      checkAuth(function() {
        resolveGoogleUrl(fileId, callback, failure);
      });
    } else {
      console.log('An error occured: ' + resp.error.message);
    }
  });
}