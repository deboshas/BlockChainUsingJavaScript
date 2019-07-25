import { Block } from "./Block";
import { Transcation } from "./transcation";
const sha256 = require('sha256');

export class BlockChain {

    Chain: Block[];
    CurrentNodeUrl: string;
    NetworkNodeUrls: string[]
    PendingTranscation: Transcation[];


    constructor() {


    }

    createTranscation(amount, sender, receiver) {

        this.PendingTranscation.push({
            Amount: amount,
            sender: sender,
            recepient: receiver
        });
    }

    getLastBlockIndex() {

        return this.Chain.length - 1;
    }

    createBlock(hash, prevHash, nance) {
        //validate wheather  hash,previous and nance are empty before creating new block and  pushing  to chain
        let block = new Block(hash, prevHash, this.PendingTranscation, nance);
        block.index = this.Chain.length + 1;
        //push the block into chain/ledger
        this.Chain.push(block);

    }

    createHash(prevHash, currentData, nance) {
        //validate wheather  hash,previous and nance are empty before creating new block and  pushing  to chain
        let payload = prevHash + JSON.stringify(currentData) + nance;
        return sha256(payload);

    }
    //mine the block,after that only u can create the  block and and it to the chain
    proofOfWork(prevHash, currentData) {
        let nance = 0;
        let payload = prevHash + JSON.stringify(currentData) + nance;
        let hash: string = this.createHash(prevHash, currentData, nance);
        while (hash.substring(0, 4) != "0000") {
            nance++;
            payload = this.createHash(prevHash, currentData, nance);
            hash = sha256(payload);
        }

        return nance;

    }
}