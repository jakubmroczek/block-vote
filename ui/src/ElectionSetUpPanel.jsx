import React from 'react';
import { Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import ElectionTitleForm from './ElectionTitleForm.jsx';
import CandidateList from './CandidateList.jsx';
import ParticipantList from './ParticipantList.jsx';

// TODO: Make it fucntional
export default class ElectionSetUpPanel extends React.Component {
  constructor(props) {
    super(props);
    
    const { match: { params: { electionID } } } = this.props;

    // TODO: Get if from the props
    this.state = {
      username: 'jakubmroczek',
      id: electionID,
    };
  }

  render() {
    const { username, id } = this.state;

    return (
      <>
        <ElectionTitleForm username={username} id={id} />
        <hr />
        <CandidateList username={username} id={id} />
        <hr />
        <ParticipantList username={username} id={id} />
        <hr />
        <LinkContainer to="/panel/lobby">
          <Button>Next (make your voters register public keys)</Button>
        </LinkContainer>
      </>
    );
  }
}
