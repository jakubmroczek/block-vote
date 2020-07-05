import React from 'react';
import { Switch, Route } from 'react-router-dom';

import ElectionSetUpPanel from './ElectionSetUpPanel.jsx';
import UserPanel from './UserPanel.jsx';
import NavBar from './NavBar.jsx';
import WelcomePage from './WelcomePage.jsx';
import RegisterPublicKeyPanel from './register/RegisterPublicKeyPanel.jsx';
import DApp from './dApp/DApp.jsx';
import Election from './dApp/Election.jsx';

const NotFound = () => <h1>Error: page not found</h1>;

export default function Contents({ setUser }) {
  return (
    <>
      <Route path="/" render={props => <NavBar {...props} setUser={setUser} />} />
      <Switch>
        <Route exact path="/" component={WelcomePage} />
        <Route exact path="/panel" component={UserPanel} />
        <Route path="/panel/edit/:electionID" component={ElectionSetUpPanel} />
        <Route exact path="/vote" component={DApp} />
        <Route exact path="/vote/:electionID" component={Election} />
        <Route path="/register/:electionID" component={RegisterPublicKeyPanel} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}
