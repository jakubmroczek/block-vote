const Voter = require('../../domain/Voter.js');
const MongooseVoter = require('../orm/mongoose/schemas/Voter.js');
const VoterRepository = require('../../domain/VoterRepository.js');

module.exports = class extends VoterRepository {

  async persist(voterEntity) {
    const { firstName, lastName, email, password } = userEntity;
    const mongooseUser = new MongooseUser({ firstName, lastName, email, password });
    await mongooseUser.save();
    return new User(mongooseUser.id, mongooseUser.firstName, mongooseUser.lastName, mongooseUser.email, mongooseUser.password);
  }

  async merge(voterEntity) {
    const { id, firstName, lastName, email, password } = userEntity;
    const mongooseUser = MongooseUser.findByIdAndUpdate(id, { firstName, lastName, email, password });
    return new User(mongooseUser.id, mongooseUser.firstName, mongooseUser.lastName, mongooseUser.email, mongooseUser.password);
  }

  //TODO: Check if this should not be the voterId
  async get(publicKey) {
    const mongooseUser = await MongooseUser.findById(userId);
    return new User(mongooseUser.id, mongooseUser.firstName, mongooseUser.lastName, mongooseUser.email, mongooseUser.password);
  }

};
