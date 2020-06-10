import React from 'react';
import {
  Navbar, Nav, Button,
} from 'react-bootstrap';
import UserViewContents from './UserViewContents.jsx';

function NavBar({ user, onUserChange }) {
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="#home">BlockVote</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Navbar.Text>
          Signed in as:
          {' '}
          {user.username}
        </Navbar.Text>
        <Nav className="mr-auto">
          <Button variant="outline-success">Log out</Button>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default class UserViewPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { user: { signedId: false } };

    this.onUserChange = this.onUserChange.bind(this);
  }

  async componentDidMount() {
    const apiEndpoint = window.Event.UI_AUTH_ENDPOINT;
    const response = await fetch(`${apiEndpoitn}/user`, {
      method: 'POST',
    });
    const body = await response.text();
    const result = JSON.parse(body);
    const { signedIn, username } = result;
    this.setState({ user: { signedId, username } });
  }

  onUserChange(user) {
    this.setState({ user });
  }

  render() {
    const { user } = this.state;
    return (
      <div>
        <NavBar user={user} onUserChange={this.onUserChange} />
        <UserViewContents />
      </div>
    );
  }
}
