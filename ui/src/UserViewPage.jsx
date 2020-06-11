import React from 'react';
import UserViewContents from './Contents.jsx';
import UserContext from './UserContext.js';

export default class UserViewPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user,
    }

    this.onUserChange = this.onUserChange.bind(this);
    this.onLogOut = this.onLogOut.bind(this);
  }

  async componentDidMount() {
    const apiEndpoint = window.Event.UI_AUTH_ENDPOINT;
    const response = await fetch(`${apiEndpoint}/user`, {
      method: 'POST',
    });
    const body = await response.text();
    const result = JSON.parse(body);
    const { signedIn, username } = result;
    this.setState({ user: { signedId, username } });
  }

  render() {
    const { user } = this.state;

  return (
      <>
        <UserContext.Provider value={user}>
          <UserViewContents />
        </UserContext.Provider>
      </>
    );
  }
}
