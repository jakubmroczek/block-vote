export const selectedCandidate = (state = null, action) => {
  switch (action.type) {
    case "CANDIDATE_SELECTED":
      return action.candidate

    case "CANDIDATE_UNSELECTED":
      return null

    default:
      return state
  }
}
