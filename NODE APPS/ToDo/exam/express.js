// creates the variables path, express and app
// path tells indicates the folder where assets
// such as where html files are located
var path = require('path');
var express = require('express');


// creates the express variable, which implements the server in express
var app = express();


// retrieves the value in the url localhost:3000
// when the program is running
// responds to the get request with the url
app.get('/', function(req,res){
	res.send('Hello World!');
});

// if anything is added after localhost/3000
// this error will show that it doesnt exist.
app.use(function(req,res){
    res.type('text/plan');
    res.status(404);
	res.send('404 Not Found');
});

// this grabs an error 
app.use(function(err, req, res, next){
	console.error(err.stack);
	res.type('text/plan');
	res.status(500);
	res.send('500 Sever Error');
});

//grabs where public files are located
var staticPath = path.join(__dirname, '/public');
app.use(express.static(staticPath));


// retrieves the port variable and tell the server to listen to that port
// adds a message to the console that when server is running
app.listen(3000, function() {
  console.log('listening');
});