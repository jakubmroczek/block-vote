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
  // TODO: Right now it is a mongodb id, in the future it will be an array of ids
  electionIDs: String,
});

module.exports = mongoose.model('Voter', voterSchema);
