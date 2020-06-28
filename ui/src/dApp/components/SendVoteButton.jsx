import * as React from 'react';

import { Button } from 'react-bootstrap';

// TODO: Move this to reducer
import ElectionAPI from '../services/electionAPI.js';

class SendVoteButton extends React.Component {
  constructor() {
    super();
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    const { selectedCandidate } = this.props;

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

  render() {
    return (
      <div>
        <Button variant="outlined" onClick={this.onClick}>
          Vote
        </Button>
      </div>
    );
  }
}

// TODO: Is this correct?
export default SendVoteButton;
