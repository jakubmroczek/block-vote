pragma solidity ^0.6.9;

// TODO: Check if I can delete it
pragma experimental ABIEncoderV2;

contract Election {

  struct Candidate {
    string name;
    string surname;
    bytes32 id;
    uint votes;
  }

  function isVoterRegistered(address voter) view public returns(bool) {
    return m_reqisteredVoters[voter];
  }

  function hasVoterAlreadyVoted(address voter) view public returns(bool) {
    return m_registeredVotersWhoVoted[voter];
  }

  function getCandidates() public view registeredVoterOnly returns (Candidate[] memory) {
    return  m_candidates;
  }

  function getElectionTitle() public view registeredVoterOnly returns(string memory) {
    return  m_electionTitle;
  }

  function vote(bytes32 candidateId) public   registeredVoterOnly voterDidNotVoteOnly {
      //TODO: Can we do it differently
      for (uint i = 0; i <  m_candidates.length; i++) {
        if ( m_candidates[i].id == candidateId) {
           m_candidates[i].votes++;
          break;
        }
      }
      //TODO: What should happen when if the proper candidate was not found.
      voterVoted(msg.sender);
  }

 Candidate[] public m_candidates;
 address private m_owner;
 mapping(address => bool) m_reqisteredVoters;
 mapping(address => bool) m_registeredVotersWhoVoted;
 string m_electionTitle;


 modifier registeredVoterOnly {
   require(m_reqisteredVoters[msg.sender], "You are not allowed to participate in the voring as you public key has not been registered");
   _;
 }

 modifier voterDidNotVoteOnly {
   require(!m_registeredVotersWhoVoted[msg.sender], "You have already voted");
   _;
 }

  modifier ownerOnly {
    require(msg.sender == m_owner, "Only contract owner can call this method`");
    _;
  }

  constructor(string memory electionTitle) public {
    m_owner = msg.sender;
    m_electionTitle = electionTitle;

    // Substituted with data from database in the compilatin process.
%s

    // Substitute with data from database in the compilatin process.
%s
  }

  //TODO: Change to addCandidate
  function addNewCandidate(string memory name, string memory surname) public ownerOnly {
    bytes32 id = keccak256(abi.encode(name, surname));
     m_candidates.push(Candidate(name, surname, id, 0));
  }

  //TODO: Change to registerVoter
  function registerNewVoter(address voter) public ownerOnly {
     m_reqisteredVoters[voter] = true;
  }

  function voterVoted(address voter) private {
     m_registeredVotersWhoVoted[voter] = true;
  }

}
