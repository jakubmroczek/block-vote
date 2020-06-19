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
    const account = '0x3d614385A08c9c797387B594cb39Ce02BFdE2be9';
    const privateKey = Buffer.from('dd2f8fa53ec78a8ce4c103d52029a7882884330271835826c997358af6824174', 'hex');

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
