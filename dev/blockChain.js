const sha256 = require('sha256');
const currentNodeurl = process.argv[3];
const uuid = require('uuid/v1');//unique identifer for ths current node

class BlockChain {

    constructor() {

        this.chain = [];
        this.pendingTransactions = [];
        this.addBlocktoChain(this.createNewBlock(100, '0', '0'));//genesys block,first block
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


        return newBlock;
    }

    addBlocktoChain(block) {
        this.chain.push(block);
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
            transcationId: uuid().split('-').join('')
        };
        return newTransaction;

    }


    addTransactionToPendingTransactions(transactionObj) {

        this.pendingTransactions.push(transactionObj);

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

    //need to fix it,return true in case of a block been  compromised
    ChainIsValid(blockChain) {
        let isValidChain = true;
        let isvalidGenesysBlock = true;
        let genesysBlock = blockChain.chain[0];
        //longest chain rule 
        //validate each an every block in current  node by comparing prev block hash with the  current block and also validating each and every data in the block by rehashing it
        for (var i = 1; i < blockChain.chain.length; i++) {
            let prevBlock = blockChain.chain[i - 1];
            let currentBlock = blockChain.chain[i];
            if (this.hashBlock(prevBlock.hash, { transcations: currentBlock.transactions, index: currentBlock.index }, currentBlock.nance).substring(0, 4) != '0000') {
                isValidChain = false;
                break;

            }
            if (prevBlock.hash != currentBlock.previousBlockHash) {
                isValidChain = false;
                break;
            }
        }
        //check for genesys block 
        if ((genesysBlock.nance != "100") || (genesysBlock.hash != "0") || (genesysBlock.previousBlockHash
            != "0") && (genesysBlock.transactions.length != 0)) {
            isvalidGenesysBlock = false
        }

        return isValidChain && isvalidGenesysBlock;
        //validate the data for evry block by re hashing


    }


}

module.exports = BlockChain