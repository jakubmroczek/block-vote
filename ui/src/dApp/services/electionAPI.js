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
      getVoterElection(publicKey: $publicKey) 
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
    // const Election = await this.fetchCompiledSmartContract();
    // const election = contract(JSON.parse(Election));

    const web3 = new Web3('http://localhost:8545');
    const contractAddress = '0x05e2347F132ee13cD6D3AcC4E0b3E18b3ee05e1c';
    let contractABI = '[{\"inputs\":[{\"internalType\":\"string\",\"name\":\"electionTitle\",\"type\":\"string\"}],\"stateMutability\":\"nonpayable\",\"type\":\"constructor\"},{\"inputs\":[{\"internalType\":\"string\",\"name\":\"name\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"surname\",\"type\":\"string\"}],\"name\":\"addNewCandidate\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"getCandidates\",\"outputs\":[{\"components\":[{\"internalType\":\"string\",\"name\":\"name\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"surname\",\"type\":\"string\"},{\"internalType\":\"bytes32\",\"name\":\"id\",\"type\":\"bytes32\"},{\"internalType\":\"uint256\",\"name\":\"votes\",\"type\":\"uint256\"}],\"internalType\":\"struct Election.Candidate[]\",\"name\":\"\",\"type\":\"tuple[]\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"getElectionTitle\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"voter\",\"type\":\"address\"}],\"name\":\"hasVoterAlreadyVoted\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"voter\",\"type\":\"address\"}],\"name\":\"isVoterRegistered\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"name\":\"m_candidates\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"name\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"surname\",\"type\":\"string\"},{\"internalType\":\"bytes32\",\"name\":\"id\",\"type\":\"bytes32\"},{\"internalType\":\"uint256\",\"name\":\"votes\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"voter\",\"type\":\"address\"}],\"name\":\"registerNewVoter\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"candidateId\",\"type\":\"bytes32\"}],\"name\":\"vote\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"}]';
    contractABI = JSON.parse(contractABI);
    const dapptokenContract = new web3.eth.Contract(contractABI, contractAddress);

    // TODO: Get the addres from the MetaMask
    console.log(dapptokenContract.methods.getElectionTitle().call({ from: '0x7132208CB0b813a922e690e6fdBAC3Aa9e994a79' }).then((result) => {
      console.log(result);
    }));

    // dapptokenContract.methods.getCandidates().call((err, res) => {
    //   console.log(res);
    // });

    election.setProvider(this.web3Provider);
    this.electionInstance = await election.deployed();
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
