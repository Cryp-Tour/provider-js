const Web3 = require('web3')
const fs = require('fs');
var Contract = require('web3-eth-contract');


const _callbacks = {
    TourTokenFactory: [],
    BFactory: [],
    TourTokenOrder: [],
    BPool: []
}

var netId = 1

module.exports.setNetworkId = function (new_netId) {
    netId = new_netId
}

module.exports.setProviderURL = function (nodeURL) {
    Contract.setProvider(nodeURL);
}

module.exports.initTourTokenFactoryListener = function (TourTokenFactoryMeta) {
    let truffle_ABI_string = fs.readFileSync(TourTokenFactoryMeta);
    let truffle_obj = JSON.parse(truffle_ABI_string);
    let abi = truffle_obj.abi
    let tourtokenfactoryAddress = truffle_obj.networks[netId].address

    let TourTokenFactory = new Contract(abi, tourtokenfactoryAddress);
    console.log("[provider-js] Listening to new TourToken created at " + tourtokenfactoryAddress);
    TourTokenFactory.events.allEvents({}, (err, event) => {
        if (err) {
            console.log(err)
        }
        else {
            if (event.event == "TokenRegistered") {
                executeCallbacks(_callbacks.TourTokenFactory, event.returnValues)
            }
        }
    })
}

module.exports.initBFactoryListener = function (BFactoryMeta) {
    let truffle_ABI_string = fs.readFileSync(BFactoryMeta);
    let truffle_obj = JSON.parse(truffle_ABI_string);
    let abi = truffle_obj.abi
    let bfactoryAddress = truffle_obj.networks[netId].address

    let BFactory = new Contract(abi, bfactoryAddress);
    console.log("[provider-js] Listening to new BPools created at " + bfactoryAddress);
    BFactory.events.allEvents({}, (err, event) => {
        if (err) {
            console.log(err)
        }
        else {
            if (event.event == "LOG_NEW_POOL") {
                executeCallbacks(_callbacks.BFactory, event.returnValues)
            }
        }
    })
}

module.exports.addTT = function (TTMeta, address) {
    let truffle_ABI_string = fs.readFileSync(TTMeta);
    let truffle_obj = JSON.parse(truffle_ABI_string);
    let abi = truffle_obj.abi

    let TourToken = new Contract(abi, address);
    console.log("[provider-js] Listening to TourToken at " + address);
    TourToken.events.allEvents({}, (err, event) => {
        if (err) {
            console.log(err)
        }
        else {
            if (event.event == "OrderStarted") {
                executeCallbacks(_callbacks.TourTokenOrder, event.returnValues)
            }
        }
    })
}

module.exports.addBPool = function (BPoolMeta, address) {
    let truffle_ABI_string = fs.readFileSync(BPoolMeta);
    let truffle_obj = JSON.parse(truffle_ABI_string);
    let abi = truffle_obj.abi

    let BPool = new Contract(abi, address);
    console.log("[provider-js] Listening to BPool at " + address);
    BPool.events.allEvents({}, (err, event) => {
        if (err) {
            console.log(err)
        }
        else {
            if (event.event == "LOG_INIT") {
                executeCallbacks(_callbacks.BPool, event.returnValues)
            }
        }
    })
}

module.exports.registerCallback = function (type, cb) {
    switch (type) {
        case 'TourTokenFactory':
            _callbacks.TourTokenFactory.push(cb)
            break;
        case 'BFactory':
            _callbacks.BFactory.push(cb)
            break;
        case 'TourTokenOrder':
            _callbacks.TourTokenOrder.push(cb)
            break;
        case 'BPool':
            _callbacks.BPool.push(cb)
            break;
        default:
            throw new Error("Unknown Type")
    }
}

function executeCallbacks(callbacks, event) {
    callbacks.forEach((element) => {
        element(event)
    })
}