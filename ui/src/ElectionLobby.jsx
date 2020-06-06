import React from 'react';
import graphQLFetch from './graphQLFetch.js';

async function fetchParticipants() {
  const query = `query {
        participantList {
          _id email
        }
      }`;

  const data = await graphQLFetch(query);
  if (data) {
    return data.participantList;
  }
  alert('Could not fetch participant from the server');
  return undefined;
}

// TODO: Code duplication like in  the CandidateList (participants)
async function sendRegisterPublicKeyMail(to) {
    const query = `query sendRegisterPublicKeysMail($to: [String!]!) {
    sendRegisterPublicKeysMail(to: $to) 
  }`;

  const response = await graphQLFetch(query, { to });
  if (!response.sendRegisterPublicKeysMail) {
    alert('Could not send notifications mails');
  }
}

async function mailParticipants() {
  const participants = await fetchParticipants();
  const to = participants.map(participant => participant.email);
  await sendRegisterPublicKeyMail(to);
}

export default class ElectionLobby extends React.Component {
  constructor() {
    super();
    this.state = {

    };
  }

  componentDidMount() {
    mailParticipants();
  }

  render() {
    return (
      <h1>Please wait for voters to register</h1>
    );
  }
}
