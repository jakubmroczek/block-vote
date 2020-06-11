import React from 'react';
import {
  Navbar, Nav, Button,
} from 'react-bootstrap';
import { Switch, Route } from 'react-router-dom';
import UserContext from './UserContext.js';
import Contents from './Contents.jsx';
import Welcome from './Welcome.jsx';
import VotingdApp from './VotingdApp.jsx';

function NotFound() {
  return (
    <h1>Page not found</h1>
  );
}

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

      const { onLogout } = this.props;
      onLogout();
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

function NavBar({ user, onLogout }) {
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="#home">BlockVote</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Navbar.Text>
          Signed in as:
          {' '}
          {/* {user.username} */}
        </Navbar.Text>
        <Nav className="mr-auto">
          <LogOutButton onLogout={onLogout} />
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

    this.onUserChange = this.onUserChange.bind(this);
    this.onLogout = this.onLogout.bind(this);
  }

  onUserChange(user) {
    this.setState({ user });
  }

  onLogout() {
    this.setState({ user: { signedIn: false, username: '' } });
    const { history } = this.props;
    history.push('/');
  }

  render() {
    const { user } = this.state;

    if (user.signedIn) {
      return (
        <>
          <NavBar onLogout={this.onLogout} />
          <UserContext.Provider value={user}>
            <Contents />
          </UserContext.Provider>
        </>
      );
    }
    return (
      <Switch>
        <Route exact path="/" render={props => <Welcome {...props} onUserChange={this.onUserChange} />} />
        <Route path="/vote" component={VotingdApp} />
        <Route component={NotFound} />
      </Switch>
    );
  }
}
