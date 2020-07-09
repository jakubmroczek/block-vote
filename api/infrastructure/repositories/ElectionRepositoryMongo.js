const Election = require('../../domain/Election.js');
const MongooseElection = require('../orm/mongoose/schemas/Election.js');

module.exports = class {
  // eslint-disable-next-line class-methods-use-this
  async persist(domainElection) {
    const {
      status, title, candidates, participants, publicKeys, secretTokens,
    } = domainElection;
    const mongooseElection = new MongooseElection({
      status, title, candidates, participants, publicKeys, secretTokens,
    });
    await mongooseElection.save();
    return new Election(mongooseElection.id, mongooseElection.status, mongooseElection.title, mongooseElection.candidates, mongooseElection.participants,
      mongooseElection.publicKeys, mongooseElection.secretTokens);
  }

  // eslint-disable-next-line class-methods-use-this
  async merge(domainElection) {
    const {
      id, status, title, candidates, participants, publicKeys, secretTokens,
      smartContract,
    } = domainElection;
    const mongooseElection = await MongooseElection.findByIdAndUpdate(id, {
      status, title, candidates, participants, publicKeys, secretTokens, smartContract,
    });
    return new Election(mongooseElection.id, mongooseElection.status, mongooseElection.title, mongooseElection.candidates, mongooseElection.participants,
      mongooseElection.publicKeys, mongooseElection.secretTokens, mongooseElection.smartContract);
  }

  // eslint-disable-next-line class-methods-use-this
  async get(electionId) {
    const mongooseElection = await MongooseElection.findById(electionId);
    return new Election(mongooseElection.id, mongooseElection.status, mongooseElection.title, mongooseElection.candidates, mongooseElection.participants,
      mongooseElection.publicKeys, mongooseElection.secretTokens, mongooseElection.smartContract);
  }
};
