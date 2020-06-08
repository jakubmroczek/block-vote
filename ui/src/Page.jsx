import React from 'react';
// import {
// Navbar, Nav, NavItem, OverlayTrigger,
// NavDropdown, MenuItem, Tooltip,
// } from 'react-bootstrap';
import {
  Navbar, Nav, NavDropdown, Form, FormControl, Button,
} from 'react-bootstrap';
import Contents from './AppContents.jsx';

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
      <Contents />
    </div>
  );
}
