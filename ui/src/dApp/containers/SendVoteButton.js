import { connect } from 'react-redux';
import { candidateSelected, candidateUnselected } from '../actions/index.js';
import SendVoteButton from '../components/SendVoteButton.jsx';

const mapStateToProps = state => ({
  selectedCandidate: state.selectedCandidate,
});

const mapDispatchToProps = ({ candidateSelected, candidateUnselected });

export default connect(mapStateToProps, mapDispatchToProps)(SendVoteButton);
