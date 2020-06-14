import React from 'react';
import {
  Navbar, Nav, Button,
} from 'react-bootstrap';
import UserContext from './UserContext.js';

async function initGApi() {
  const clientId = window.ENV.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return;
  }
  window.gapi.load('auth2', () => {
    if (!window.gapi.auth2.getAuthInstance()) {
      window.gapi.auth2.init({ client_id: clientId }).then(() => {
      });
    }
  });
}

// TODO: Rename me
class LogOutButton extends React.Component {
  constructor() {
    super();
    this.signOut = this.signOut.bind(this);
  }

  async signOut() {
    await initGApi();

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
        <Nav className="ml-auto">
          <Navbar.Text className="mr-1">
            {user.username}
          </Navbar.Text>
          <LogOutButton onUserChange={this.onUserChange} />
        </Nav>
      </Navbar>
    );
  }
}

NavBar.contextType = UserContext;
