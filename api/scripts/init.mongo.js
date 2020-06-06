const candidatesDB = [
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
];

const participantDB = [
  {
    email: 'small@gmail.com',
  },
  {
    email: 'johny@yahoo.com',
  },
  {
    email: 'tuesday@outlook.com',
  },
];

/* global db print */
/* eslint no-restricted-globals: "off" */
db.candidates.remove({});
db.candidates.insertMany(candidatesDB);
const candidateCount = db.issues.count();
print('Inserted', candidateCount, 'candidates');

db.candidates.createIndex({ name: 1 });
db.candidates.createIndex({ surname: 1 });

db.participants.remove({});
db.participants.insertMany(participantDB);
const participantCount = db.participants.count();
print('Inserted', participantCount, 'participants');

db.participants.createIndex({ email: 1 });
