import React from 'react';
import {
  Navbar, Nav, Button,
} from 'react-bootstrap';
import UserContext from './UserContext.js';
import Contents from './Contents.jsx';

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

export default class Page extends React.Component {
  constructor() {
    super();
    this.state = {
      user: { signedIn: false, username: '' },
    };
  }

  render() {
    const { user } = this.state;

    if (user.signedIn) {
      return (
        <>
          <NavBar />
          <UserContext.Provider value={user}>
            <Contents />
          </UserContext.Provider>
        </>
      );
    }
    return (
      <>
        <Contents />
      </>
    );
  }
}
