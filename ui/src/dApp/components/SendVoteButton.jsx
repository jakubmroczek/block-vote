import * as React from 'react';

import { Button } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';

// TODO: Move this to reducer
import { ElectionAPI } from '../services/electionAPI.js';

const MyButton = styled(Button)({
  background: '#ff884d',
  border: 0,
  borderRadius: 3,
  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  color: 'white',
  height: 48,
  padding: '30px',
  margin: '10px',
});

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
        <MyButton variant="outlined" onClick={this.onClick}>
          Vote
        </MyButton>
      </div>
    );
  }
}

// TODO: Is this correct?
export default SendVoteButton;
