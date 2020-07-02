module.exports = class {

  constructor(id = null, email, electionID, finishedElectionIDs) {
    this.id = id;
    this.email = email;
    this.electionID = electionID;
    this.finishedElectionIDs = finishedElectionIDs;
  }

};