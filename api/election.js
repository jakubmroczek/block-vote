const { getDb } = require('./db.js');

const COLLECTION = 'elections';

async function get() {
  const db = getDb();
  const filter = {};
  const election = await db.collection(COLLECTION).findOne(filter);
  if (election) {
    return election.title;
  }
  return '';
}

async function update(_, { title }) {
  // TODO: validation check if ID is there
  const db = getDb();
  const filter = {};

  const present = await db.collection(COLLECTION).find(filter).count();
  if (present !== 0) {
    await db.collection(COLLECTION).updateOne(filter, { $set: { title } });
  } else {
    await db.collection(COLLECTION).insertOne({ title });
  }
  const election = await db.collection(COLLECTION).find(filter).limit(1).toArray();
  return election[0].title;
}

module.exports = {
  get, update,
};
