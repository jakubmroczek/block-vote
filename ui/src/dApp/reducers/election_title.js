const electionTitle = (state = 'Fetchnig the election', action) => {
  // TODO: Rename the electionTitle to title
  switch (action.type) {
    case 'ELECTION_FETCHED_SUCCESSFULLY':
      return action.election.electionTitle;

    default:
      return state;
  }
};

export default electionTitle;
