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
    this.abi = this.abi.bind(this);
  }

  async fetchSmartContract() {
    const query = `mutation  
      deployElection($id: ID!) {
        deployElection(id: $id) {
                  smartContract {
                    bytecode
                    abi
                  }
              }
    }`;

    const { id } = this.props;
    const response = await graphQLFetch(query, { id });

    if (response) {
      const { smartContract } = response.deployElection;
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

  abi() {
    const { smartContract } = this.state;
    const { abi } = smartContract;
    const result = JSON.parse(abi);
    return result;
  }

  async deployElection() {
    await this.fetchSmartContract();

    // TODO: Get this from MetaMask
    const account = '0x7132208CB0b813a922e690e6fdBAC3Aa9e994a79';
    const privateKey = Buffer.from('08c4542513c972bbfeb716959d2ca98e3c4a657ca4782112a15a67e87147e0d5', 'hex');

    // const data = `0x${this.bytecodeObject()}`;
    const data = this.bytecodeObject;
    const abi = this.abi();

    alert('Deploying the smart contract...')

    await deploy(data, abi, account, privateKey);

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
