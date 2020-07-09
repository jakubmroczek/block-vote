const Voter = require('../../domain/Voter.js');
const MongooseVoter = require('../orm/mongoose/schemas/Voter.js');

module.exports = class  {
  // eslint-disable-next-line class-methods-use-this
  async persist(voterEntity) {
    const { publicKey, electionIDs } = voterEntity;
    const mongooseVoter = new MongooseVoter({ publicKey, electionIDs });
    await mongooseVoter.save();
    return new Voter(mongooseVoter.id, mongooseVoter.publicKey, mongooseVoter.electionIDs);
  }

  async merge(voterEntity) {
    const { id, publicKey, electionIDs } = voterEntity;
    const mongooseVoter = await MongooseVoter.findByIdAndUpdate(id, { publicKey, electionIDs });
    return new Voter(mongooseVoter.id, mongooseVoter.publicKey, mongooseVoter.electionIDs);
  }

  // TODO: Check if this should not be the voterId
  // eslint-disable-next-line class-methods-use-this
  async findByPublicKey(publicKey) {
    const filter = { publicKey: publicKey.toLowerCase() };
    //TODO: findOne because support for one.
    const mongooseVoter = await MongooseVoter.findOne(filter);

    if (mongooseVoter === null) {
      return null;
    }

    return new Voter(mongooseVoter.id, mongooseVoter.publicKey, mongooseVoter.electionIDs);
  }
};
