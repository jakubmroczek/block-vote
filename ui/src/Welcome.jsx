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
        alt="BlockVote.logo"
        src="/logo.svg"
      />
    </Figure>
  );
}

// TODO: Rename to welcome page
export default function Welcome() {
  return (
    <>
      <Logo />
      <LinkContainer to="/vote">
        <Button>
          Vote
        </Button>
      </LinkContainer>
    </>
  );
}
