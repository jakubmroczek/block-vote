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
