import React from 'react';
import {
  Button, Figure,
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
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
    this.onSucessfulSignIn = this.onSucessfulSignIn.bind(this);
  }

  onSucessfulSignIn(user) {
    const { history, onUserChange } = this.props;
    onUserChange(user);
    history.push('/panel');
  }

  render() {
    return (
      <div>
        <Logo />
        <LinkContainer to="/vote">
          <Button>
            Vote
          </Button>
        </LinkContainer>
        {' '}
        <SignInItem onSucessfulSignIn={this.onSucessfulSignIn} />
      </div>
    );
  }
}
