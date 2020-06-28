import * as React from 'react';
import { Card } from 'react-bootstrap';
import CircularDeterminate from './CircularDeterminate.jsx';

// TODO: Move title to the constants
function ElectionFetching() {
  return (
    <Card className="text-center">
      <Card.Header as="h5">Connecting to the blockchain</Card.Header>
      <Card.Body>
        <CircularDeterminate />
      </Card.Body>
    </Card>
  );
}

// TODO: Is this needed
export default ElectionFetching;
