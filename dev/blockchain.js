const sha256 = require ('sha256');


function Blockchain(){
	this.chain = [];
	this.pendingTransactions = [];

}

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
}



/*
Now, we wanna test the method to see if it works properly. The first thing we need is to export our BlockChain constructor function in 
test.js
*/

//after testing, now we need to write a method for return last block. 
//Since we used an array, the following method should do. 

Blockchain.prototype.getLastBlock = function(){
	return this.chain[this.chain.length-1];

}
//This is for New transaction
//@params: amount= amount to send, receiver = receipient, sender = sender person
Blockchain.prototype.createNewTransaction = function (amount, sender, receiver){
	//create new Transaction

	const newTransaction = {
		amount: amount,
		sender: sender,
		receiver: receiver, 
	};

	//all of the transactions we will record will look like above. Now we need to push the new transactions to our array in the constructor function. 

	this.pendingTransactions.push(newTransaction);
	/*
		Basically, on our blockchain, there are gonna be a lot of transactions. Everytime a new one is made, we push it in the array. But all the transactions arent recorded yet, i.e aren't
		recorded yet. They get recorded when a new block is mined, i.e when a new block is created. All of these transactions are basically pending transactions and are validated only when a 
		new block is created. So, in this commit we are gonna change the pendingTransactions field to pending transactions. We want to return what block we will find our transactions in
	*/

	//The following: it creates the block that our transaction is added to. Now we will test this. 
	return this.getLastBlock()['index'] + 1;
}


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

	
}

//The following is for exporting
module.exports = Blockchain;

