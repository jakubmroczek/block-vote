import React from 'react';
import {
  Navbar, Nav, Button,
} from 'react-bootstrap';
import UserContext from './UserContext.js';

// TODO: Rename me
class LogOutButton extends React.Component {
  constructor() {
    super();
    this.state = {
      initialized: true,
    };
    this.signOut = this.signOut.bind(this);
  }

  async init() {
    const clientId = window.ENV.GOOGLE_CLIENT_ID;
    if (!clientId) {
      return;
    }
    window.gapi.load('auth2', () => {
      if (!window.gapi.auth2.getAuthInstance()) {
        window.gapi.auth2.init({ client_id: clientId }).then(() => {
          this.setState({ intialized: true });
        });
      }
    });
  }

  async signOut() {
    await this.init();

    const apiEndpoint = window.ENV.UI_AUTH_ENDPOINT;

    try {
      await fetch(`${apiEndpoint}/signout`, {
        method: 'POST',
      });
      const auth2 = window.gapi.auth2.getAuthInstance();
      await auth2.signOut();
      // TODO: I must set user state heres
      // this.setState({ user: { signedIn: false, usrename: ''}})

      const { onUserChange } = this.props;

      const user = { signedIn: false, username: '' };
      onUserChange(user);
    } catch (error) {
      alert(`Error signing out ${error}`);
    }
  }

  render() {
    return (
      <Button variant="outline-success" onClick={this.signOut}>Log out</Button>
    );
  }
}

export default class NavBar extends React.Component {
  constructor(props) {
    super(props);

    //   TODO: Rename to onLogout
    this.onUserChange = this.onUserChange.bind(this);
  }

  onUserChange(user) {
    const { onUserChange: callback, history } = this.props;
    callback(user);
    history.push('/');
  }

  render() {
    const user = this.context;

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
            <LogOutButton onUserChange={this.onUserChange} />
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

NavBar.contextType = UserContext;
