var express = require('express'),
	app = express(),
	fs = require('fs'),
	tools = require('./tools'),
	homeFolder = '/home/vb/projects/samsung',
	exec=require('child_process').exec;
	
app.use(express.favicon()).use(express.static('static/')).use(express.bodyParser()).use(express.cookieParser()).use(express.session({ secret: 'tobo!', key: 'SID', cookie: { maxAge: 365*24*60*60*1000 }}));

app.get('/status_xml', function(req, res){
	//child = exec("svn status /home/vb/projects/samsung --xml", function (error, stdout, stderr) {
	child = exec("svn status " + homeFolder + " --xml", function (error, stdout, stderr) {
 	res.setHeader('Content-Type', 'text/xml; charset=charset=utf-8');		
		res.send(stdout);
		
		/*sys.print('stdout: ' + stdout);
		sys.print('stderr: ' + stderr);*/

		if (error !== null) {
			console.log('exec error: ' + error);
		}
	});
});

app.get('/status', function(req, res){
	//child = exec("svn status /home/vb/projects/samsung --xml", function (error, stdout, stderr) {
	child = exec("svn status " + homeFolder + " --xml | xsltproc /home/vb/projects/SVN_Extension/extension/schemachanges.xslt -", function (error, stdout, stderr) {
 	res.setHeader('Content-Type', 'text/html; charset=charset=utf-8');		
		stdout.pipe(res);
        stderr.pipe(res);
		
		/*sys.print('stdout: ' + stdout);
		sys.print('stderr: ' + stderr);*/

		if (error !== null) {
			console.log('exec error: ' + error);
		}
	});
});

app.get('/diff', function(req, res){
	child = exec("svn diff " + req.query.filename, function (error, stdout, stderr) {
 	res.setHeader('Content-Type', 'text/html; charset=charset=utf-8');		
		stdout.pipe(res);
        stderr.pipe(res);
		if (error !== null) {
			console.log('exec error: ' + error);
		}
	});
});

app.get('/update', function(req, res){
	child = exec("svn update " + homeFolder, function (error, stdout, stderr) {
 	res.setHeader('Content-Type', 'text/html; charset=charset=utf-8');		
		stdout.pipe(res);
        stderr.pipe(res);
		if (error !== null) {
			console.log('exec error: ' + error);
		}
		stdout.pipe(res);
        stderr.pipe(res);
	});
});


app.get('/logs', function(req, res){
	child = exec("svn log "+req.query.filename+" --xml -l 10 | xsltproc /home/vb/projects/SVN_Extension/extension/schema.xslt -", function (error, stdout, stderr) {
 	res.setHeader('Content-Type', 'text/html; charset=charset=utf-8');		
		//res.send(stdout);
		if (error !== null) {
			console.log('exec error: ' + error);
		}
		stdout.pipe(res);
        stderr.pipe(res);
	});
});
app.get('/logs_xml', function(req, res){
	child = exec("svn log "+req.query.filename+" --xml -l 10", function (error, stdout, stderr) {
 	res.setHeader('Content-Type', 'text/xml; charset=charset=utf-8');		
		//res.send(stdout);
		if (error !== null) {
			console.log('exec error: ' + error);
		}
		stdout.pipe(res);
        stderr.pipe(res);
	});
});

app.get('/info', function(req, res){
    child = exec("svn info "+req.query.filename, function (error, stdout, stderr) {
    res.setHeader('Content-Type', 'text/xml; charset=charset=utf-8');       
        //res.send(stdout);
        stdout.pipe(res);
        stderr.pipe(res);
        if (error !== null) {
            console.log('exec error: ' + error);
        }
    });
});




app.listen(7777);
console.log('Server is running...');
