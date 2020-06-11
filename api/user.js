const { getDb } = require('./db.js');

const COLLECTION = 'users';

async function get(_1, _2, { user }) {
  const db = getDb();
  const { username } = user;
  const filter = { username };
  const userDB = await db.collection(COLLECTION).findOne(filter);
  return userDB;
}

module.exports = {
  get,
};
