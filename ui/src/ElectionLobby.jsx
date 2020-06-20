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
                  title
                  smartContract {
                    bytecode
                    abi
                  }
              }
    }`;

    const { id } = this.props;
    const response = await graphQLFetch(query, { id });

    if (response) {
      const { smartContract, title } = response.deployElection;
      this.setState({ smartContract, title });
    } else {
      alert('getElection call failed');
    }
  }

  // TODO: Move to the state
  bytecodeObject() {
    const { smartContract } = this.state;
    const { bytecode } = smartContract;
    const { object } = JSON.parse(bytecode);
    return `0x${object}`;
  }

  // TODO: Move to the state
  abi() {
    const { smartContract } = this.state;
    const { abi } = smartContract;
    const result = JSON.parse(abi);
    return result;
  }

  async deployElection() {
    await this.fetchSmartContract();

    // TODO: Get this from MetaMask
    const account = '0x66F8329C2815c1AD82fac2A7f68AD1C76E3F390d';

    const bytecode = this.bytecodeObject();
    const abi = this.abi();
    const { title: electionTitle } = this.state;

    // TODO: How to handle success or failure of the deploy
    const contractAddress = await deploy(bytecode, abi, electionTitle, account);
      
    alert(`Contract address is ${contractAddress}`);
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
