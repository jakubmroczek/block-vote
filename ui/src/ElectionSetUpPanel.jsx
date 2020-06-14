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
      title: '',
      candidates: [],
      participants: [],
    };

    this.deploy = this.deploy.bind(this);
  }

  componentDidMount() {
    this.read();
  }

  async read() {
    const query = `query 
    getElection($id: ID!) {
            getElection(id: $id) {
                title
                candidates {
                  name surname
                }  
                participants {
                  email
                }
            }
}`;

    const { id } = this.state;
    const response = await graphQLFetch(query, { id });

    if (response) {
      const { title, candidates, participants } = response.getElection;
      this.setState({ title, candidates, participants });
    } else {
      alert('getElection call failed');
    }
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
    const {
      id, title, candidates, participants,
    } = this.state;

    return (
      <div style={{ display: 'flex', justifyContent: 'center' }} className="mt-1">
        <ElectionTitleForm id={id} title={title} />
        <CandidateList id={id} candidates={candidates} />
        <ParticipantList id={id} participants={participants} />
        <Button onClick={this.deploy} variant="outline-success">Next</Button>
      </div>
    );
  }
}
