import React from 'react';
import { Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import ElectionTitleForm from './ElectionTitleForm.jsx';
import CandidateList from './CandidateList.jsx';
import ParticipantList from './ParticipantList.jsx';

export default function ElectionSetUpPanel() {
  return (
    <>
      <ElectionTitleForm />
      <hr />
      <CandidateList />
      <hr />
      <ParticipantList />
      <hr />
      <LinkContainer to="/panel/lobby">
        <Button>Next (make your voters register public keys)</Button>
      </LinkContainer>
    </>
  );
}
