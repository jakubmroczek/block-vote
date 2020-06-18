import React from 'react';
import { Button } from 'react-bootstrap';
import graphQLFetch from './graphQLFetch.js';

import deploy from './deploy.js';

export default class ElectionLobby extends React.Component {
  constructor(props) {
    super(props);
    this.fetchSmartContract = this.fetchSmartContract.bind(this);
    this.deployElection = this.deployElection.bind(this);
    this.bytecodeObject = this.bytecodeObject.bind(this);
  }

  async fetchSmartContract() {
    const query = `mutation  
      deployElection($id: ID!) {
        deployElection(id: $id) {
                  smartContract {
                    bytecode
                  }
              }
    }`;

    const { id } = this.props;
    const response = await graphQLFetch(query, { id });

    if (response) {
      const { smartContract } = response.getElection;
      this.setState({ smartContract });
    } else {
      alert('getElection call failed');
    }
  }

  bytecodeObject() {
    const { smartContract } = this.state;
    const { bytecode } = smartContract;
    const { object } = JSON.parse(bytecode);
    return object;
  }

  async deployElection() {
    await this.fetchSmartContract();

    // TODO: Get this from MetaMask
    const account = '0xFbC79CFc69405B218799feF48615aEfc444cB699';
    const privateKey = Buffer.from('94a644335935f2a8c0342ae8b74f4dcdd0e47768c5f5237253924183ef1a1921', 'hex');

    const data = `0x${this.bytecodeObject()}`;

    await deploy(data, account, privateKey);

    // TODO: How to handle success or failure of the deploy
  }

  render() {
    return (
      <>
        <h1>Please wait for voters to register</h1>
        <Button onClick={this.deployElection}>
          Deploy election on blockchain
        </Button>
      </>
    );
  }
}
