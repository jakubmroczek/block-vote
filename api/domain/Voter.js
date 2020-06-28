module.exports = class {
  constructor(id = null, publicKey, electionIDs) {
    this.id = id;
    this.publicKey = publicKey.toLowerCase();
    this.electionIDs = electionIDs;
  }
};
