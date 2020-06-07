import React from 'react';
import {
  Navbar, Nav, Button,
} from 'react-bootstrap';
import UserViewContents from './UserViewContents.jsx';

function NavBar() {
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="#home">BlockVote</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Button variant="outline-success">Log out</Button>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default function Page() {
  return (
    <div>
      <NavBar />
      <UserViewContents />
    </div>
  );
}
