var express = require('express')
  , server = express();



server.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

//shows/{:showId}}/{:seasonId}/{:episodeId}

server.get('/api/getVideosList', (req, res) => {
  res.send(JSON.stringify([
    {
      id: "1",
      ytId: "_D1JGNidMr4",
      title: "Youtube video 1"
    }, {
      id: "1",
      ytId: "qh3dYM6Keuw",
      title: "Youtube video 2"
    }, {
      id: "1",
      ytId: "1iAG6h9ff5s",
      title: "Youtube video 3"
    }
  ]));
});

server.listen(8888);
console.log('listening');
