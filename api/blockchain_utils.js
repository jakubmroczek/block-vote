const solc = require('solc');
const fs = require('fs');
const path = require('path');
const util = require('util');

function electionSmartContractTemplate() {
  return fs.readFileSync(path.resolve(__dirname, 'contracts', 'Election.template.sol'), 'utf8');
}

function format(template, election) {
  const registerNewVoterSignature = 'registerNewVoter(%s);';
  const addNewCandidateSignature = 'addNewCandidate(\"%s\",\"%s\");';

  const { candidates } = election;
  const addNewCandidateCalls = candidates.map(c => util.format(addNewCandidateSignature, c.name, c.surname)).join('\n');

  const { publicKeys } = election;
  const registerMethodCalls = publicKeys.map(pk => util.format(registerNewVoterSignature, pk)).join('\n');

  const smartContract = util.format(template, addNewCandidateCalls, registerMethodCalls);

  return smartContract;
}

function generateElectionSmartContract(election) {
  const template = electionSmartContractTemplate();
  return format(template, election);
}


// Compiles the eleciton with the solc and returns the whole solc output
function compile(election) {
  const electionSmartContract = generateElectionSmartContract(election);
  const input = {
    language: 'Solidity',
    sources: {
      'Election.template.sol': {
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
  const contract = solcOutput.contracts['Election.template.sol'].Election;
  const { abi, evm } = contract;
  const { bytecode } = evm;

  return { bytecode: JSON.stringify(bytecode), abi: JSON.stringify(abi) };
}

module.exports = { compile };
