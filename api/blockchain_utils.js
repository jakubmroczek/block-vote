const solc = require('solc');
const fs = require('fs');
const path = require('path');
const Web3 = require('web3');

function readElectionSmartContractSourceCode() {
  return fs.readFileSync(path.resolve(__dirname, 'contracts', 'Election.sol'), 'utf8');
}

// Compiles the eleciton with the solc and returns the whole solc output
function compile() {
  const electionSmartContract = readElectionSmartContractSourceCode();
  const input = {
    language: 'Solidity',
    sources: {
      'Election.sol': {
        content: electionSmartContract,
      },
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['*'],
        },
      },
    },
  };

  const solcOutput = JSON.parse(solc.compile(JSON.stringify(input)));

  // TODO: Remove the magic strings
  const contract = solcOutput.contracts['Election.sol'].Election;
  const { abi, evm } = contract;
  const { bytecode } = evm;

  return { bytecode: JSON.stringify(bytecode), abi: JSON.stringify(abi) };
}

async function queryCandidates(abi, address) {
  // TODO: Get this from database, when reall support e.g for the ethereum or rinkeby
  // TODO: The provider should be written at the contract craetion.
  // TODO: Optional: the user can pass this as a parameter.
  const web3 = new Web3('http://localhost:8545');

  console.log(abi);
  

  const dapptokenContract = new web3.eth.Contract(abi, address);
  this.electionInstance = dapptokenContract;

  //TODO: Only smart contract owner should call this method.

  return this.electionInstance.methods.getCandidates().call((err, ethereumCandidates) => {
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
}

module.exports = { compile, queryCandidates };
