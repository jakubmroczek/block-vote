const solc = require('solc');
const fs = require('fs');
const path = require('path');

// Compiles the eleciton with the solc and returns the JSON bytecodes
function compile(election) {
  // TODO: Format the election template
  
  const content = fs.readFileSync(path.resolve(__dirname, 'contracts', 'Election.sol'), 'utf8');
  const input = {
    language: 'Solidity',
    sources: {
      'Election.sol': {
        content,
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

  // `output` here contains the JSON output as specified in the documentation
  for (const contractName in output.contracts['test.sol']) {
    console.log(
      `${contractName
      }: ${
        output.contracts['test.sol'][contractName].evm.bytecode.object}`,
    );
  }

  console.log(output);

  return 'dummy json';
}

module.exports = { compile };
