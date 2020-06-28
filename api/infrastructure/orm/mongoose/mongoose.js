require('dotenv').config();
const mongoose = require('mongoose');
const environment = require('../../config/environment');

//TODO: Get this from environmnet.database
const url = process.env.DB_URL || 'mongodb://localhost/blockvote';
mongoose.connect(url, { useNewUrlParser: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('connected to MongoDB database!')
});

module.exports = mongoose;
