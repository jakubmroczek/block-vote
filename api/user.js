const { getDb } = require('./db.js');

const COLLECTION = 'users';

async function create() {
  // TODO: Make sure that the provided username does not exists
}

async function get(_, { username }) {
  const db = getDb();
  const filter = { username };
  const user = await db.collection(COLLECTION).findOne(filter);
  return user;
}

async function update() {

}

module.exports = { create, get };
