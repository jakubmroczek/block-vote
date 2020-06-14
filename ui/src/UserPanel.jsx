import React from 'react';
import { Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { withRouter } from 'react-router-dom';
import graphQLFetch from './graphQLFetch.js';
import ElectionLobby from './ElectionLobby.jsx';
import UserContext from './UserContext.js';

const EditElectionInfo = withRouter(({ id, location: { search } }) => {
  const editLocation = { pathname: `/panel/edit/${id}`, search };

  return (
    <>
      <h1>You created an election, but did not finish editing it! Edit!</h1>
      <LinkContainer to={editLocation}>
        <Button>Edit!</Button>
      </LinkContainer>
    </>
  );
});

function CreateElectionItem({ onElectionCreated }) {
  const createElection = async () => {
    const query = `mutation {
      createElection {
        _id
        status
      }
    }`;

    const response = await graphQLFetch(query);
    if (response) {
      onElectionCreated();
    } else {
      alert('Could not create the Election');
    }
  };

  return (
    <>
      <h1>You have no election here mate!</h1>
      <Button onClick={createElection}>Create one!</Button>
    </>
  );
}

export default class UserPanel extends React.Component {
  constructor() {
    super();

    this.state = {
      election: undefined,
    };

    this.read = this.read.bind(this);
  }

  componentDidMount() {
    this.read();
  }

  async read() {
    const query = `query {
      listElection {
        _id
        status
      }
    }`;

    const response = await graphQLFetch(query);

    if (response && response.listElection.length >= 1) {
      this.setState({
        election: response.listElection[0],
      });
    } else {
      const user = this.context;
      const { username } = user;
      alert(`Could not fetch Elections for the user ${username}`);
    }
  }

  render() {
    const { election } = this.state;

    if (election === undefined) {
      return (
        <CreateElectionItem onElectionCreated={this.read} />
      );
    }

    const { _id: id, status } = election;
    if (status === 'New') {
      return (
        <EditElectionInfo id={id} />
      );
    }

    if (status === 'PublicKeyRegistration') {
      return (
        <ElectionLobby id={id} />
      );
    }

    if (status === 'Under') {
      return (
        <div>
          <h1>Conducting election!</h1>
        </div>
      );
    }

    if (status === 'Finished') {
      return (
        <div>
          <h1>Election finished</h1>
        </div>
      );
    }

    // TODO: Impossbile
    return (
      <div>
        <h1>Unsupported state</h1>
        {' '}
        {state}
      </div>
    );
  }
}

UserPanel.contextType = UserContext;
