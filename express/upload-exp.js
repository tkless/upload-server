 var express = require('express');
 var app = express();
 var path = require('path');
 var formidable = require('formidable');
 var fs = require('fs');
 var port = 8080;

 app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

 app.use(express.static(path.join(__dirname, 'public')));

 app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

 app.post('/upload', function(req, res){
  var uploaded_files = [];

  // create an incoming form object
  var form = new formidable.IncomingForm();

  // specify that we want to allow the user to upload multiple files in a single request
  form.multiples = true;

  // store all uploads in the /uploads directory
  form.uploadDir = path.join(__dirname, '/uploads');

  // every time a file has been uploaded successfully,
  // rename it to it's orignal name
  form.on('file', function(field, file) {
    fs.rename(file.path, path.join(form.uploadDir, file.name));
    uploaded_files.push( path.join(form.uploadDir, file.name) );
  });

  // log any errors that occur
  form.on('error', function(err) {
    console.log('An error has occured: \n' + err);
  });

  // once all the files have been uploaded, send a response to the client
  form.on('end', function() {
    console.log("Responding");
    res.json(uploaded_files);
    res.end();
  });

  // parse the incoming request containing the form data
  form.parse(req);

});

 app.listen(port, function(){
  console.log('Server listening on port: ' + port);
});