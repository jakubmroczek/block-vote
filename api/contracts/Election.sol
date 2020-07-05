pragma solidity ^0.6.10;

// TODO: Check if I can delete it
pragma experimental ABIEncoderV2;

contract Election {

  struct Candidate {
    string name;
    string surname;
    uint votes;
  }

  struct CandidateInput {
    string name;
    string surname;
  }

  function isVoterRegistered(address voter) view public returns(bool) {
    //TODO: Is this okay? Check on remix
    for (uint i = 0; i < m_registeredVoters.length; i++) {
      if (m_registeredVoters[i] == voter) {
        return true;
      }
    }
    return false;
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

  function vote(uint index) public  registeredVoter voterDidNotVote {
      m_candidates[index].votes++;
      voterVoted(msg.sender);
  }

  function getCandidates() public view returns (Candidate[] memory) {
    return  m_candidates;
  }

  function getTitle() public view returns(string memory) {
    return  m_title;
  }

  //TODO: Try use automatic getter
 Candidate[] public m_candidates;
 address[] m_registeredVoters;
 mapping(address => bool) m_registeredVotersWhoVoted;
 //TODO: Try use automatic getter
 string m_title;

  constructor(string memory title, CandidateInput[] memory candidates, address[] memory registeredVoters) public {
    m_title = title;

    //TODO: Try optimize the ehter here
    for (uint i = 0; i < candidates.length; i++) {
      // 0 as no one has any votes at the beginning
      m_candidates.push(Candidate(candidates[i].name, candidates[i].surname, 0));
    }

    for (uint i = 0; i < registeredVoters.length; i++) {
      //TODO: Try optimize the ehter here
    m_registeredVoters.push(registeredVoters[i]);
    }
  }

  function voterVoted(address voter) private {
     m_registeredVotersWhoVoted[voter] = true;
  }

}
