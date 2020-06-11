import { connect } from 'react-redux';
import { candidateSelected, candidateUnselected } from '../../../actions';
import CandidatesList from '../../../components/Candidates/CandidateList/CandidatesList.jsx';

const mapStateToProps = state => ({
  candidates: state.candidates,
});

const mapDispatchToProps = { candidateSelected, candidateUnselected };

export default connect(mapStateToProps, mapDispatchToProps)(CandidatesList);
