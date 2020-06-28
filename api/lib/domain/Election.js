module.exports = class {
  constructor(id = null,
    status, title, candidates, participants, publicKeys, secretTokens, smartContract = null) {
    this.id = id;
    this.status = status;
    this.title = title;
    this.candidates = candidates;
    this.participants = participants;
    this.publicKeys = publicKeys;
    this.secretTokens = secretTokens;
    this.smartContract = smartContract;
  }
};
