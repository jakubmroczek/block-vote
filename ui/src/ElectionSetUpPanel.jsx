import React from 'react';
import { Button } from 'react-bootstrap';

import ElectionTitleForm from './ElectionTitleForm.jsx';
import CandidateList from './CandidateList.jsx';
import ParticipantList from './ParticipantList.jsx';

import graphQLFetch from './graphQLFetch.js';

// TODO: Make it fucntional
export default class ElectionSetUpPanel extends React.Component {
  constructor(props) {
    super(props);

    const { match: { params: { electionID } } } = this.props;

    this.state = {
      id: electionID,
    };

    this.deploy = this.deploy.bind(this);
  }

  async mailUsers() {
    const query = `query sendRegisterPublicKeysMail($id: ID!) {
      sendRegisterPublicKeysMail(id: $id) 
    }`;

    const { id } = this.state;

    const response = await graphQLFetch(query, { id });
    if (!response.sendRegisterPublicKeysMail) {
      alert('Could not send notifications mails');
    }
  }

  // setElectionIntoWaitingForPublicKeysStage
  async deploy() {
    const query = `mutation setElectionIntoPublicKeyWaitingStage($id: ID!) {
      setElectionIntoPublicKeyWaitingStage(id: $id) {
        status
      }
    }`;

    const { id } = this.state;
    const vars = { id };
    const response = await graphQLFetch(query, vars);

    if (response) {
      await this.mailUsers();
      // TODO: Error handling - what is mails were not send?
      const { history } = this.props;
      history.push('/panel/lobby');
    } else {
      alert('Could not go with the election to the further stage');
    }
  }

  render() {
    const { id } = this.state;

    return (
      <>
        <ElectionTitleForm id={id} />
        <hr />
        <CandidateList id={id} />
        <hr />
        <ParticipantList id={id} />
        <hr />
        <Button onClick={this.deploy}>Next (make your voters register public keys)</Button>
      </>
    );
  }
}
