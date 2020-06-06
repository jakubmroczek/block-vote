const mongo = require('mongodb');
const { getDb } = require('./db.js');

const COLLECTION = 'candidates';

async function list() {
  const db = getDb();
  const filter = {};
  const issues = await db.collection(COLLECTION).find(filter).toArray();
  return issues;
}

async function add(_, { candidate }) {
  // TODO: validation
  const db = getDb();
  const result = await db.collection(COLLECTION).insertOne(candidate);
  const savedCandidate = await db.collection(COLLECTION)
    .findOne({ _id: result.insertedId });
  return savedCandidate;
}

async function update(_, { _id, changes }) {
  // TODO: validation check if ID is there
  const db = getDb();
  const filter = { _id: mongo.ObjectID(_id) };

  if (changes.name || changes.surname) {
    const candidate = await db.collection(COLLECTION).findOne(
      filter,
    );
    Object.assign(candidate, changes);
    // TODO: Validate
  }

  await db.collection(COLLECTION).updateOne(filter, { $set: changes });
  const savedCandidate = await db.collection(COLLECTION).findOne(filter);
  return savedCandidate;
}

async function remove(_, { _id }) {
  const db = getDb();
  const filter = { _id: mongo.ObjectID(_id) };
  const candidate = await db.collection(COLLECTION).findOne(filter);
  if (!candidate) {
    return false;
  }
  const result = await db.collection(COLLECTION).removeOne(filter);
  return result.deletedCount === 1;
}

module.exports = {
  list, add, update, remove,
};
