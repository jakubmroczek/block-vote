const solc = require('solc');
const fs = require('fs');
const path = require('path');

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

  console.log(solcOutput);

  // TODO: Remove the magic strings
  const contract = solcOutput.contracts['Election.sol'].Election;
  const { abi, evm } = contract;
  const { bytecode } = evm;

  return { bytecode: JSON.stringify(bytecode), abi: JSON.stringify(abi) };
}

module.exports = { compile };
