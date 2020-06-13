import React from 'react';
import { Button } from 'react-bootstrap';
import graphQLFetch from './graphQLFetch.js';

export default function ElectionLobby({ id }) {
  const deployElection = async () => {
    const query = `mutation 
    deployElection($id: ID!) {
      deployElection(id: $id) {
        _id
        title
      }
}`;

    const response = await graphQLFetch(query, { id });

    if (response) {
      alert('Going to deploy the election on the blockchain')
    } else {
      alert('Could not deploy eleciton on the blockchain')
    }
  };

  return (
    <>
      <h1>Please wait for voters to register</h1>
      <Button onClick={deployElection}>
        Deploy election on blockchain
      </Button>
    </>
  );
}
