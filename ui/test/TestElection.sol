pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Election.sol";

contract TestGaming {
    // uint public initialBalance = 10 ether;
    Election election;

    function beforeAll() public {
      election = Election(DeployedAddresses.Election());
    }

    function testCandidatesAreInitallyEmpty() public {
      // Candidate[] memory candidates = election.getCandidates();
      // election.getCandidates().length;
      // Assert.equal(true, false, "Foo bar");
    }

    // function testPlayerWonGuessHigher() public {
    //     bool expected = true;
    //     bool result = gaming.determineWinner(5, 4, true);
    //
    //     Assert.equal(expected, result, "The player should have won by guessing the mystery number was higher than their number");
    // }
    //
    // function testPlayerWonGuessLower() public {
    //     bool expected = true;
    //     bool result = gaming.determineWinner(5, 6, false);
    //
    //     Assert.equal(expected, result, "The player should have won by guessing the mystery number was lower than their number");
    // }
    //
    // function testPlayerLostGuessLower() public {
    //     bool expected = false;
    //     bool result = gaming.determineWinner(5, 4, false);
    //
    //     Assert.equal(expected, result, "The player should have lost by guessing the mystery number was lower than their number");
    // }
    //
    // function testPlayerLostGuessHigher() public {
    //     bool expected = false;
    //     bool result = gaming.determineWinner(5, 6, true);
    //
    //     Assert.equal(expected, result, "The player should have lost by guessing the mystery number was higher than their number");
    // }
}

//Test suits to implement.

//Only  administrator can add new candidates.

//Only administrator can register a new voter.
