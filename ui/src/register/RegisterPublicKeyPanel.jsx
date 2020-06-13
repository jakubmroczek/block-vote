import React from 'react';
import { Form, Button } from 'react-bootstrap';

export default function RegisterPublicKeyPanel() {
  const onSubmit = (event) => {
    event.preventDefault();
    
    const form = document.forms.registerPublicKey;
    const credentials = {
      secretToken: form.secretToken.value,
      publicKey: form.publicKey.value,
    };
  };

  return (
    <Form name="registerPublicKey">
      <Form.Group controlId="secretToken">
        <Form.Label>Secret token</Form.Label>
        <Form.Control type="text" placeholder="Enter secret token" />
        <Form.Text className="text-muted">
          Secret token was send in the email.
        </Form.Text>
      </Form.Group>
      <Form.Group controlId="publicKey">
        <Form.Label>Public key</Form.Label>
        <Form.Control type="text" placeholder="Enter your Ethereum public keys" />
        <Form.Text className="text-muted">
          Ethereum public key (look up the network name in the email).
        </Form.Text>
      </Form.Group>
      <Button variant="primary" type="submit" onClick={onSubmit}>
        Submit
      </Button>
    </Form>
  );
}
