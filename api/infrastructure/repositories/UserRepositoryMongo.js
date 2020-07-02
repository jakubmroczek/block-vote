/* eslint-disable class-methods-use-this */
const User = require('../../domain/User');
const MongooseUser = require('../orm/mongoose/schemas/User');
const UserRepository = require('../../domain/UserRepository');

module.exports = class extends UserRepository {
  async persist(userEntity) {
    const { email, electionID } = userEntity;
    const mongooseUser = new MongooseUser({ email, electionID });
    await mongooseUser.save();
    return new User(mongooseUser.id, mongooseUser.email, mongooseUser.electionID);
  }

  async merge(userEntity) {
    const { id, email, electionID } = userEntity;
    const mongooseUser = await MongooseUser.findByIdAndUpdate(id, { email, electionID } );
    return new User(mongooseUser.id, mongooseUser.email, mongooseUser.electionID);
  }

  async findByEmail(email) {
    const mongooseUser = await MongooseUser.findOne({ email });

    //TODO: Maybe better error hanling
    if (mongooseUser === null) {
      return null;
    }
    return new User(mongooseUser.id, mongooseUser.email, mongooseUser.electionID);
  }

};
