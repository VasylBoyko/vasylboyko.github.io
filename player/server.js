var fs = require('fs');
//var http = require('http');
var https = require('https');
var privateKey  = fs.readFileSync('/home/vb/projects/fring/kandy/server/cert/localhost/key.pem', 'utf8');
var certificate = fs.readFileSync('/home/vb/projects/fring/kandy/server/cert/localhost/cert.pem', 'utf8');

var credentials = {key: privateKey, cert: certificate};
var express = require('express');
var app = express();
app.use('/', express.static("."));
https.createServer(credentials, app).listen(4443);
