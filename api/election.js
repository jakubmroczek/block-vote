const mongo = require('mongodb');
const { getDb } = require('./db.js');

const COLLECTION = 'elections';

async function create(_, { owner }) {
  const db = getDb();

  const election = {
    owner,
    status: 'New',
    title: '',
    candidates: [],
    participants: [],
  };

  const result = await db.collection(COLLECTION).insertOne(election);
  const savedElection = await db.collection(COLLECTION).findOne({ _id: result.insertedId });
  return savedElection;
}

async function list(_, { owner }) {
  const db = getDb();
  const filter = { owner };
  const elections = await db.collection(COLLECTION).find(filter).toArray();
  return elections;
}

async function get(_, { owner, id }) {
  const db = getDb();
  const filter = { $and: [{ owner }, { _id: mongo.ObjectID(id) }] };
  const election = await db.collection(COLLECTION).findOne(filter);
  return election;
}

async function update(_, { owner, id, changes }) {
  const db = getDb();
  const filter = { $and: [{ owner }, { _id: mongo.ObjectID(id) }] };
  if (changes.title || changes.candidates || changes.participants) {
    const election = await db.collection(COLLECTION).findOne(filter);
    Object.assign(election, changes);
  }
  await db.collection(COLLECTION).updateOne(filter, { $set: changes });
  const savedIssue = await db.collection(COLLECTION).findOne(filter);
  return savedIssue;
}

async function remove(_, { owner, id }) {
  const db = getDb();
  const filter = { $and: [{ owner }, { _id: mongo.ObjectID(id) }] };
  const result = await db.collection(COLLECTION).removeOne(filter);
  return result.deletedCount === 1;
}

module.exports = {
  create, list, get, update, remove,
};
