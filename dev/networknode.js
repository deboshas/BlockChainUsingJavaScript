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
    bitcoin.addTransactionToPendingTransactions(req.body.transcationData);
    res.json({ note: `Transcation will be added to  block at  ` });
})
//create a  new block for us  by mining
app.post('/mine', function (req, res) {
    registerNodePromises = [];
    const lastBlock = bitcoin.getLastBlock();
    const prevblockHash = lastBlock.hash;
    const currentBlockdata = {
        transcations: bitcoin.pendingTransactions,
        index: lastBlock.index + 1

    }
    let nance = bitcoin.proofOfWork(prevblockHash, currentBlockdata);

    let hash = bitcoin.hashBlock(prevblockHash, currentBlockdata, nance);


    let newBlock = bitcoin.createNewBlock(nance, prevblockHash, hash);
    //broad  cast the mined  block to teh enire network 

    bitcoin.networkNodes.forEach(networkNodeUrl => {
        let requestOptions = {
            url: networkNodeUrl + "/receive/new/block",
            method: 'Post',
            body: { block: newBlock },
            json: true

        }
        registerNodePromises.push(rp(requestOptions));
    });


    Promise.all(registerNodePromises)
        .then(data => {
            //add the block to chain if  teh block is accepted 
            bitcoin.addBlocktoChain(newBlock);
            //reward teh miner with a bitcoin
            let newTranscation = bitcoin.createNewTransaction(12.5, "mine-reward-programme", bitcoin.node_address);
            //broadcast the new reward  Tranascation to the entire network
            let requestOptions = {
                url: bitcoin.currentNodeUrl + "/transcation/broadcast",
                method: 'Post',
                body: {
                    transcationData: {
                        "amount": "12.5",
                        "sender": "mine reward programme",
                        "receiver": bitcoin.currentNodeUrl


                    }
                },
                json: true

            }
            return rp(requestOptions);




        })
        .then(data => {
            res.json({

                note: `New block mined successfully at ${newBlock.index}  and broadcasted successfully`,
                block: newBlock
            })

        })

    //reward this current node address with uuid unique id 




})

//create a decentrilized network--start
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

//create a decentrilized network--END

//sync the  nodes for transcation and mining --start
//this endpoint will be hit whenever we try to create a new transcsation
app.post('/transcation/broadcast', function (req, res) {

    let network_nodes = bitcoin.network_nodes;
    let transcationData = req.body.transcationData;
    let registerNodePromises = [];

    //create the  transcation in the current node

    let newTranscation = bitcoin.createNewTransaction(transcationData.amount, transcationData.sender, transcationData.receiver);
    bitcoin.addTransactionToPendingTransactions(newTranscation);


    //borad cast the  transcation to the enitre netwoprk
    bitcoin.networkNodes.forEach(networkNodeUrl => {
        let requestOptions = {
            url: networkNodeUrl + "/transcation",
            method: 'Post',
            body: { transcationData: newTranscation },
            json: true

        }
        registerNodePromises.push(rp(requestOptions));
    });


    Promise.all(registerNodePromises)
        .then(data => {

            res.json({ note: 'Transcation has benn boradcasted to every other node ' });
        });
});

app.post('/receive/new/block', function (req, res) {
    let newBlock = req.body.block;
    //validate teh new block upon receiving to check wheather teh block is legitimate or  not
    let lastBlock = bitcoin.getLastBlock();
    let correctHash = lastBlock.hash === newBlock.previousBlockHash;
    let correctindex = lastBlock.index === (newBlock.index - 1);
    if (correctHash && correctindex) {
        bitcoin.addBlocktoChain(newBlock);
        bitcoin.pendingTransactions = [];
        res.json({
            note: `New block is received and accepted and added to teh chain ${newBlock}`
        })

    }

    else {

        res.json({
            note: `New block is rejected by the  network  ${newBlock}`
        })

    }

})

app.get('/consensus', (req, res) => {

    registerNodePromises = [];
    bitcoin.networkNodes.forEach(networkNodeUrl => {
        let requestOptions = {
            url: networkNodeUrl + "/blockchain",
            method: 'Get',
            json: true

        }
        registerNodePromises.push(rp(requestOptions));
    });

    //longest chain rule implemenattion
    Promise.all(registerNodePromises)
        .then(blockChains => {

            blockChains.forEach(chain => {


            })
        });


})



//sync the  nodes for transcation and mining --End
app.listen(port, function () {
    console.log(`Listing on port ${port}`);
});

