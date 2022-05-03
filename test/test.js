const provider = require('../src/provider');

provider.setNetworkId('5777')
provider.setProviderURL('ws://127.0.0.1:7545')
provider.initTourTokenFactoryListener('../../contracts/build/contracts/TourTokenFactory.json')
provider.initBFactoryListener('../../contracts/build/contracts/BFactory.json')

provider.registerCallback("TourTokenOrder", (event) => {
    console.log(event)
})

provider.registerCallback("TourTokenFactory", (event) => {
    console.log(event)
    provider.addTT('../../contracts/build/contracts/TourTokenTemplate.json', event.tokenAddress)
})

provider.registerCallback("BFactory", (event) => {
    console.log(event)
    provider.addBPool('../../contracts/build/contracts/BPool.json', event.pool)
})

provider.registerCallback("BPool", (event) => {
    console.log(event)
})
