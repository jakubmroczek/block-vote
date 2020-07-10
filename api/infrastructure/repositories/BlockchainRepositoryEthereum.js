/* eslint-disable class-methods-use-this */
const Web3 = require('web3');
const environment = require('../config/environment.js');
const ElectionSmartContract = require('../../domain/ElectionSmartContract.js');

module.exports = class {
  // TODO: should abi belong here? should not we redesing it?
  // abi is unparsed
  async findByAddress(address, abi) {
    let httpProviderURL = environment.blockchain.httpProvider.url;
    
    // TODO: Remove this, or how to handle this
    if (httpProviderURL === undefined) {
      httpProviderURL = 'http://localhost:8545';
    }

    const web3 = new Web3(httpProviderURL);

    const contractABI = JSON.parse(abi);
    const contract = new web3.eth.Contract(contractABI, address);

    const candidates = await contract.methods.getCandidates().call((err, ethereumCandidates) => {
      const candidatesArray = [];
      for (let i = 0; i < ethereumCandidates.length; i += 1) {
        candidatesArray.push(
          {
            name: ethereumCandidates[i].name,
            surname: ethereumCandidates[i].surname,
            id: ethereumCandidates[i].id,
            index: i,
          },
        );
      }
      return candidatesArray;
    });

    const title = await contract.methods.getTitle().call((err, titleStr) => titleStr);

    return new ElectionSmartContract(address, title, candidates);
  }
};
