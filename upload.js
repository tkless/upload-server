var formidable = require('formidable'),
  http = require('http'),
  path = require('path'),
  fs = require('fs-extra'),
  port = 8080,
  server;

server = http.createServer(function(req, res) {

 if ( req.url == '/upload' ) {
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
     res.setHeader( 'Access-Control-Allow-Origin', '*' );
     res.setHeader('Content-Type', 'application/json');
     res.end(JSON.stringify(uploaded_files));
   });

   // parse the incoming request containing the form data
   form.parse(req);
  }
});

server.listen(port, function () {
  console.log('Server listening on port: ' + port);
});