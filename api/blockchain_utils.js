const solc = require('solc');

// Compiles the eleciton with the solc and returns the JSON bytecodes
function compile(election) {
  // TODO: Format the election template
  const input = {
    language: 'Solidity',
    sources: {
      'test.sol': {
        content: 'contract C { function f() public { } }',
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
