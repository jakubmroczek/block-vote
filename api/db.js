require('dotenv').config();
const { MongoClient } = require('mongodb');

let db;

async function connectToDb() {
  const url = process.env.DB_URL || 'mongodb://localhost/blockvote';
  const client = new MongoClient(url, { newUrlParser: true });
  await client.connect();
  console.log('Connected to MongoDB at', url);
  db = client.db();
}

function getDb() {
  return db;
}

module.exports = { connectToDb, getDb };
