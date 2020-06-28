/* global db print */
/* eslint no-restricted-globals: "off" */
db.users.remove({});
db.elections.remove({});
db.voters.remove({});

// TODO: Check why do we need indices and why to use them
db.users.createIndex({ username: 1 });
