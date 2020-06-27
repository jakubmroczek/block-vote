import * as React from 'react';
import { Card } from '@material-ui/core';

// TODO: Fix this
import ElectionTitle from '../../../containers/Election/ElectionTitle/ElectionTitle.js';
import CandidatesList from '../../../containers/Candidates/CandidatesList/CandidateList.js';
import SendVoteButton from '../../../containers/SendVoteButton.js';

function Election() {
  return (
    <Card>
      <ElectionTitle />
      <CandidatesList />
      <SendVoteButton />
    </Card>
  );
}

// TODO: Is this proper
export default Election;
