import { combineReducers } from 'redux';
import candidates from './candidates.js';
import electionTitle from './election_title.js';
import selectedCandidate from './selected_candidate.js';
import voter from './voter.js';

export default combineReducers({
  candidates,
  selectedCandidate,
  electionTitle,
  voter,
});
