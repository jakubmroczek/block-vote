pragma solidity ^0.5.16;

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

 modifier registeredVoter {
   require(isVoterRegistered(msg.sender), "You are not allowed to participate in the voting as your public key was not registered");
   _;
 }

 modifier voterDidNotVote {
   require(!hasVoterAlreadyVoted(msg.sender), "You have already voted");
   _;
 }

  function vote(bytes32 candidateId) public  registeredVoter voterDidNotVote {
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

  function getCandidates() public view returns (Candidate[] memory) {
    return  m_candidates;
  }

  function getElectionTitle() public view returns(string memory) {
    return  m_electionTitle;
  }

 Candidate[] public m_candidates;
 mapping(address => bool) m_reqisteredVoters;
 mapping(address => bool) m_registeredVotersWhoVoted;
 string m_electionTitle;

  constructor(string memory electionTitle) public {
    m_electionTitle = electionTitle;
    // Substituted with data from database in the compilatin process.
    %s
    // Substitute with data from database in the compilatin process.
    %s 
  }

  function addCandidate(string memory name, string memory surname) private {
    bytes32 id = keccak256(abi.encode(name, surname));
     m_candidates.push(Candidate(name, surname, id, 0));
  }

  function registerVoter(address voter) private {
     m_reqisteredVoters[voter] = true;
  }

  function voterVoted(address voter) private {
     m_registeredVotersWhoVoted[voter] = true;
  }

}
