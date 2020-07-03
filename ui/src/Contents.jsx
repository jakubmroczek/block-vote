import React from 'react';
import { Switch, Route } from 'react-router-dom';

import ElectionSetUpPanel from './ElectionSetUpPanel.jsx';
import UserPanel from './UserPanel.jsx';
import NavBar from './NavBar.jsx';

const NotFound = () => <h1>Page Not Found Ziomek</h1>;

export default function Contents({ setUser }) {
  return (
    <>
      <Route path="/" render={props => <NavBar {...props} setUser={setUser} />} />
      <Switch>
        <Route path="/panel/edit/:electionID" component={ElectionSetUpPanel} />
        <Route path="/panel" component={UserPanel} />
        {/* TODO: Think of different path name this one is stupid */}
        <Route component={NotFound} />
      </Switch>
    </>
  );
}
