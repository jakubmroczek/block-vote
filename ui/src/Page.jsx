import React from 'react';
import { Switch, Route } from 'react-router-dom';
import UserContext from './UserContext.js';
import Contents from './Contents.jsx';
import Welcome from './Welcome.jsx';
import RegisterPublicKeyPanel from './register/RegisterPublicKeyPanel.jsx';
import DApp from './dApp/DApp.jsx';

function NotFound() {
  return (
    <h1>Page not found</h1>
  );
}

export default class Page extends React.Component {
  constructor() {
    super();
    this.state = {
      user: { signedIn: false, username: '' },
    };

    this.onUserChange = this.onUserChange.bind(this);
  }

  onUserChange(user) {
    this.setState({ user });
  }

  render() {
    const { user } = this.state;
    if (user.signedIn) {
      return (
        <>
          <UserContext.Provider value={user}>
            <Contents onUserChange={this.onUserChange} />
          </UserContext.Provider>
        </>
      );
    }
    return (
      <Switch>
        <Route exact path="/" render={props => <Welcome {...props} onUserChange={this.onUserChange} />} />
        <Route path="/register/:electionID" component={RegisterPublicKeyPanel} />
        <Route path="/vote" component={DApp} />
        <Route component={NotFound} />
      </Switch>
    );
  }
}
