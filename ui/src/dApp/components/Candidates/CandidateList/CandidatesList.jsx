import * as React from 'react';
import { Table } from 'react-bootstrap';

// TODO: Rename to CandidateRow and move it here
import Candidate from '../Candidate/Candidate.jsx';

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
    const rows = this.props.candidates.map((candidate, index) => (
      <Candidate
        key={index}
        name={candidate.name}
        surname={candidate.surname}
        onChange={this.handleToggle(candidate)}
        checked={candidate === this.state.selectedCandidate}
      />
    ));

    return (
      <Table bordered condensed hover responsive className="text-left">
        <tbody>
          {rows}
        </tbody>
      </Table>
    );
  }
}

// TODO: Fix this
export default CandidatesList;
