const express = require('express');
const BlockChain = require('./blockChain');
const bodyParser = require('body-parser');
const port = process.argv[2];//port for different nodes
const url = process.argv[3];
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
    bitcoin.createNewTransaction(12.5, "mine-reward-programme", bitcoin.node_address);

    res.json({

        note: `New block mined successfully at ${newBlock.index}`,
        block: newBlock
    })

})

//register a node and broadcast it in the block chain network
app.post('/register-and-broadcast', function (req, res) {
    //new node wants to join our network

    const newNodeUrl = req.body.newNodeUrl;
    let registerNodePromises = [];

    //regsiter the new node  with self 

    if (bitcoin.networkNodes.indexOf(newNodeUrl) === -1) {
        bitcoin.networkNodes.push(newNodeUrl);
    }

    //broadcast the new node  to the  entire network 
    bitcoin.networkNodes.forEach(networkNodeUrl => {
        //hit register node endpoint for all nodes
        let requestOptions = {
            url: networkNodeUrl + "/register-node",
            method: 'Post',
            body: { newNodeUrl: newNodeUrl },
            json: true

        }
        registerNodePromises.push(rp(requestOptions));
    });
    Promise.all(registerNodePromises)
        .then(data => {
            //use the data 
            let bulkrequestOptions = {
                url: newNodeUrl + "/register-node-bulk",
                method: 'Post',
                body: { allnetworkNodes: [...bitcoin.networkNodes, bitcoin.currentNodeUrl] },
                json: true

            }

            return rp(bulkrequestOptions)

        }).then(data => {

            res.json({ note: "New Node registered successfully" });
        })

})

//register a node  to  the block chain network
app.post('/register-node', function (req, res) {

    if (bitcoin.networkNodes.indexOf(req.body.newNodeUrl) === -1 && req.body.newNodeUrl != bitcoin.currentNodeUrl) {
        bitcoin.networkNodes.push(req.body.newNodeUrl);
        res.json({ note: `New node is registerd successfully at ${bitcoin.currentNodeUrl} ` })
    }

    else {

        res.json({ note: `New node is already registred with ${bitcoin.currentNodeUrl} ` })
    }
})

//regsiter multiple nodes at once

app.post('/register-node-bulk', function (req, res) {


    let allnetworkNodes = req.body.allnetworkNodes;
    allnetworkNodes.forEach(url => {
        if (url != bitcoin.currentNodeUrl && bitcoin.networkNodes.indexOf(url) === -1) {
            bitcoin.networkNodes.push(url);
        }

    })
    res.json({ note: `New node is registerd with all the network nodes available` })

})

app.listen(port, function () {
    console.log(`Listing on port ${port}`);
});

