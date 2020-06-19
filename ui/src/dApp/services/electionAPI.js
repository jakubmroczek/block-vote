import Web3 from 'web3';
import graphQLFetch from '../../graphQLFetch.js';


const contract = require('@truffle/contract');

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


    const web3 = new Web3('http://localhost:8545');
    // TODO: Take this from the backend
    const contractAddress = '0x05e2347F132ee13cD6D3AcC4E0b3E18b3ee05e1c';
    const contractABI = JSON.parse(abi);
    const dapptokenContract = new web3.eth.Contract(contractABI, contractAddress);

    // TODO: Get the addres from the MetaMask
    dapptokenContract.methods.getElectionTitle().call().then(console.log).catch((err) => {
      console.log('huuuuuhuhuh');
      console.log(err);
    });

    console.log(dapptokenContract.methods.getElectionTitle().call({ from: '0x7132208CB0b813a922e690e6fdBAC3Aa9e994a79' }).then((result) => {
      console.log(result);
    }));
  }

  async getElection() {
    await this.metaMaskInit();
    await this.blockchainInit();

    // TODO: Error handling
    const candidates = this.electionInstance.getCandidates().then((ethereumCandidates) => {
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
    const electionTitle = this.electionInstance.getElectionTitle().then(title => title);

    return Promise.all([candidates, electionTitle])
      .then(values => ({
        candidates: values[0],
        electionTitle: values[1],
      }));
  }

  async vote(candidate) {
    await this.metaMaskInit();
    await this.blockchainInit();

    return this.electionInstance.vote(candidate.id, { from: window.web3.eth.defaultAccount })
      .catch(error => console.log(error));
  }

  async isUserRegistered() {
    // TODO: Encapsulate this into distinct function
    await this.metaMaskInit();
    await this.blockchainInit();

    // TODO: Rename the function in the blockchain
    return this.electionInstance.isVoterRegistered(window.web3.eth.defaultAccount);
  }

  async hasUserAlreadyVoted() {
    // TODO: Encapsulate this into distinct function
    await this.metaMaskInit();
    await this.blockchainInit();

    // TODO: Rename the function in the blockchain
    return this.electionInstance.hasVoterAlreadyVoted(window.web3.eth.defaultAccount);
  }
}

export default ElectionAPI;
