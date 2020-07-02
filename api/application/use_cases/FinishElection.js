const Web3 = require('web3');

async function queryCandidates(abi, address) {
  // TODO: Get this from database, when reall support e.g for the ethereum or rinkeby
  // TODO: The provider should be written at the contract craetion.
  // TODO: Optional: the user can pass this as a parameter.
  const web3 = new Web3('http://localhost:8545');

  const contractABI = JSON.parse(abi);
  const contract = new web3.eth.Contract(contractABI, address);

  // TODO: Only smart contract owner should call this method.
  return contract.methods.getCandidates().call((err, ethereumCandidates) => {
    const candidatesArray = [];
    for (let i = 0; i < ethereumCandidates.length; i += 1) {
      candidatesArray.push(
        {
          name: ethereumCandidates[i].name,
          surname: ethereumCandidates[i].surname,
          id: ethereumCandidates[i].id,
          index: i,
        },
      );
    }
    return candidatesArray;
  });
}

module.exports = async (user, { userRepository, electionRepository }) => {
  // TODO: Error handling, everything should be atomic
  // TODO: Move to a distinct function
  const { email } = user;
  const domainUser = await userRepository.findByEmail(email);
  const { electionID } = domainUser;
  domainUser.electionID = null;
  domainUser.finishedElectionIDs.push(electionID);

  const election = await electionRepository.get(electionID);
  const { smartContract } = election;
  const { abi, address } = smartContract;

  // TODO: the candidates should be passed here as a parameter or there should be smoething like blokcchian repository?
  // TODO: Error handling
  const candidates = await queryCandidates(abi, address);

  election.status = 'Finished';

  // TODO: Error handling
  await electionRepository.merge(election);

  // TODO: Is this okay? Can I mix use cases in DDD
  const SendElectionFinishMail = require('./SendElectionFinishMail.js');

  // TODO: Returns nothig, improve error hanlding
  await SendElectionFinishMail(electionID, candidates, { electionRepository });

  return true;
};
