const Election = require('../../domain/Election.js');
const MongooseElection = require('../orm/mongoose/schemas/Election.js');
const ElectionRepository = require('../../domain/ElectionRepository.js');

module.exports = class extends ElectionRepository {
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
      status, title, candidates, participants, publicKeys, secretTokens,
    } = domainElection;
    const mongooseElection = await MongooseElection.findByIdAndUpdate({
      status, title, candidates, participants, publicKeys, secretTokens,
    });
    return new Election(mongooseElection.id, mongooseElection.status, mongooseElection.title, mongooseElection.candidates, mongooseElection.participants,
      mongooseElection.publicKeys, mongooseElection.secretTokens);
  }

  // eslint-disable-next-line class-methods-use-this
  async get(electionId) {
    const mongooseElection = await MongooseElection.findById(electionId);
    return new Election(mongooseElection.id, mongooseElection.status, mongooseElection.title, mongooseElection.candidates, mongooseElection.participants,
      mongooseElection.publicKeys, mongooseElection.secretTokens);
  }
};
