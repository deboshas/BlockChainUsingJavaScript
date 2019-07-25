import { Transcation } from "./transcation";

export class Block {
    index: number;
    Hash: string;
    previousBlockHash: string;
    Transcations: Transcation[];
    TimeStamp: string;
    nance: number;

    constructor(hash, prevHash, Trasncationdata, nance) {

        this.Hash = hash;
        this.previousBlockHash = prevHash;
        this.nance = nance;
        this.TimeStamp = "9-9-";
        this.Transcations.push(Trasncationdata);
    }
}