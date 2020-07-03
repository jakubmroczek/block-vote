import React from 'react';
import UserContext from './UserContext.js';
import Contents from './Contents.jsx';

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
    return (
      <UserContext.Provider value={user}>
        <Contents setUser={this.setUser} />
      </UserContext.Provider>
    );
  }
}
