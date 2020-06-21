const usersDB = [
  {
    username: 'jakubmroczek2@gmail.com',
    elections: [],
  },
  {
    username: 'blockvote.bot@gmail.com',
    elections: [],
  },
];

/* global db print */
/* eslint no-restricted-globals: "off" */
db.users.remove({});
db.users.insertMany(usersDB);
const usersCount = db.users.count();

print('Inserted', usersCount, 'candidates');

db.users.createIndex({ username: 1 });

const election = {
  status: 'New',
  title: 'Election to student government',
  candidates: [
    {
      name: 'Marek',
      surname: 'Kraśko',
    },
    {
      name: 'Michał',
      surname: 'Kodłubański',
    },
    {
      name: 'Krystian',
      surname: 'Andrzejewski',
    },
    {
      name: 'Maciek',
      surname: 'Moszczyński',
    },
  ],
  participants: [
    {
      email: 'blockvote.bot@gmail.com',
    },
    {
      email: 'jakubmroczek2@gmail.com',
    },
  ],
  publicKeys: [],
  normalizedPublicKeys: [],
};

db.elections.remove({});
const insertedElection = db.elections.insertOne(election);
const electionsCount = db.elections.count();
print('Inserted', electionsCount, 'elections');

// TODO: Index on election?

db.users.updateOne({ username: 'jakubmroczek2@gmail.com' }, { $push: { elections: insertedElection.insertedId } });
