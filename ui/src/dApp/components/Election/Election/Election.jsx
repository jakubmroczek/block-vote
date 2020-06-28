import * as React from 'react';

import { Card } from 'react-bootstrap';

import ElectionTitle from '../../Election/ElectionTitle/ElectionTitle.jsx';
import CandidatesList from '../../Candidates/CandidateList/CandidatesList.jsx';

function Election({ title, candidates }) {
  return (
    <Card className="text-center">
      <ElectionTitle title={title} />
      <CandidatesList candidates={candidates} />
    </Card>
  );
}

// TODO: Is this proper
export default Election;
