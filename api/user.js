const { getDb } = require('./db.js');

const COLLECTION = 'users';

// TODO: What fields should I have?
async function create(username) {
  // TODO: Make sure that the provided username does not exists
  const db = getDb();

  const user = {
    username,
    electionIDs: [],
  };

  const result = await db.collection(COLLECTION).insertOne(user);
  const savedUser = await db.collection(COLLECTION).findOne({ _id: result.insertedId });
  return savedUser;
}

async function get(username) {
  const db = getDb();
  const filter = { username };
  const user = await db.collection(COLLECTION).findOne(filter);
  return user;
}

// TODO: Implement me with changes and use in election.js
async function update() {
}

module.exports = { create, get };
