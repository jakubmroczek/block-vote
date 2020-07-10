const mongoose = require('mongoose');
const environment = require('../../config/environment');

const { url } = environment.database;
mongoose.connect(url, { useNewUrlParser: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('connected to MongoDB database!');
});

module.exports = mongoose;
