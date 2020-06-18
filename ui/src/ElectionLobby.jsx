import React from 'react';
import { Button } from 'react-bootstrap';
import graphQLFetch from './graphQLFetch.js';

export class  ElectionLobby extends React.Component {
  
  const fetchSmartContract = async () => {
    const query = `query 
      getElection($id: ID!) {
              getElection(id: $id) {
                  smartContract {
                    serialziedValue
                  }
              }
  }`;

    const response = await graphQLFetch(query, { id });

    if (response) {
      const { smartContract } = response.getElection;
      this.setState({ smartContract });
    } else {
      alert('getElection call failed');
    }
  };


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
      alert('Going to deploy the election on the blockchain');
    } else {
      alert('Could not deploy eleciton on the blockchain');
    }
  };

 render() {
  return (
    <>
      <h1>Please wait for voters to register</h1>
      <Button onClick={deployElection}>
        Deploy election on blockchain
      </Button>
    </>
  );
 }
}
