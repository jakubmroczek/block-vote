import React from 'react';
import { Switch, Route } from 'react-router-dom';

import VotingdApp from './VotingdApp.jsx';
import ElectionSetUpPanel from './ElectionSetUpPanel.jsx';
import Welcome from './Welcome.jsx';
import ElectionLobby from './ElectionLobby.jsx';

const NotFound = () => <h1>Page Not Found</h1>;

export default function Contents() {
  return (
    <Switch>
      <Route path="/vote" component={VotingdApp} />
      <Route exact path="/panel" component={ElectionSetUpPanel} />
      <Route path="/panel/lobby" component={ElectionLobby} />
      <Route exact path="/" component={Welcome} />
      <Route component={NotFound} />
    </Switch>
  );
}
