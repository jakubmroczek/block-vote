const Election = artifacts.require('./Election.sol');

contract('Election', async (accounts) => {
  let election;
  const owner = accounts[0];
  const voter = accounts[1];

  before(async () => {
    election = await Election.deployed();
  });

  it('Candidates are initially empty', async () => {
    const expectedNumberOfCandidates = 0;
    let numberOfCandidates;

    await election.getCandidates().then(
      (candidates) => {
        numberOfCandidates = candidates.length;
      },
    );

    assert.equal(expectedNumberOfCandidates, numberOfCandidates);
  });

  it('Owner can add a new candidate', async () => {
    await election.addNewCandidate('Marek', 'Peszko');

    const expectedNumberOfCandidates = 1;
    const expectedCandidate = ['Marek', 'Peszko', '0x20a0608df30cc1ac00bcae74772276d87b39aa03d901957976c1208db0908340', '0'];

    let numberOfCandidates;
    let resultCandiate;

    await election.getCandidates().then(
      (candidates) => {
        numberOfCandidates = candidates.length;
        resultCandiate = candidates[0].slice(0, 4);
      },
    );

    console.log(resultCandiate);

    assert.equal(expectedNumberOfCandidates, numberOfCandidates);
    assert.deepEqual(expectedCandidate, resultCandiate);
  });

  it('Only owner can add a new candidate', async () => {
    // assert.throws(async() => {
    //   await election.addNewCandidate("Marek", "Peszko", {from: voter});
    // }, "Voter added a new candidate although he should not have");

    try {
      await election.addNewCandidate('Marek', 'Peszko', { from: voter });
      assert(false);
    } catch (error) {
      console.log(error);
      assert(error);
    }
  });

  it('Owner can register a new voter', async () => {
    assert.doesNotThrow(async () => {
      await election.registerNewVoter(voter);
    }, 'Owner can register a new voter');
  });

  it('Only owner can register a new voter', async () => {
    assert.throws(async () => {
      await election.registerNewVoter(owner, { from: voter });
    }, 'Voters registered a new voter although he should not have');
  });
});
