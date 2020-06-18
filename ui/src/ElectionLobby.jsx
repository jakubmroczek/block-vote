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
    const sm = JSON.parse(smartContract);
    const bytecode = sm.data.getElection.smartContract.bytecode;
    const object = JSON.parse(bytecode);
    alert(JSON.stringify(object))
    return object;
  }

  async deployElection() {
    await this.fetchSmartContract();

    alert(this.bytecodeObject());
    // TODO: Get this from MetaMask
    // const account = '';
    // const privateKey = '';

    // const data = this.bytecodeObject();

    // alert(data)
    // deploy(data, account, privateKey);
    // TODO: How to handle this?
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
