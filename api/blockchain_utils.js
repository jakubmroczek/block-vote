const solc = require('solc');
const fs = require('fs');
const path = require('path');
const util = require('util');

function electionSmartContractTemplate() {
  return fs.readFileSync(path.resolve(__dirname, 'contracts', 'Election.template.sol'), 'utf8');
}

function format(template, election) {
  // Register public key signature
  // One param public key - provided as bytes, string without apostophe
  const registerNewVoterSignature = 'registerNewVoter()';
  // Add candidate signature
  // 2 args - String, String
  const addNewCandidateSignature = 'addNewCandidate()';

  // Generate public keys method calls
//   const registerMethodCalls = registerNewVoterSignature.map();
    const registerMethodCalls = 'pytsio';

  // Generate add candidate signature
//   const addNewCandidateCalls = addNewCandidateSignature.map();
    const addNewCandidateCalls = 'misio';

  // We must format the template here
  const smartContract = util.format(template, addNewCandidateCalls, registerMethodCalls);

  console.log(smartContract);

  return smartContract;
}

function generateElectionSmartContract(election) {
  const template = electionSmartContractTemplate();
  return format(template, election);
}

// Compiles the eleciton with the solc and returns the JSON bytecodes
function compile(election) {
  // TODO: Format the election template

  const electionSmartContract = generateElectionSmartContract(election);

  console.log('Formatted smart contract');
  console.log(electionSmartContract);


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

  const output = JSON.parse(solc.compile(JSON.stringify(input)));

  console.log('Output is');
  console.log(output);


  // `output` here contains the JSON output as specified in the documentation
  for (const contractName in output.contracts['Election.sol']) {
    console.log(
      `${contractName
      }: ${
        output.contracts['Election.sol'][contractName].evm.bytecode.object}`,
    );
  }

  console.log(output);

  return 'dummy json';
}

module.exports = { compile };
