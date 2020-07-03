import React from 'react';
import { Navbar } from 'react-bootstrap';

// TODO: NavBar without sign in option, reuse this in NavBar.jsx
export default function RawNavBar() {
  return (
      <Navbar bg="light" expand="lg">
        <Navbar.Brand>
          <img
            src="/logo.svg"
            width="30"
            height="30"
            className="d-inline-block align-top"
            alt="BlockVote logo"
          />
          {' '}
          BlockVote
        </Navbar.Brand>
      </Navbar>
  );
}
