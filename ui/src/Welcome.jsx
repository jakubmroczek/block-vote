import React from 'react';
import {
  Button, Figure,
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import NavBar from './NavBar.jsx';

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

export default function Welcome({ setUser, history }) {
  return (
    <>
      <NavBar setUser={setUser} history={history} />
      <Logo />
      <LinkContainer to="/vote">
        <Button>
          Vote
        </Button>
      </LinkContainer>
    </>
  );
}
