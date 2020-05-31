import React from 'react';
import { Switch, Route } from 'react-router-dom';

import VotingdApp from './VotingdApp.jsx';
import AdminPanel from './AdminPanel.jsx';
import Welcome from './Welcome.jsx';

const NotFound = () => <h1>Page Not Found</h1>;

export default function Contents() {
  return (
    <Switch>
      <Route path="/vote" component={VotingdApp} />
      <Route path="/panel" component={AdminPanel} />
      <Route exact path="/" component={Welcome} />
      <Route component={NotFound} />
    </Switch>
  );
}
