const { getDb } = require('./db.js');

const COLLECTION = 'users';

async function get(_, { username }) {
  const db = getDb();
  const filter = { username };
  const user = await db.collection(COLLECTION).findOne(filter);
  return user;
}

module.exports = {
  get,
};
