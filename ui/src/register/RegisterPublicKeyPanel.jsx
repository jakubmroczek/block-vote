import React from 'react';
import { Form, Button } from 'react-bootstrap';

{ /* <Form.Group controlId="publicKey">
<Form.Label>Public key</Form.Label>
<Form.Control type="text" placeholder="Enter your Ethereum public keys" />
<Form.Text className="text-muted">
  Ethereum public key (look up the network name in the email).
</Form.Text>
</Form.Group>
<Button variant="primary" type="submit">
Submit
</Button> */ }

export default function RegisterPublicKeyPanel() {
  const onSecretTokenSubmit = () => {
    alert('secret token submitted');
  };

  return (
    <Form>
      <Form.Group controlId="secretToken">
        <Form.Label>Secret token</Form.Label>
        <Form.Control type="text" placeholder="Enter secret token" />
        <Form.Text className="text-muted">
          Secret token was send in the email.
        </Form.Text>
      </Form.Group>
      <Button variant="primary" type="submit" onClick={onSecretTokenSubmit}>
        Submit
      </Button>
    </Form>
  );
}
