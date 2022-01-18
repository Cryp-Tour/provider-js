const Web3 = require('web3')
var Contract = require('web3-eth-contract')

const _callbacks = []
module.exports.Contract = undefined
module.exports.Tokens = []

module.exports.init = function (provider, abi, contractAddress) {
    //let web3 = new Web3(provider);
    Contract.setProvider(provider);
    module.exports.Contract = new Contract(abi, contractAddress);
    console.log("[provider-js] Listening to Events at " + contractAddress);
    module.exports.Contract.events.allEvents({}, (err, event) => {
        console.log(event)
        if (err) {
            console.log(err)
        }
        else {
            module.exports.Tokens.push(event.address);
            executeCallbacks(err, event)
        }
    })
}


module.exports.registerCallback = function (cb) {
    _callbacks.push(cb)
}

function executeCallbacks(err, event) {
    _callbacks.forEach((element) => {
        element(err, event)
    })
}

executeCallbacks()