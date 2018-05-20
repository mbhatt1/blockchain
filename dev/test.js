/*
Import the constructor function
*/


const Blockchain = require('./blockchain');

//Create an instance

const bitcoin = new Blockchain();

//Now log bitcoin. It should log as a blockchain
//Compile using node test.js

bitcoin.createNewBlock(2929, 'asdasdasdasd', 'asdasdasdasd');

//at this point there should be no transactions. Now, create a few more blocks
bitcoin.createNewBlock(2929, 'asdasdasdasad', 'asdasdasdasdi');

console.log(bitcoin);

