import React from 'react';
import { Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import graphQLFetch from './graphQLFetch.js';

export default class UserPanel extends React.Component {
  constructor() {
    super();
    // TODO: Pass this from the SingIn compnent
    this.state = {
      username: 'jakubmroczek2@gmail.com',
      elections: [],
      election: undefined,
    };
  }

  componentDidMount() {
    this.read();
  }

  async read() {
    const query = `query listElection($username: String!) {
            listElection(username: $username) {
                _id
                status
                title
                candidates {
                    name 
                    surname
                }
                participants {
                    email
                }
            }
        }`;

    const { username } = this.state;
    const vars = { username };

    const response = await graphQLFetch(query, vars);

    if (response && response.listElection.length >= 1) {
      this.setState({
        elections: response.listElection,
        election: response.listElection[0],
      });
    } else {
      alert(`Could not fetch Elections for the user ${username}`);
    }
  }

  render() {
    const { election } = this.state;

    if (election === undefined) {
      return (
        <div>
          <h1>You have no election here mate! Create one!</h1>
        </div>
      );
    }

    if (election.status === 'New') {
      return (
        <>
          <h1>You created an election, but did not finish editing it! Edit!</h1>
          <LinkContainer to="/panel/edit">
            <Button>Edit!</Button>
          </LinkContainer>
        </>
      );
    }

    if (election.status === 'PublicKeyRegistration') {
      return (
        <div>
          <h1>Waiting for the users to register</h1>
        </div>
      );
    }

    if (election.status === 'Under') {
      return (
        <div>
          <h1>Conducting election!</h1>
        </div>
      );
    }

    if (election.status === 'Finished') {
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
        {election.state}
      </div>
    );
  }
}
