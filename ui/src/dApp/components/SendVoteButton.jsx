import * as React from 'react';

import { Button } from 'react-bootstrap';

export default function SendVoteButton({ onClick }) {
  return (
    <>
      <Button variant="outline-success" onClick={onClick}>
        Vote
      </Button>
    </>
  );
}
