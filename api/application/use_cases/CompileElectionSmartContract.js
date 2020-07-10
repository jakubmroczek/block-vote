const fs = require('fs');
const path = require('path');
const solc = require('solc');

function readElectionSmartContractSourceCode() {
  const smartContractPath = path.join(__dirname, '../../');
  return fs.readFileSync(path.resolve(smartContractPath, 'contracts', 'Election.sol'), 'utf8');
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

  const contract = solcOutput.contracts['Election.sol'].Election;
  const { abi, evm } = contract;
  const { bytecode } = evm;

  return { bytecode: JSON.stringify(bytecode), abi: JSON.stringify(abi) };
}

module.exports = async (electionID, { electionRepository }) => {
  const election = await electionRepository.get(electionID);
  election.smartContract = compile();
  const result = await electionRepository.merge(election);
  return result;
};
