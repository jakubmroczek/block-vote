import React from 'react';
import { Switch, Route } from 'react-router-dom';
import UserContext from './UserContext.js';
import Contents from './Contents.jsx';
import Welcome from './Welcome.jsx';
import RegisterPublicKeyPanel from './register/RegisterPublicKeyPanel.jsx';
import DApp from './dApp/DApp.jsx';
import Election from './dApp/Election.jsx';

function NotFound() {
  return (
    <h1>Page not found</h1>
  );
}

export default class Page extends React.Component {
  constructor() {
    super();
    this.state = {
      user: { isLoggedIn: false, email: '' },
    };
    this.setUser = this.setUser.bind(this);
  }

  setUser(user) {    
    this.setState({
      user,
    });
  }

  render() {
    const { user } = this.state;
    if (user.isLoggedIn) {
      return (
        <>
          <UserContext.Provider value={user}>
            <Contents setUser={this.setUser} />
          </UserContext.Provider>
        </>
      );
    }
    return (
      <Switch>
        <UserContext.Provider value={user}>
          <Route exact path="/" render={props => <Welcome {...props} setUser={this.setUser} />} />
          <Route path="/register/:electionID" component={RegisterPublicKeyPanel} />
          <Route exact path="/vote" component={DApp} />
          <Route path="/vote/:electionID" component={Election} />
          <Route component={NotFound} />
        </UserContext.Provider>
      </Switch>
    );
  }
}
