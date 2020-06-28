const Voter = require('../../domain/Voter.js');
const MongooseVoter = require('../orm/mongoose/schemas/Voter.js');
const VoterRepository = require('../../domain/VoterRepository.js');

module.exports = class extends VoterRepository {
  // eslint-disable-next-line class-methods-use-this
  async persist(voterEntity) {
    const { publicKey, electionIDs } = voterEntity;
    const mongooseVoter = new MongooseVoter({ publicKey, electionIDs });
    await mongooseVoter.save();
    return new Voter(mongooseVoter.id, mongooseVoter.publicKey, mongooseVoter.electionIDs);
  }

  // TODO: Check if this should not be the voterId
  // eslint-disable-next-line class-methods-use-this
  async findByPublicKey(publicKey) {
    // TODO: Make this be in lower case by default    
    const filter = { publicKey: publicKey.toLowerCase() };
    //TODO: findOne because support for one.
    const mongooseVoter = await MongooseVoter.findOne(filter);    
    return new Voter(mongooseVoter.id, mongooseVoter.publicKey, mongooseVoter.electionIDs);
  }
};
