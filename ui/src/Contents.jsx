import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Welcome from './Welcome.jsx';
import VotingdApp from './VotingdApp.jsx';
import ElectionSetUpPanel from './ElectionSetUpPanel.jsx';
import ElectionLobby from './ElectionLobby.jsx';
import RegisterKeyView from './RegisterKeyView.jsx';
import UserPanel from './UserPanel.jsx';

const NotFound = () => <h1>Page Not Found</h1>;

export default function Contents() {
  return (
    <Switch>
      <Route exact path="/" component={Welcome} />
      <Route path="/vote" component={VotingdApp} />
      <Route exact path="/panel" component={UserPanel} />
      <Route path="/panel/edit/:electionID" component={ElectionSetUpPanel} />
      <Route exact path="/panel/lobby" component={ElectionLobby} />
      <Route exact path="/panel/key" component={RegisterKeyView} />
      <Route component={NotFound} />
    </Switch>
  );
}
