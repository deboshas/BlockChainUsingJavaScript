const sha256 = require('sha256');
const currentNodeurl = process.argv[3];
const uuid = require('uuid/v1');//unique identifer for ths current node

class BlockChain {

    constructor() {

        this.chain = [];
        this.pendingTransactions = [];
        this.createNewBlock(100, '0', '0');//genesys block,first block
        this.currentNodeUrl = currentNodeurl;
        this.networkNodes = [];
        this.node_address = uuid().split('-').join('');
    }

    createNewBlock(nance, previousBlockHash, hash) {
        const newBlock = {
            index: this.chain.length + 1,
            timestamp: Date.now(),
            transactions: this.pendingTransactions,
            nance: nance,
            hash: hash,
            previousBlockHash: previousBlockHash
        };

        this.pendingTransactions = [];
        this.chain.push(newBlock);

        return newBlock;
    }


    getLastBlock() {
        return this.chain[this.chain.length - 1];
    }


    createNewTransaction(amount, sender, receiver) {

        //add a logic to validate the transcation before adding it to  pending transcation works
        const newTransaction = {
            amount: amount,
            sender: sender,
            receiver: receiver,

        };

        return this.addTransactionToPendingTransactions(newTransaction);
    }


    addTransactionToPendingTransactions(transactionObj) {

        this.pendingTransactions.push(transactionObj);
        return this.getLastBlock()['index'] + 1;
    }


    hashBlock(previousBlockHash, currentBlockData, nance) {
        const dataAsString = previousBlockHash + nance.toString() + JSON.stringify(currentBlockData);
        const hash = sha256(dataAsString);
        return hash;
    }


    proofOfWork(previousBlockHash, currentBlockData) {
        let nance = 0;
        let hash = this.hashBlock(previousBlockHash, currentBlockData, nance);
        while (hash.substring(0, 4) !== '0000') {
            nance++;
            hash = this.hashBlock(previousBlockHash, currentBlockData, nance);
        }

        return nance;
    }


}

module.exports = BlockChain