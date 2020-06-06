import React from 'react';
import { Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import ElectionTitleForm from './ElectionTitleForm.jsx';
import CandidateList from './CandidateList.jsx';
import ParticipantList from './ParticipantList.jsx';

export default class ElectionSetUpPanel extends React.Component {
  constructor() {
    super();
    this.state = {
      owner: 'jakubmroczek',
      id: '5edbec45a687a9fa273deca6',
    };
  }

  render() {
    const { owner, id } = this.state;

    return (
      <>
        <ElectionTitleForm owner={owner} id={id} />
        <hr />
        <CandidateList owner={owner} id={id} />
        <hr />
        <ParticipantList owner={owner} id={id} />
        <hr />
        <LinkContainer to="/panel/lobby">
          <Button>Next (make your voters register public keys)</Button>
        </LinkContainer>
      </>
    );
  }
}
