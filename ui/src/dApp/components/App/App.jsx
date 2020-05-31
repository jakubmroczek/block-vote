import React from 'react';

import './App.css';

// TODO: Fix this
import Election from '../Election/Election/Election.jsx';
import ElectionFetching from './ElectionFetching.jsx';
import ErrorMessage from './ErrorMessage.jsx';

class App extends React.Component {
  // TODO: Move error to distinc class/function
  unregisterdVoterErrorTitle = 'Unregistered public key'

  unregisterdVoterErrorMessage = 'Sorry but your public key was not recognized'

  userHasAlreadyVotedErrorTitle = 'Thank you for voting!'

  userHasAlreadyVotedErrorMessage =
    'You have already voted so you unable to see the list of candites right now. Wait please for the final results publication'

  componentDidMount() {
    const { connectToBlockchain } = this.props;
    connectToBlockchain();
  }

  render() {
    // TODO: The name valid is stupid change it
    // TODO: Handle the MetaMask error

    // TODO: Refactor the state, let it hold a flag indicating wether it is okay and not
    // move the messages to the reducer
    const { appplicationState } = this.props;
    return (
      <div className="App">
        {appplicationState === 'unregisteredUser' && (
          <ErrorMessage
            messageTitle={this.unregisterdVoterErrorTitle}
            message={this.unregisterdVoterErrorMessage}
          />
        )}
        {appplicationState === 'connectingToBlockchain' && (
          <ElectionFetching />
        )}
        {appplicationState === 'connectedToBlockchain' && (
          <Election />
        )}
        {appplicationState === 'userHasAlreadyVoted' && (
          <ErrorMessage
            messageTitle={this.userHasAlreadyVotedErrorTitle}
            message={this.userHasAlreadyVotedErrorMessage}
          />
        )}
      </div>
    );
  }
}

// TODO: Is this correct?
export default App;
