const voter = (state = { appplicationState: null }, action) => {
  switch (action.type) {
    case 'FETCH_ELECTION_STARTED':
      return { appplicationState: 'connectingToBlockchain' };

    case 'ELECTION_FETCHED_SUCCESSFULLY':
      return { appplicationState: 'connectedToBlockchain' };

    case 'USER_NOT_REGISTERED':
      return { appplicationState: 'unregisteredUser' };

    case 'USER_HAS_ALREADY_VOTED':
      return { appplicationState: 'userHasAlreadyVoted' };
    default:
      return state;
  }
};

export default voter;
