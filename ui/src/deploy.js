const Tx = require('ethereumjs-tx').Transaction;
const Web3 = require('web3');

// TODO: Metamask should take care of it.
const web3 = new Web3('http://localhost:8545');

// object from the backend
// TODO: We must persist the tx somehow, private key should be get from the metamask
// TODO: Rename this
export default function deploy(data, abi, account, pk) {
  const { gasPrice } = web3.eth;
  const gasPriceHex = web3.toHex(gasPrice);
  const gasLimitHex = web3.toHex(6000000);
  const block = web3.eth.getBlock('latest');
  const nonce = web3.eth.getTransactionCount(account, 'pending');
  const nonceHex = web3.toHex(nonce);

  const tokenContract = web3.eth.contract(abi);
  let contractData = null;

  // Prepare the smart contract deployment payload
  // If the smart contract constructor has mandatory parameters, you supply the input parameters like below
  //
  // contractData = tokenContract.new.getData( param1, param2, ..., {
  //    data: '0x' + bytecode
  // });

  contractData = tokenContract.new.getData({
    data: `0x${bytecode}`,
  });

  // Prepare the raw transaction information
  const rawTx = {
    nonce: nonceHex,
    gasPrice: gasPriceHex,
    gasLimit: gasLimitHex,
    data: contractData,
    from: account,
  };

  // Get the account private key, need to use it to sign the transaction later.
  const privateKey = new Buffer(pk, 'hex');

  const tx = new Tx(rawTx);

  // Sign the transaction
  tx.sign(privateKey);
  const serializedTx = tx.serialize();

  let receipt = null;

  // Submit the smart contract deployment transaction
  web3.eth.sendRawTransaction(`0x${serializedTx.toString('hex')}`, (err, hash) => {
    if (err) {
      console.log(err); return;
    }

    // Log the tx, you can explore status manually with eth.getTransaction()
    console.log(`Contract creation tx: ${hash}`);

    // Wait for the transaction to be mined
    while (receipt == null) {
      receipt = web3.eth.getTransactionReceipt(hash);

      // Simulate the sleep function
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 1000);
    }

    console.log(`Contract address: ${receipt.contractAddress}`);
    // console.log(`Contract File: ${contract}`);

    // // Update JSON
    // jsonOutput.contracts[contract].contractAddress = receipt.contractAddress;

    // // Web frontend just need to have abi & contract address information
    // const webJsonOutput = {
    //   abi,
    //   contractAddress: receipt.contractAddress,
    // };

    // const formattedJson = JSON.stringify(jsonOutput, null, 4);
    // const formattedWebJson = JSON.stringify(webJsonOutput);

    // // console.log(formattedJson);
    // fs.writeFileSync(jsonFile, formattedJson);
    // fs.writeFileSync(webJsonFile, formattedWebJson);

    // console.log('==============================');
  });

  return true;
}
