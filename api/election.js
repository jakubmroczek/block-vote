const mongo = require('mongodb');
const generator = require('generate-password');
const { getDb } = require('./db.js');

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
  };

  const result = await db.collection(COLLECTION).insertOne(election);
  const savedElection = await db.collection(COLLECTION).findOne({ _id: result.insertedId });
  await db.collection('users').updateOne({ username }, { $push: { elections: result.insertedId } });
  return savedElection;
}

async function list(_1, _2, { user }) {
  const db = getDb();
  const { username } = user;
  const dbUser = await db.collection('users').findOne({ username });
  const electionIDs = dbUser.elections;
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

async function remove(_, { id }, { user }) {
  const db = getDb();
  const { username } = user;
  const filter = { _id: mongo.ObjectID(id) };
  const result = await db.collection(COLLECTION).removeOne(filter);
  await db.collection('users').updateOne(
    { username },
    { $pull: { elections: { id } } },
  );
  return result.deletedCount === 1;
}

// TODO: Not CRUD operation, wher is should be?
async function setElectionInPublicKeyRegisterationStage(_, { id }) {
  const electionDB = await get({}, { id });

  const status = 'PublicKeyRegistration';
  const { participants } = electionDB;

  // Lame for loop
  const { length } = participants;
  for (let i = 0; i < length; i += 1) {
    const participant = participants[i];
    const secretToken = generator.generate({
      length: 32,
      numbers: true,
    });
    participants[i] = {
      ...participant,
      secretToken,
    };
  }

  const changes = { status, participants };
  const savedElection = await update({}, { id, changes });
  return savedElection;
}

module.exports = {
  create, list, get, update, remove, setElectionInPublicKeyRegisterationStage,
};
