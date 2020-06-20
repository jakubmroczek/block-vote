import Web3 from 'web3';
import graphQLFetch from '../../graphQLFetch.js';

class ElectionAPI {
  web3Provider = null;

  web3 = null;

  electionInstance = null;

  async metaMaskInit() {
    // TODO: What does Modern means?
    // Modern dapp browsers...
    if (window.ethereum) {
      this.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.enable();
      } catch (error) {
        // User denied account access...
        // TODO: Beter error handling
        console.error('User denied account access');
      }
    } else if (window.web3) {
      // Legacy dapp browsers...
      this.web3Provider = window.web3.currentProvider;
    } else {
      // If no injected web3 instance is detected, fall back to Ganache
      // TODO: This should be removed from production code
      this.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
    }
    this.web3 = new Web3(this.web3Provider);
  }

  // TODO: Make this dependant on the public key
  // eslint-disable-next-line class-methods-use-this
  async fetchCompiledSmartContract() {
    const query = `query 
    getVoterElection($publicKey: String!) {
      getVoterElection(publicKey: $publicKey) {
        smartContract {
          abi
        }
      }
}`;

    // TODO: Fix thiss
    const publicKey = 'foobart';
    const response = await graphQLFetch(query, { publicKey });

    if (response) {
      return response.getVoterElection;
    }
    alert('getElection call failed');
    return undefined;
  }

  async blockchainInit() {
    const response = await this.fetchCompiledSmartContract();
    const { smartContract } = response;
    const { abi } = smartContract;
    const contractABI = JSON.parse(abi);

    // TODO: Get this from the metamask
    const web3 = new Web3('http://localhost:8545');
    // TODO: Take this from the backend
    const contractAddress = '0x17a19169b243635Bf38cda3c0aeE883f9B316946';    
    const dapptokenContract = new web3.eth.Contract(contractABI, contractAddress);
    this.electionInstance = dapptokenContract;
  }

  async getElection() {
    await this.metaMaskInit();
    await this.blockchainInit();

    // TODO: Error handling
    // TOOD: rename to promise
    const candidates = this.electionInstance.methods.getCandidates().call((err, ethereumCandidates) => {
      const candidatesArray = [];
      for (let i = 0; i < ethereumCandidates.length; i += 1) {
        candidatesArray.push(
          {
            name: ethereumCandidates[i].name,
            surname: ethereumCandidates[i].surname,
            id: ethereumCandidates[i].id,
          },
        );
      }
      return candidatesArray;
    });

    // TODO: Error handling
    const electionTitle = this.electionInstance.methods.getElectionTitle().call((err, title) => title);

    return Promise.all([candidates, electionTitle])
      .then(values => ({
        candidates: values[0],
        electionTitle: values[1],
      }));
  }

  async vote(candidate) {
    await this.metaMaskInit();
    await this.blockchainInit();

    // TODO: Use send here
    return this.electionInstance.methods.vote(candidate.id, { from: window.web3.eth.defaultAccount })
      .catch(error => console.log(error));
  }

  async isUserRegistered() {
    // TODO: Encapsulate this into distinct function
    await this.metaMaskInit();
    await this.blockchainInit();

    // TODO: Rename the function in the blockchain
    return this.electionInstance.methods.isVoterRegistered(window.web3.eth.defaultAccount).call(result => result);
  }

  async hasUserAlreadyVoted() {
    // TODO: Encapsulate this into distinct function
    await this.metaMaskInit();
    await this.blockchainInit();

    // TODO: Rename the function in the blockchain
    return this.electionInstance.methods.hasVoterAlreadyVoted(window.web3.eth.defaultAccount).call()
      .then(res => res);
  }
}

export default ElectionAPI;
