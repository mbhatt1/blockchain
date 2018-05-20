
function Blockchain(){
	this.chain = [];
	this.newTransactions = [];

}

/*
//In javascript: Really no classes therefore creating constructor functions are used above

//you could say class Blockchain{

//	connstructor(){ this.chain = []; this.newTransactions = [];}

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
		transactions: this.newTransactions,
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
	this.newTransactions = []; 
	//takes the block and adds it to our chain
	this.chain.push(newBlock);
	
	//return new Block
	return newBlock;
}



/*
Now, we wanna test the method to see if it works properly. The first thing we need is to export our BlockChain constructor function in 
test.js
*/


module.exports = Blockchain;

