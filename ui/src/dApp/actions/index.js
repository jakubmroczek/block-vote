import ElectionAPI from '../services/electionAPI.js';

export const electionFetched = election => ({
  type: 'ELECTION_FETCHED_SUCCESSFULLY',
  election,
});

export const fetchElectionStarted = () => ({
  type: 'FETCH_ELECTION_STARTED',
});

export const userNotRegistered = () => ({
  type: 'USER_NOT_REGISTERED',
});

export const userHasAlreadyVoted = () => ({
  type: 'USER_HAS_ALREADY_VOTED',
});

export const candidateSelected = candidate => ({
  type: 'CANDIDATE_SELECTED',
  candidate,
});

export const candidateUnselected = () => ({
  type: 'CANDIDATE_UNSELECTED',
});

// Reused by other components
// TODO: Create a dedicated event for this
const onFailure = (dispatch) => {
  dispatch(userNotRegistered());
};

export const fetchElection = () => (dispatch) => {
  // TODO: BEtter error handling
  new ElectionAPI()
    .getElection(onFailure(dispatch))
    .then((election) => {
      dispatch(electionFetched(election));
    })
    .catch(error => console.log(error));
};

// TODO: Set timeout
// TODO: Support the blockchainFailure - e.g metamask does not find the contract or there is
// no metamask installed
export const connectToBlockchain = () => (dispatch) => {
  dispatch(fetchElectionStarted());

  const successfulConnectionConditions = [
    new ElectionAPI().isUserRegistered(onFailure(dispatch)),
    new ElectionAPI().hasUserAlreadyVoted(onFailure(dispatch)),
  ];

  // TODO: Error handling
  Promise.all(successfulConnectionConditions)
    .then((values) => {
      const isUserRegistered = values[0];
      const userVoted = values[1];

      if (!isUserRegistered) {
        dispatch(userNotRegistered());
      } else if (userVoted) {
        dispatch(userHasAlreadyVoted());
      } else {
        dispatch(fetchElection());
      }
    })
    .catch(error => console.log(error));
};
