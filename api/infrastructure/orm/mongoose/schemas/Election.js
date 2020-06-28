const mongoose = require('../mongoose');

const candidateSchema = new mongoose.Schema({
  name: String,
  surname: String,
});

const participantSchema = new mongoose.Schema({
  // TODO: Add some regex, so this is a true email
  email: String,
});

const smartContractSchema = new mongoose.Schema({
  abi: String,
  bytecode: String,
  address: String,
});

const electionSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['New', 'Registration', 'Deployed', 'Finished'],
  },
  title: String,
  candidates: [candidateSchema],
  participants: [participantSchema],
  // TODO: In the future create a schema for this
  publicKeys: [String],
  // TODO: In the future create a schema for this
  secretTokens: [String],
  smartContract: smartContractSchema,
});

module.exports = mongoose.model('Election', electionSchema);
