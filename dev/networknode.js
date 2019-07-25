const express = require('express');
const BlockChain = require('./blockChain');
const bodyParser = require('body-parser');
const uuid = require("uuid/v1");//unique identifer for ths current node
const port = process.argv[2];//port for different nodes
const url = process.argv[3];
const node_Address = uuid().split('-').join('');
const rp = require('request-promise');
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const bitcoin = new BlockChain();

app.get('/blockchain', function (req, res) {

    res.send(bitcoin);

})

app.post('/transcation', function (req, res) {
    const lastBlockIndex = bitcoin.createNewTransaction(req.body.amount, req.body.sender, req.body.receiver);
    res.json({ note: `Transcation will be added to  block at  ${lastBlockIndex} ` });
})
//create a  new block for us 
app.get('/mine', function (req, res) {
    const lastBlock = bitcoin.getLastBlock();
    const prevblockHash = lastBlock.hash;
    const currentBlockdata = {
        transcations: bitcoin.pendingTransactions,
        index: lastBlock.index + 1

    }
    const nance = bitcoin.proofOfWork(prevblockHash, currentBlockdata);

    const hash = bitcoin.hashBlock(prevblockHash, currentBlockdata, nance);


    const newBlock = bitcoin.createNewBlock(nance, prevblockHash, hash);

    //reward this current node address with uuid unique id 
    bitcoin.createNewTransaction(12.5, "mine-reward-programme", `http://localhost:${port}`);

    res.json({

        note: `New block mined successfully at ${newBlock.index}`,
        block: newBlock
    })

})

//register a node and broadcast it in the block chain network
app.post('/register-and-broadcast', function (res, rev) {

    const newNode = req.body.url;
    //regsiter with self 
    if (bitcoin.networkNodes.indexOf(newNode) === -1) {
        bitcoin.networkNodes.push(newNode);
    }
    //broad cast it to the  entire netwrk
    bitcoin.networkNodes.foreach(networkNodeUrl => {
        //hit register node endpoint


    })

})

//register a node  to  the block chain network
app.post('/register-node', function (res, rev) {

    const newNode = req.body.url;
    //broad cast it to teh enire netwrk
})

//regsiter multiple nodes at once

app.post('/register-node-bulk', function (res, rev) {

    const newNode = req.body.url;
    //broad cast it to teh enire netwrk
})

app.listen(port, function () {
    console.log(`Listing on port ${port}`);
});

