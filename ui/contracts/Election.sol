pragma solidity ^0.5.0;

// TODO: What it is?
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

    //TODO: Delete this when the second component will be ready
    addNewCandidate("Bill", "Doe");
    addNewCandidate("Steve", "West");
    addNewCandidate("George", "Sander");
    addNewCandidate("Mathew", "Allen");
    addNewCandidate("Charles", "Hogan");
    addNewCandidate("Peter", "Gates");                                                                                                                              

    registerNewVoter(0x6b3B00eb9bECE83a39C84874C562e11FB69dA55B);
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
