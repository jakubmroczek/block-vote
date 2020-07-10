module.exports = {
  async init() {
    // TODO: Add references to the other datbasese
    // Connecting to the MongoDB database.
    require('../orm/mongoose/mongoose');
  }
};
