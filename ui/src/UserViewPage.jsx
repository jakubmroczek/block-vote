import React from 'react';
import {
  Navbar, Nav, Button,
} from 'react-bootstrap';
import UserViewContents from './UserViewContents.jsx';
import UserContext from './UserContext.js';

class LogOutButton extends React.Component {
  constructor() {
    super() ;
    this.state = {
      initialized: true,
    }
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

      const { onLogOut } = this.props;
      onLogOut();
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

function NavBar({ user, onLogOut }) {
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
          <LogOutButton onLogOut={onLogOut} />
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
    this.onLogOut = this.onLogOut.bind(this);
  }

  async componentDidMount() {
    const apiEndpoint = window.Event.UI_AUTH_ENDPOINT;
    const response = await fetch(`${apiEndpoint}/user`, {
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

  onLogOut() {
    const { history } = this.props;
    history.push('/');
  }

  render() {
    const {history} = this.props;
    const { user } = this.state;

  return (
      <div>
        <NavBar onLogOut={this.onLogOut} user={user} onUserChange={this.onUserChange} />
        <UserContext.Provider value={user}>
          <UserViewContents />
        </UserContext.Provider>
      </div>
    );
  }
}
