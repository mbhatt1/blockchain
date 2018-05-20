/*
express js

*/

const express = require('express');
const process = require('process');
const app = express();
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain');
const bitcoin = new Blockchain();
const uuid = require('uuid/v1');
const package_json = require('read-package-json');
const port = process.argv[2] || 3000;
const nodeaddress = uuid().split('-').join('');
const rp = require('request-promise');


package_json('./package.json', console.error, false, function(er, data){
	if (er){
		console.error("There was an error reading package.json");
		return
	}
// 	port = data['config']['port'];
//	console.error(port);
});


app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extend: false}));

//This is going to send back to us our entire blockchain

app.get('/blockchain', function(req, res){
	res.send(bitcoin);		

});

//This will register a transaction

app.post('/transaction', function(req, rest){
	const blockNumber = bitcoin.createNewTransaction(req.body.amount, req.body.sender, req.body.receiver);
	res.json({note: 'Transaction will be added in ${blockNumber}.'});
});

//Register nodes


app.post('/register-and-broadcast-node', function(req, res){
	const newNodeUrl = req.body.newNodeUrl;
	//Do some calculations and broadcast it to the network	
	if (bitcoin.networkNodes.indexOf(newNodeUrl) == -1) bitcoin.networknodes.push(newNodeUrl);

	const regNodePromises = [];
	bitcoin.networkNodes.forEach(networkNodeUrl => {
		//hit the register node end point
		const requestOptions = {
			uri: networknodeUrl + '/register-node',
			method: 'POST',
			body: {newNodeUrl: newNodeUrl},
			json: true
		};		
	
		regNodePromises.push(rp(requestOptions));
	});


	Promise.all(regNodesPromises)
	.then (data => {
		//use the data.. 
		const bulkRegisterOptions = {
			uri: newNodeUrl+ '/register-nodes-bulk', 
			method: 'POST',
			body: {allNetworkNodes: [ ...bitcoin.networkNodes, bitcoin.currentNodeUrl]},
			json: true
		};		

		return rp(bulkRegisterOptions);
	}).then(data => {
		res.json({note: 'New Node Registered with Network Successfully'});

	});


	
});


//After broadcast register node
app.post('/register-node', function(req, res){
	//Register Node after broadcast is received 

});


app.post('/register-nodes-bulk', function(req, res){


});

//This creates a new block for us that we can mine

app.get('/mine', function(req, res){
	const lastBlock = bitcoin.getLastBlock();
	const previousBlockHash = lastBlock['hash'];

	const currentBlockData = {
		transactions: bitcoin.pendingTransactions,
		index: lastBlock['index'] + 1
	};
	
	const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData);
	const blockHash = bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce);


	bitcoin.createNewTransaction(10, "00", uuid);


	const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, blockHash);

	res.json({
		note: "New Block Mined Successfully",
		block: newBlock
	});
});


//listening on port 3000
app.listen(port, function(){
	console.log('listening on port %s...', port);
});
