import * as React from 'react';

import { Card } from 'react-bootstrap';

import CandidatesList from './CandidatesList.jsx';

function ElectionTitle({ title }) {
  return (
    <h1>{title}</h1>
  );
}

export default function Election({ title, candidates }) {
  return (
    <Card className="text-center">
      <ElectionTitle title={title} />
      <CandidatesList candidates={candidates} />
    </Card>
  );
}
