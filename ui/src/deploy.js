const Tx = require('ethereumjs-tx').Transaction;
const Web3 = require('web3');


// object from the backend
// TODO: We must persist the tx somehow, private key should be get from the metamask
// TODO: Rename this
export default function deploy(bytecode, abi, electionTitle, account) {
  const selectedHost = 'http://127.0.0.1:8545';
  const web3 = new Web3(new Web3.providers.HttpProvider(selectedHost));

  const electionContract = new web3.eth.Contract(abi);
  
  electionContract.deploy({ data: bytecode, arguments: [ electionTitle ] })
    .send({
      from: account,
      gas: 1500000,
      gasPrice: '30000000000000',
    }, (error, transactionHash) => {
      console.log(`Error ${error} Transaction hash ${transactionHash}`);
    }) // TODO: Error handling
    .then((newContractInstance) => {
      console.log('Got a new instance!!!!');
      console.log(newContractInstance.options.addres);
      return newContractInstance;
    });
}
