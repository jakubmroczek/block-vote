const mongoose = require('../mongoose');

const voterSchema = new mongoose.Schema({
  // TODO: Investigate introducting own type, remember that it is normalized by toLowerCase()
  publicKey: {
    type: String,
    lowercase: true,
    validate: {
      validator(str) {
        return /^0x[a-fA-F0-9]{40}$/.test(str);
      },
      message: props => `${props.value} is invalid public key`,
    },
    required: [true, 'Public key is required'],
  },
  // TODO: Check if I can provide different type here [ID!]!
  electionIDs: [String],
});

module.exports = mongoose.model('Voter', voterSchema);
