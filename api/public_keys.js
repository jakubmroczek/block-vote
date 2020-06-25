const { getDb } = require('./db.js');

const COLLECTION = 'publicKeys';

async function create(publicKey, electionID) {
  //TODO: Check if the public key does not exist
  //TODO: Match the mongoDB index with the public key   
  const db = getDb();

  //TODO: Support for the multiple election   
  const newPublicKey = {
    publicKey: publicKey.toLowerCase(),
    electionIDs: electionID,
  };

  const result = await db.collection(COLLECTION).insertOne(newPublicKey);
  const savedPublicKey = await db.collection(COLLECTION).findOne({ _id: result.insertedId });
  return savedPublicKey;
}

// TODO: Ignoring the MongodDB id
async function get(publicKey) {
  const db = getDb();
  const filter = { publicKey: publicKey.toLowerCase() };
  const pK = await db.collection(COLLECTION).findOne(filter);
  return pK;
}

async function update(publicKey, changes) {}

async function remove(publicKey) {}

module.exports = {
  create, get, update, remove,
};
