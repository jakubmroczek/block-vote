import * as React from 'react';
import { Card } from 'react-bootstrap';

function ErrorMessage({ messageTitle, message }) {
  return (
    <Card className="text-center">
      <Card.Header as="h5">{messageTitle}</Card.Header>
      <Card.Body>
        {' '}
        {message}
        {' '}
      </Card.Body>
    </Card>
  );
}

// TODO: Is this needed
export default ErrorMessage;
