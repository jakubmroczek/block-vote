import * as React from 'react';
import { Table } from 'react-bootstrap';

// TODO: Rename to CandidateRow and move it here
import Candidate from '../Candidate/Candidate.jsx';
import SendVoteButton from '../../SendVoteButton.jsx'
import ElectionAPI from '../../../services/electionAPI.js';

export default class CandidatesList extends React.Component {
  constructor(props) {
    super(props);

    // -1 should be a constant.
    this.state = {
      selectedCandidate: null,
    };

    this.onClick = this.onClick.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
  }

  onClick() {
    const { selectedCandidate } = this.state;

    // TODO: should it be comparet in this way?
    if (selectedCandidate !== null) {
      // TODO: Should this logic be here?
      // I must get candidateId somehow
      // TODO: Catch error
      new ElectionAPI()
        .vote(selectedCandidate)
        .then(() => {
          window.location.reload(false);
        })
        .catch(error => console.log(error));
    } else {
      alert('Please select a candidate before voting');
    }
  }

  handleToggle(index) {
    const { candidates } = this.props;
    const candidate = candidates[index] !== this.state.selectedCandidate ?  candidates[index] : null;
    
    this.setState({
      selectedCandidate: candidate,
    });
  }

  render() {    
    const { candidates } = this.props;
    const rows = candidates.map((candidate, index) => (
      <Candidate
        key={index}
        index={index}
        name={candidate.name}
        surname={candidate.surname}
        onChange={e => this.handleToggle(e.target.name)}
        checked={candidate === this.state.selectedCandidate}
      />
    ));

    return (
      <>
        <Table bordered condensed hover responsive className="text-left">
          <tbody>
            {rows}
          </tbody>
        </Table>
        <SendVoteButton onClick={this.onClick} />
      </>
    );
  }
}
