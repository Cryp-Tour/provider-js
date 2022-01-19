const provider = require('../src/index');
const fs = require('fs');
var assert = require('assert');

describe("Provider", () => {

    let truffle_ABI_string = fs.readFileSync('../contracts/build/contracts/TourTokenFactory.json');
    let truffle_obj = JSON.parse(truffle_ABI_string);
    let ABI = truffle_obj.abi
    let address = truffle_obj.networks['5777'].address
    provider.init('ws://localhost:7545', ABI, address)
    provider.registerCallback((err, event) => {
        if (err) {
            console.log(err)
        }
        else {
            console.log(event)
        }
    })

    it('Provider.Contract should not be undefined', () => {
        assert.notStrictEqual(undefined, provider.Contract);
    })
})
