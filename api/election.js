const mongo = require('mongodb');
const generator = require('generate-password');
const { getDb } = require('./db.js');

const blockchainUtils = require('./blockchain_utils.js');

const COLLECTION = 'elections';

async function create(_1, _2, { user }) {
  const db = getDb();
  const { username } = user;

  const election = {
    status: 'New',
    title: '',
    candidates: [],
    participants: [],
    publicKeys: [],
    secretTokens: [],
  };

  const result = await db.collection(COLLECTION).insertOne(election);
  const savedElection = await db.collection(COLLECTION).findOne({ _id: result.insertedId });
  await db.collection('users').updateOne({ username }, { $push: { electionIDs: result.insertedId } });
  return savedElection;
}

async function list(_1, _2, { user }) {
  const db = getDb();
  const { username } = user;
  const dbUser = await db.collection('users').findOne({ username });
  const { electionIDs } = dbUser;
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
  
  //TODO: Fix problem with handling nulls e.g 
  if (changes.title
    || changes.candidates
    || changes.participants
    || changes.secretTokens
    || changes.smartContract.address) {
    const election = await db.collection(COLLECTION).findOne(filter);
    Object.assign(election, changes);
  }
  await db.collection(COLLECTION).updateOne(filter, { $set: changes });
  const savedElection = await db.collection(COLLECTION).findOne(filter);
  return savedElection;
}

// TODO: Never used
async function remove(_, { id }, { user }) {
  const db = getDb();
  const { username } = user;
  const filter = { _id: mongo.ObjectID(id) };
  const result = await db.collection(COLLECTION).removeOne(filter);
  await db.collection('users').updateOne(
    { username },
    { $pull: { electionIDs: { id } } },
  );
  return result.deletedCount === 1;
}

// TODO: When 3 layer atchiture move to different layer
// Ensures that there is no conflicts between tokens
function generateSecretTokens(quantity) {
  let i = quantity;
  const secretTokens = [];
  while (i > 0) {
    const secretToken = generator.generate({
      length: 32,
      numbers: true,
    });
    const index = secretTokens.indexOf(secretToken);        
    if (index === -1) {
      i -= 1;
      secretTokens.push(secretToken);
    }
  }
  return secretTokens;
}

// TODO: Not CRUD operation, where is should be?
// TODO: When 3 layered architecutre - move to service layer
async function setElectionInPublicKeyRegisterationStage(_, { id }) {
  const electionDB = await get({}, { id });

  const status = 'Registration';
  const { participants } = electionDB;

  const { length } = participants;
  const secretTokens = generateSecretTokens(length);
  
  const changes = { status, participants, secretTokens };
  const savedElection = await update({}, { id, changes });
  return savedElection;
}

async function deployElection(_, { id }) {
  // Returns abi and bytecode
  const smartContract = blockchainUtils.compile();
  const changes = { smartContract, status: 'Deployed' };
  const updatedElection = await update({}, { id, changes });
  return updatedElection;
}

module.exports = {
  create, list, get, update, remove, setElectionInPublicKeyRegisterationStage, deployElection,
};
