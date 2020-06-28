import * as React from 'react';

import { Card } from 'react-bootstrap';

import ElectionTitle from '../../Election/ElectionTitle/ElectionTitle.jsx';
import CandidatesList from '../../Candidates/CandidateList/CandidatesList.jsx';
import SendVoteButton from '../../SendVoteButton.jsx'

function Election() {
  return (
    <Card className="text-center">
      <ElectionTitle />
      <CandidatesList />
      <Card.Footer>
        <SendVoteButton />
      </Card.Footer>
    </Card>
  );
}

// TODO: Is this proper
export default Election;
