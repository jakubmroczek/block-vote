import React from 'react';
import {
  Button, Figure,
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

function Logo() {
  return (
    <Figure>
      <Figure.Image
        width={171}
        height={180}
        alt="171x180"
        src="/logo.png"
      />
    </Figure>
  );
}

export default function Welcome() {
  return (
    <div>
      <Logo />

      <LinkContainer to="/vote">
        <Button>
          Vote
        </Button>
      </LinkContainer>
      {' '}
      <LinkContainer to="/panel">
        <Button>
          Log-in
        </Button>
      </LinkContainer>
    </div>
  );
}
