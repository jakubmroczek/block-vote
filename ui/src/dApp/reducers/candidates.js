const candidates = (state = [], action) => {
  switch (action.type) {
    case 'ELECTION_FETCHED_SUCCESSFULLY':
      return action.election.candidates;

    default:
      return state;
  }
};

export default candidates;
