import * as React from 'react';
import { connect } from 'react-redux';

import List from '@material-ui/core/List';

import { styled } from '@material-ui/core/styles';
import { candidateSelected, candidateUnselected } from '../../../actions';

// TODO: Fix this import
import { Candidate } from '../Candidate/Candidate.jsx';

const MyList = styled(List)({
  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  background: 'paper',
  padding: '100px',
  marigin: '5px',
});

export class CandidatesList extends React.Component {
  constructor(props) {
    super(props);

    // -1 should be a constant.
    this.state = {
      selectedCandidate: null,
    };
  }

  handleToggle = candidate => () => {
    // TODO: rewrite to tripple if    
    let newCandidate = null;
    if (candidate !== this.state.selectedCandidate) {      
      this.props.candidateSelected(candidate);
      newCandidate = candidate;
    } else {
      this.props.candidateUnselected();
    }

    this.setState({
      selectedCandidate: newCandidate,
    });
  }

  render() {
    return (
      <MyList dense>
        {this.props.candidates.map((candidate, index) => (
          <Candidate
            key={index}
            nameAndSurname={`${candidate.name} ${candidate.surname}`}
            onChange={this.handleToggle(candidate)}
            checked={candidate === this.state.selectedCandidate}
          />
        ))}
      </MyList>
    );
  }
}

// TODO: Fix this
export default CandidatesList;
