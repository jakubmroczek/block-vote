/* eslint-disable class-methods-use-this */
const User = require('../../domain/User');
const MongooseUser = require('../orm/mongoose/schemas/User');
const UserRepository = require('../../domain/UserRepository');

module.exports = class extends UserRepository {
  async persist(userEntity) {
    const { email, electionIDs } = userEntity;
    const mongooseUser = new MongooseUser({ email, electionIDs });
    await mongooseUser.save();
    return new User(mongooseUser.id, mongooseUser.email, mongooseUser.electionIDs);
  }

  async merge(userEntity) {
    const { id, email, electionIDs } = userEntity;
    const mongooseUser = MongooseUser.findByIdAndUpdate(id,  { email, electionIDs } );
    return new User(mongooseUser.id, mongooseUser.email, mongooseUser.electionIDs);
  }

  async findByEmail(email) {
    const mongooseUser = await MongooseUser.findOne({ email });
    return new User(mongooseUser.id, mongooseUser.email, mongooseUser.electionIDs);
  }

};
