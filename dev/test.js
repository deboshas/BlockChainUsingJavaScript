var BlockChain = require('./blockChain');
var bitcoin = new BlockChain();
let blockChaindata = {
    "chain": [
        {
            "index": 1,
            "timestamp": 1564544724877,
            "transactions": [

            ],
            "nance": 100,
            "hash": "0",
            "previousBlockHash": "0"
        },
        {
            "index": 2,
            "timestamp": 1564544819793,
            "transactions": [
                {
                    "amount": "10",
                    "sender": "tax",
                    "receiver": "public expenditure"
                },
                {
                    "amount": "10",
                    "sender": "1",
                    "receiver": "public expenditure"
                }
            ],
            "nance": 124840,
            "hash": "0000ec477f70dc528acdfc6fdd91ba5be2ca812ff3ee64cf439ae1ee0e51c7fb",
            "previousBlockHash": "0"
        },
        {
            "index": 3,
            "timestamp": 1564544841472,
            "transactions": [
                {
                    "amount": "12.5",
                    "sender": "mine reward programme",
                    "receiver": "http://localhost:3001",
                    "transcationId": "d9b3b7e0b34511e9b170897154018a7b"
                },
                {
                    "amount": "10",
                    "sender": "1",
                    "receiver": "public expenditure"
                },
                {
                    "amount": "10",
                    "sender": "1",
                    "receiver": "public expenditure"
                },
                {
                    "amount": "10",
                    "sender": "1",
                    "receiver": "public expenditure"
                }
            ],
            "nance": 86458,
            "hash": "0000e66932943be9a3aaa3fd672a560b5f7093d6f916ce2682c1090803e0f2d3",
            "previousBlockHash": "0000ec477f70dc528acdfc6fdd91ba5be2ca812ff3ee64cf439ae1ee0e51c7fb"
        },
        {
            "index": 4,
            "timestamp": 1564544891957,
            "transactions": [
                {
                    "amount": "12.5",
                    "sender": "mine reward programme",
                    "receiver": "http://localhost:3001",
                    "transcationId": "e69e9a60b34511e9b170897154018a7b"
                },
                {
                    "amount": "70",
                    "sender": "1",
                    "receiver": "public expenditure"
                },
                {
                    "amount": "90",
                    "sender": "1",
                    "receiver": "public expenditure"
                },
                {
                    "amount": "90",
                    "sender": "1",
                    "receiver": "public expenditure"
                }
            ],
            "nance": 473192,
            "hash": "00004bb91732d1930b3e8c064f44a44889145a7b6f3c116e4dc8dba5fe4cb52d",
            "previousBlockHash": "0000e66932943be9a3aaa3fd672a560b5f7093d6f916ce2682c1090803e0f2d3"
        },
        {
            "index": 5,
            "timestamp": 1564544903292,
            "transactions": [
                {
                    "amount": "12.5",
                    "sender": "mine reward programme",
                    "receiver": "http://localhost:3001",
                    "transcationId": "04b5b290b34611e9b170897154018a7b"
                }
            ],
            "nance": 22379,
            "hash": "00009e3237f5db39c5787ce1167e4a90ec635c419d7b5ae5c8800e816755d103",
            "previousBlockHash": "00004bb91732d1930b3e8c064f44a44889145a7b6f3c116e4dc8dba5fe4cb52d"
        },
        {
            "index": 6,
            "timestamp": 1564544909176,
            "transactions": [
                {
                    "amount": "12.5",
                    "sender": "mine reward programme",
                    "receiver": "http://localhost:3001",
                    "transcationId": "0b76d2d0b34611e9b170897154018a7b"
                }
            ],
            "nance": 2981,
            "hash": "0000677ccff4a72bafd5a0ced7cc456299d202b2ddb48266146bab88c7f9ddc4",
            "previousBlockHash": "00009e3237f5db39c5787ce1167e4a90ec635c419d7b5ae5c8800e816755d103"
        }
    ],
    "pendingTransactions": [
        {
            "amount": "12.5",
            "sender": "mine reward programme",
            "receiver": "http://localhost:3001",
            "transcationId": "0ef8cda0b34611e9b170897154018a7b"
        }
    ],
    "currentNodeUrl": "http://localhost:3001",
    "networkNodes": [

    ],
    "node_address": "a11edae0b34511e9b170897154018a7b"
};


console.log('validChain', bitcoin.ChainIsValid(blockChaindata));