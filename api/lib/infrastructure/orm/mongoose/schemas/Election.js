const mongoose = require('../mongoose');

const electionSchema = new mongoose.Schema({
  status:,
  title: String,
  candidates:,
  participants:
  publicKeys:
  secretTokens:,
  smartContract:,
});

module.exports = mongoose.model('Election', electionSchema);
