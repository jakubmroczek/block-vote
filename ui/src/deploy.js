// TODO: Rename this
export default function deploy(bytecode, abi, title, candidates, publicKeys, account, web3) {
  const electionContract = new web3.eth.Contract(abi);

  return electionContract.deploy({ data: bytecode, arguments: [title, candidates, publicKeys] })
    .send({
      from: account,
      gas: 1500000,
      gasPrice: '30000000000000',
    }, (error, transactionHash) => {
      console.log(`Error ${error} Transaction hash ${transactionHash}`);
    }) // TODO: Error handling
    .then((newContractInstance) => {
      return newContractInstance.options.address;
    });
}
