const Tx = require('ethereumjs-tx').Transaction;
const Web3 = require('web3');

// TODO: Metamask should take care of it.
// Ganache or Private Ethereum Blockchain
let selectedHost = 'http://127.0.0.1:8545';
const web3 = new Web3(new Web3.providers.HttpProvider(selectedHost));

// object from the backend
// TODO: We must persist the tx somehow, private key should be get from the metamask
// TODO: Rename this
export default function deploy(bytecode, abi, account, pk) {
  const { gasPrice } = web3.eth;
  const gasPriceHex = web3.utils.toHex(gasPrice);
  const gasLimitHex = web3.utils.toHex(6000000);
  const block = web3.eth.getBlock('latest');
  const nonce = web3.eth.getTransactionCount(account, 'pending');
  const nonceHex = web3.utils.toHex(0);

  const tokenContract = new web3.eth.Contract(abi);
  let contractData = null;

  // Prepare the smart contract deployment payload
  // If the smart contract constructor has mandatory parameters, you supply the input parameters like below
  //
  // contractData = tokenContract.new.getData( param1, param2, ..., {
  //    data: '0x' + bytecode
  // });

  console.log(tokenContract);
  const data = `0x${bytecode}`;
  // contractData = tokenContract.new.getData({
  //   ,
  // });

  // Prepare the raw transaction information
  const rawTx = {
    nonce: nonceHex,
    gasPrice: gasPriceHex,
    gasLimit: gasLimitHex,
    data: contractData,
    from: account,
  };

  // Get the account private key, need to use it to sign the transaction later.
  const privateKey = Buffer.from(pk, 'hex');

  const tx = new Tx(rawTx);

  // Sign the transaction
  tx.sign(privateKey);
  const serializedTx = tx.serialize();

  let receipt = null;

  // Submit the smart contract deployment transaction
  web3.eth.sendSignedTransaction(`0x${serializedTx.toString('hex')}`, (err, hash) => {
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
