import { connect } from 'react-redux';

// TODO: Fix this
import ElectionTitle from '../../../components/Election/ElectionTitle/ElectionTitle.jsx';

const mapStateToProps = state => ({
  electionTitle: state.electionTitle,
});

export default connect(mapStateToProps, null)(ElectionTitle);
