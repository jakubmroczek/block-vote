import React from 'react';
import graphQLFetch from './graphQLFetch.js';

export default class UserPanel extends React.Component {
  constructor() {
    super();
    // TODO: Pass this from the SingIn compnent
    this.state = {
      owner: 'jakubmroczek',
      elections: [],
    };
  }

  componentDidMount() {
    this.read();
  }

  async read() {
    const query = `query listElection($owner: String!) {
            listElection(owner: $owner) {
                _id
                status
                title
                candidates {
                    name surname
                }
                participants {
                    email
                }
            }
        }`;

    const { owner } = this.state;
    const vars = { owner };

    const response = await graphQLFetch(query, vars);

    if (response) {
      this.setState({ elections: response.listElection });
    } else {
      alert(`Could not fetch Elections for the user ${owner}`);
    }
  }

  render() {
    const { elections } = this.state;

    if (elections.length === 0) {
      return (
        <div>
          <h1>You have no election here mate! Create one!</h1>
        </div>
      );
    }

    // TODO: Support for multiple elections
    const election = elections[0];

    if (election.status === 'New') {
      return (
        <div>
          <h1>You created an election, but did not finish editing it! Edit!</h1>
        </div>
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
