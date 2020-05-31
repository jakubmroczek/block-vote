const mongo = require('mongodb');
const { getDb } = require('./db.js');

const COLLECTION = 'participants';

async function list() {
  const db = getDb();
  const filter = {};
  const issues = await db.collection(COLLECTION).find(filter).toArray();
  return issues;
}

async function create(_, { participant }) {
  // TODO: validation
  const db = getDb();
  const result = await db.collection(COLLECTION).insertOne(participant);
  const savedParticipant = await db.collection(COLLECTION)
    .findOne({ _id: result.insertedId });
  return savedParticipant;
}

async function remove(_, { _id }) {
  const db = getDb();
  const filter = { _id: mongo.ObjectID(_id) };
  const participant = await db.collection(COLLECTION).findOne(filter);
  if (!participant) {
    return false;
  }
  const result = await db.collection(COLLECTION).removeOne(filter);
  return result.deletedCount === 1;
}

async function update(_, { _id, changes }) {
  // TODO: validation check if ID is there
  const db = getDb();
  const filter = { _id: mongo.ObjectID(_id) };

  if (changes.email) {
    const participant = await db.collection(COLLECTION).findOne(
      filter,
    );
    Object.assign(participant, changes);
    // TODO: Validate
  }

  await db.collection(COLLECTION).updateOne(filter, { $set: changes });
  const savedParticipant = await db.collection(COLLECTION).findOne(filter);
  return savedParticipant;
}

module.exports = {
  list, create, remove, update,
};
