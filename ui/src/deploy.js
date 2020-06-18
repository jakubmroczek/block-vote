const Tx = require('ethereumjs-tx').Transaction;
const Web3 = require('web3');

// TODO: Metamask should take care of it.
const web3 = new Web3('http://localhost:7545');

// object from the backend
// TODO: We must persist the tx somehow, private key should be get from the metamask
export default function deploy(data, account, privateKey) {
  // TODO: The first param is errror _ log it
  web3.eth.getTransactionCount(account, (err, txCount) => {
    // Smart contract data
    // Create transaction object
    const txObject = {
      nonce: web3.utils.toHex(txCount),
      // How to minimize this
      // Fetch the compiled code from the backend
      gasLimit: web3.utils.toHex(1000000),
      // How to minimize this
      gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
      data,
    };

    // Sign the transaction
    const tx = new Tx(txObject);
    tx.sign(privateKey);
    const serializedTx = tx.serialize();
    const raw = `0x${serializedTx.toString('hex')}`;

    // Broadcast the tranasction
    web3.eth.sendSignedTransaction(raw, (error, txHash) => {
      alert(`error': ${error} \ntxHash: ${txHash}`)
      // Use this txHash to find the contract on Etherscan
    });
  });
}
