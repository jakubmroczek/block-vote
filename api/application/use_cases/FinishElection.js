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

async function removeElectionFromTheVoters(election, voterRepository) {
  const { id, publicKeys } = election;


  // TODO: Should I refactor this?
  for (let index = 0; index < publicKeys.length; index += 1) {
    const publicKey = publicKeys[index];
    const voter = await voterRepository.findByPublicKey(publicKey);

    const { electionIDs } = voter;

    // Removing election from the list
    const electionIdIndex = electionIDs.indexOf(id);
    if (electionIdIndex >= 0) {
      electionIDs.splice(electionIdIndex, 1);
    }

    voter.electionIDs = electionIDs;

    await voterRepository.merge(voter);
  }
}

module.exports = async (user, { userRepository, voterRepository, electionRepository }) => {
  // TODO: Make all the data layer changes atomic, if one fails, fail them all

  // TODO: Error handling, everything should be atomic
  // TODO: Move to a distinct function
  const { email } = user;
  const domainUser = await userRepository.findByEmail(email);
  const { electionID } = domainUser;  
  const persistedElectionID = Object.assign('', electionID);  

  domainUser.electionID = null;
  domainUser.finishedElectionIDs.push(electionID);
  // TODO: Error handling
  await userRepository.merge(domainUser);
  
  const election = await electionRepository.get(persistedElectionID);
  const { smartContract } = election;
  const { abi, address } = smartContract;

  // TODO: the candidates should be passed here as a parameter or there should be smoething like blokcchian repository?
  // TODO: Error handling
  const candidates = await queryCandidates(abi, address);

  election.status = 'Finished';

  // TODO: Error handling
  await electionRepository.merge(election);

  // TODO: Should I use differnet use case?
  // Removing the electionIDs from the public keys.
  await removeElectionFromTheVoters(election, voterRepository);

  // TODO: Is this okay? Can I mix use cases in DDD
  const SendElectionFinishMail = require('./SendElectionFinishMail.js');

  // TODO: Returns nothig, improve error hanlding
  await SendElectionFinishMail(electionID, candidates, { electionRepository });

  return true;
};
