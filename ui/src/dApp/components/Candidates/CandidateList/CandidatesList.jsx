import * as React from 'react';
import { Table } from 'react-bootstrap';

// TODO: Rename to CandidateRow and move it here
import { Candidate } from '../Candidate/Candidate.jsx';

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
      <Table bordered condensed hover responsive className="text-left">
        <thead>
          <tr>
            <th>Name</th>
            <th>Surname</th>
            <th>Choose</th>
          </tr>
        </thead>
        <tbody>
          {/* TODO: Move this to render */}
          {this.props.candidates.map((candidate, index) => (
            <Candidate
              key={index}
              nameAndSurname={`${candidate.name} ${candidate.surname}`}
              onChange={this.handleToggle(candidate)}
              checked={candidate === this.state.selectedCandidate}
            />
          ))}
        </tbody>

      </Table>
    );
  }
}

// TODO: Fix this
export default CandidatesList;
