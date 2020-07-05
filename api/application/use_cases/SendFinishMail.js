const SendMail = require('./SendMail.js');

// TODO: Get the candidates from the different repo or different use case.
module.exports = async (electionID, candidates, { electionRepository }) => {
  // TODO: Introduce better template
  const html = `<p>The election hosted on the Ethereum blockchain results: <br> ${candidates} </p>`;
  // TODO: Add info about the elction title
  const subject = 'The election results';

  const election = await electionRepository.get(electionID);
  const { participants } = election;

  participants.forEach(async (p) => {
    await SendMail(p.email, subject, html);
  });

  // TODO; Error handling
  return true;
};
