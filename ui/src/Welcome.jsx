import React from 'react';
import {
  Button, Figure,
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import NavBar from './NavBar.jsx';
import SignInItem from './SignInItem.jsx';

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

export default class Welcome extends React.Component {
  constructor() {
    super();
    this.onSignIn = this.onSignIn.bind(this);
    this.onLogOut = this.onLogOut.bind(this);
  }

  onSignIn(user) {
    const { history, setUser } = this.props;
    setUser(user);
    history.push('/panel');
  }

  onLogOut(user) {
    const { history, setUser } = this.props;
    setUser(user);
    history.push('/');
  }
  
  render() {
    return (
      <>
        <NavBar onSignIn={this.onSignIn} onLogOut={this.onLogOut} />
        <Logo />
        <LinkContainer to="/vote">
          <Button>
            Vote
          </Button>
        </LinkContainer>
      </>
    );
  }
}
