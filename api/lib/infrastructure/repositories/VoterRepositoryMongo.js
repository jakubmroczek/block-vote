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
  async getByPublicKey(publicKey) {
    const mongooseVoter = await MongooseVoter.findByPublicKey(publicKey);
    return new Voter(mongooseVoter.id, mongooseVoter.publicKey, mongooseVoter.electionIDs);
  }
};
