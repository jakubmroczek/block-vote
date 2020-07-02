/* eslint-disable class-methods-use-this */
const User = require('../../domain/User');
const MongooseUser = require('../orm/mongoose/schemas/User');
const UserRepository = require('../../domain/UserRepository');

module.exports = class extends UserRepository {
  async persist(userEntity) {
    const { email, electionID, finishedElectionIDs } = userEntity;
    const mongooseUser = new MongooseUser({ email, electionID, finishedElectionIDs });
    await mongooseUser.save();
    return new User(mongooseUser.id, mongooseUser.email, mongooseUser.electionID, mongooseUser.finishedElectionIDs);
  }

  async merge(userEntity) {
    const {
      id, email, electionID, finishedElectionIDs,
    } = userEntity;
    const mongooseUser = await MongooseUser.findByIdAndUpdate(id, { email, electionID, finishedElectionIDs });
    return new User(mongooseUser.id, mongooseUser.email, mongooseUser.electionID, mongooseUser.finishedElectionIDs);
  }

  async findByEmail(email) {
    const mongooseUser = await MongooseUser.findOne({ email });

    // TODO: Maybe better error hanling
    if (mongooseUser === null) {
      return null;
    }
    return new User(mongooseUser.id, mongooseUser.email, mongooseUser.electionID, mongooseUser.finishedElectionIDs);
  }
};
