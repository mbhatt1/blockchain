const sha256 = require ('sha256');
//Final thing to do is to get Genesis block. So to do this, we create the first block in the method
//It doesn't matter for the first block but for every other we need to use legitimate parameters
const currentNodeUrl = process.argv[3];
const uuid = require('uuid/v1');

function Blockchain(){
	this.chain = [];
	this.pendingTransactions = [];
	this.currentNodeUrl = currentNodeUrl;
	this.networkNodes=[];
	
	this.createNewBlock(102, 'E2A', '2D');
	
};

/*
//In javascript: Really no classes therefore creating constructor functions are used above

//you could say class Blockchain{

//	connstructor(){ this.chain = []; this.pendingTransactions = [];}

//}

*/


Blockchain.prototype.createNewBlock = function (nonce, previousBlockHash, hash){
	 //create new block
	const newBlock = {
		//Block Number
		index: this.chain.length + 1,
		//timestamp: because wanna know when the block was created
		timestamp: Date.now(),
		//wanna put all new transactions in this new block so they can never be changed
		transactions: this.pendingTransactions,
		//Nonce property is basically PoF. In our case its a number: 20, 20000 etc. It is a proof that we created this block in a legitimate way. 
		nonce: nonce,
		//Hash is basically the data from our new block. We are going to pass our transactions to a hashing function and create a hash. 
		//We are going to build a hashing method and we should be able to understand what the hash below actually means. 
		hash: hash,
		//Finally, last property is the previous block hash. This is the data from our previous block. The above hash is the data from our current block. Sorta like a linked list architecture
		previousBlockHash: previousBlockHash,
	};
		
	//Above is how our block will look like

	//Below: after we create new block, we wanna clear our new transactions for the next block
	this.pendingTransactions = []; 
	//takes the block and adds it to our chain
	this.chain.push(newBlock);
	
	//return new Block
	return newBlock;
};



/*
Now, we wanna test the method to see if it works properly. The first thing we need is to export our BlockChain constructor function in 
test.js
*/

//after testing, now we need to write a method for return last block. 
//Since we used an array, the following method should do. 

Blockchain.prototype.getLastBlock = function(){
	return this.chain[this.chain.length-1];

};
//This is for New transaction
//@params: amount= amount to send, receiver = receipient, sender = sender person
Blockchain.prototype.createNewTransaction = function (amount, sender, receiver){
	//create new Transaction

	const newTransaction = {
		amount: amount,
		sender: sender,
		receiver: receiver,
		transactionId: uuid().split('-').join('') 
	};

	//all of the transactions we will record will look like above. Now we need to push the new transactions to our array in the constructor function. 

//	this.pendingTransactions.push(newTransaction);
	/*
		Basically, on our blockchain, there are gonna be a lot of transactions. Everytime a new one is made, we push it in the array. But all the transactions arent recorded yet, i.e aren't
		recorded yet. They get recorded when a new block is mined, i.e when a new block is created. All of these transactions are basically pending transactions and are validated only when a 
		new block is created. So, in this commit we are gonna change the pendingTransactions field to pending transactions. We want to return what block we will find our transactions in
	*/

	//The following: it creates the block that our transaction is added to. Now we will test this. 
//	return this.getLastBlock()['index'] + 1;
	return newTransaction;
};

//Create new method to add transaction

Blockchain.prototype.addTransactionToPendingTransactions = function(transactionObj){
	this.pendingTransactions.push(transactionObj);
	return this.getLastBlock()['index'] + 1;
};




/*
	The method will take a block and hash that block into some fixed length string which is basically random. We will use SHA256. 
*/
Blockchain.prototype.hashBlock = function(previousBlockHash, currentBlockData, nonce){
	//import a library

	//change data to a string. JSON.stringify turns the array to a string

	const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);

	//Create Hash. Hash of the data is now created. Then return it. 
	const hash = sha256(dataAsString);

	return hash;

	
};

/*
	Next method we are going to add is the proof of work (PoW) method. This is import. Essential! 
	One of the major reasons why blockchain tech is secure. We wanna make sure every block added to the chain is legitimate. Because otherwise fraud is possible. So what does this method do?
	It takes current block data and previous block hash. By taking these two things, it will try to generate a specific hash. In our case it will start with 4 zeros. The only way we do this is 
	by trial and error. So we run the hashBlock method several times. 

	How can we possibly generate multiple hashes by passing in same data?
	bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce);

	We are going to be constantly changing the nonce value. 


	Essentially: repeatedly hash block until we find correct block. We change the input to the hashBlock method by incrementing the nonce value. 

	So, how does the PoW method secure the block chain? This is because inorder to generate the correct hash, we have to run the method tens of thousands of times. So in many chases trying to 
	recreate a hash requires a lot of computation power. So, recreating a block using fake data isn't feasible generally. 

*/

Blockchain.prototype.proofOfWork = function(previousBlockHash, currentBlockHash){
	//acceptable hash starts with 4 zeros in our case '0000ISAS2CWDASD'

	var nonce = 0;
	var hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);

	//constantly run the hash block method
	//Substring from 0 to 4 not including 4. 

	while(hash.substring(0,4) !== '0000'){
		nonce ++;
		hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
	}

	//The above will look for a proper hash
	//now after correct nonce is created, return the nonce value. 

	return nonce;
};


//Chain is valid method

Blockchain.prototype.chainIsValid(blockchain){
	var validChain = true;
	for (var i = 1; i < blockchain.length; i++){
		const currentBlock = blockchain[i];
		const prevBlock = blockchain[i-1];
		const blockHash = this.hashBlock(prevBlock['hash'], {transactions: currentBlock['transactions'], index:currentBlock['index']}, currentBlock['nonce']);

		if (blockHash.substring(0,4) !== '0000') validChain = false;
		//Genesis block? it should have properties that we put onto it. 
		if (currentBlock['previousBlockHash'] !== prevBlock['hash']){
			validChain = false;
		
		}

	};	

	const genesisBlock = blockchain[0];
	const correctNonce = genesisBlock['nonce'] === 102;
	const correctPreviousBlockHash = genesisBlock['previousBlockHash'] === 'E2A';
	const correctHash = genesisBlock['hash'] === '2D';
	const correctTransactions = genesisBlock['transactions'].length === 0;

	if (!correctNonce || !correctPreviousBlockHash || !correctHash || correctTransactions) validChain = false;
	
	return validChain;
};



//The following is for exporting
module.exports = Blockchain;

