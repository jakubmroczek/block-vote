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

    // TODO: Check if I need to do this, I bet this is a shallow copy so no.
    voter.electionIDs = electionIDs;

    await voterRepository.merge(voter);
  }
}

module.exports = async (user, { userRepository, voterRepository, electionRepository, blockchainRepository }) => {
  // TODO: Make all the data layer changes atomic, if one fails, fail them all

  // TODO: Error handling, everything should be atomic
  // TODO: Move to a distinct function
  const { email } = user;
  const domainUser = await userRepository.findByEmail(email);
  const { electionID } = domainUser;
  
  const election = await electionRepository.get(electionID);
  const { smartContract } = election;
  const { abi, address } = smartContract;

  domainUser.finishedElectionIDs.push(electionID);
  domainUser.electionID = null;

  // TODO: Error handling
  await userRepository.merge(domainUser);
  
  election.status = 'Finished';

  // TODO: Error handling
  await electionRepository.merge(election);

  // TODO: Should I use differnet use case?
  // Removing the electionIDs from the public keys.
  await removeElectionFromTheVoters(election, voterRepository);

  // TODO: Is this okay? Can I mix use cases in DDD
  const SendFinishMail = require('./SendFinishMail.js');

  const electionSmartContract = await blockchainRepository.findByAddress(address, abi);
  const { candidates } = electionSmartContract;
  
  // TODO: Returns nothig, improve error hanlding
  await SendFinishMail(electionID, candidates, { electionRepository });

  return true;
};
