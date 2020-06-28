import React from 'react';

import Election from '../Election/Election/Election.jsx';
import ElectionFetching from './ElectionFetching.jsx';
import ErrorMessage from './ErrorMessage.jsx';
import ElectionAPI from '../../services/electionAPI.js';

class App extends React.Component {
  // TODO: Move error to distinc class/function
  unregisterdVoterErrorTitle = 'Unregistered public key'

  unregisterdVoterErrorMessage = 'Sorry but your public key was not recognized'

  userHasAlreadyVotedErrorTitle = 'Thank you for voting!'

  userHasAlreadyVotedErrorMessage =
    'You have already voted so you unable to see the list of candites right now. Wait please for the final results publication'

  constructor() {
    super();
    this.state = {
      appplicationState: '',
    };
  }

  componentDidMount() {
    this.setState({ appplicationState: 'connectingToBlockchain' });
    const onFailure = () => {
      // TODO: add a new flag for the problem
      this.setState({ appplicationState: 'unregisteredUser' });
    };

    const successfulConnectionConditions = [
      new ElectionAPI().isUserRegistered(onFailure),
      new ElectionAPI().hasUserAlreadyVoted(onFailure),
    ];

    // TODO: Error handling
    Promise.all(successfulConnectionConditions)
      .then((values) => {
        const isUserRegistered = values[0];
        const userVoted = values[1];

        if (!isUserRegistered) {
          this.setState({ appplicationState: 'unregisteredUser' });
        } else if (userVoted) {
          this.setState({ appplicationState: 'userHasAlreadyVoted' });
        } else {
          // TODO: BEtter error handling
          new ElectionAPI()
            .getElection(onFailure)
            .then((election) => {
              console.log(election);
              
              this.setState({
                appplicationState: 'connectedToBlockchain',
                title: election.electionTitle,
                candidates: election.candidates,
              });
            })
            .catch(error => console.log(error));
        }
      })
      .catch((error) => {
        console.log('erro in first catch');
        console.log(error);
      });
  }

  render() {
    // TODO: The name valid is stupid change it
    // TODO: Handle the MetaMask error

    // TODO: Refactor the state, let it hold a flag indicating wether it is okay and not
    // move the messages to the reducer
    // TODO: Handle nulls for titile and candidates
    const { appplicationState, title, candidates } = this.state;
    return (
      <div>
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
          <Election title={title} candidates={candidates} />
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
