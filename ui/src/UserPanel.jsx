import React from 'react';
import {
  Button, Spinner, Container, Row, Col,
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { withRouter } from 'react-router-dom';
import graphQLFetch from './graphQLFetch.js';
import ElectionLobby from './ElectionLobby.jsx';
import DeployedElectionView from './DeployedElectionView.jsx';
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
        id
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
    this.state = {};
    this.read = this.read.bind(this);
  }

  componentDidMount() {
    this.read();
  }

  async read() {
    const query = `query {
      listElection {
        id
        status
        participants {
          email
        }
      }
    }`;

    const response = await graphQLFetch(query);

    // TODO: Refactor this, right now there is only one election at a time.

    if (response && response.listElection.length >= 1) {
      this.setState({
        election: response.listElection[0],
      });
    } else {
      this.setState({
        election: undefined,
      });
    }
  }

  render() {
    if (!('election' in this.state)) {
      return (
        <Container>
          <Row>
            <Col>
              <Spinner animation="border" />
            </Col>
          </Row>
          <Row>
            <Col>
              Connecting to the server. Wait a moment please...
            </Col>
          </Row>
        </Container>
      );
    }


    const { election } = this.state;

    if (election === undefined) {
      return (
        <CreateElectionItem onElectionCreated={this.read} />
      );
    }

    const { id, status } = election;

    // TODO: Refactor this code
    if (status === 'Finished') {
      return (
        <EditElectionInfo id={id} />
      );
    }

    if (status === 'New') {
      return (
        <EditElectionInfo id={id} />
      );
    }

    const { participants } = election;
    if (status === 'Registration') {
      return (
        <ElectionLobby id={id} totalNumberOfVoters={participants.length} />
      );
    }

    if (status === 'Deployed') {
      return (
        <DeployedElectionView id={id} />
      );
    }

    // TODO: How should we handle the finished elction - current apporach we do not display them
  }
}

UserPanel.contextType = UserContext;
