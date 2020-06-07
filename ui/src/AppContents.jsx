
import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Welcome from './Welcome.jsx';
import VotingdApp from './VotingdApp.jsx';
import UserViewPage from './UserViewPage.jsx';

const NotFound = () => <h1>Page Not Found</h1>;

export default function AppContents() {
  return (
    <Switch>
      <Route exact path="/" component={Welcome} />
      <Route path="/vote" component={VotingdApp} />
      <Route path="/panel" component={UserViewPage} />
      <Route component={NotFound} />
    </Switch>
  );
}
