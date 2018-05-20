/*
express js

*/


var express = require('express');

var app = express();

//This is going to send back to us our entire blockchain

app.get('/blockchain', function(req, res){
	

});

//This will register a transaction

app.post('/transaction', function(req, res){
	

});


//This creates a new block for us that we can mine

app.get('/mine', function(req, res){
	

});



//listening on port 3000
app.listen(3000, function(){
	console.log('listening on port 3000...');
});
