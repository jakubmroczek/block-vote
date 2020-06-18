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
    const query = `query 
      getElection($id: ID!) {
              getElection(id: $id) {
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
    const account = '0x6Fde7929911c098367d346766760265F82AE9203';
    const privateKey = Buffer.from('ce41ca55ca303cc19d7baac0644f32bf63e722c13c17eeb97cea7151e652153d', 'hex');

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
