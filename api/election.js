const mongo = require('mongodb');
const { getDb } = require('./db.js');

const COLLECTION = 'elections';

async function create(_, { username }) {
  const db = getDb();

  const election = {
    status: 'New',
    title: '',
    candidates: [],
    participants: [],
  };

  const result = await db.collection(COLLECTION).insertOne(election);
  const savedElection = await db.collection(COLLECTION).findOne({ _id: result.insertedId });
  await db.collection('users').updateOne({ username }, { $push: { elections: result.insertedId } });
  return savedElection;
}

async function list(_, { username }) {
  const db = getDb();
  const user = await db.collection('users').findOne({ username });
  const electionIDs = user.elections;
  const elections = await db.collection(COLLECTION).find({ _id: { $in: electionIDs } }).toArray();
  return elections;
}

async function get(_, { id }) {
  const db = getDb();
  const filter = { _id: mongo.ObjectID(id) };
  const election = await db.collection(COLLECTION).findOne(filter);
  return election;
}

async function update(_, { id, changes }) {
  const db = getDb();
  const filter = { _id: mongo.ObjectID(id) };
  if (changes.title || changes.candidates || changes.participants) {
    const election = await db.collection(COLLECTION).findOne(filter);
    Object.assign(election, changes);
  }
  await db.collection(COLLECTION).updateOne(filter, { $set: changes });
  const savedElection = await db.collection(COLLECTION).findOne(filter);
  return savedElection;
}

async function remove(_, { username, id }) {
  const db = getDb();
  const filter = { _id: mongo.ObjectID(id) };
  const result = await db.collection(COLLECTION).removeOne(filter);
  await db.collection('users').updateOne(
    { username },
    { $pull: { elections: { id } } },
  );
  return result.deletedCount === 1;
}

module.exports = {
  create, list, get, update, remove,
};
