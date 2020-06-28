const mongoose = require('../mongoose');

const voterSchema = new mongoose.Schema({
  //TODO: Investigate introducting own type, remember that it is normalized by toLowerCase()
  publicKey: String,
  //TODO: Right now it is a mongodb id, in the future it will be an array of ids
  electionIDs: String,
});

module.exports = mongoose.model('Voter', voterSchema);
