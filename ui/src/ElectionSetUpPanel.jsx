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

    this.state = {
      id: electionID,
    };
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
        <LinkContainer to="/panel/lobby">
          <Button>Next (make your voters register public keys)</Button>
        </LinkContainer>
      </>
    );
  }
}
