import React from 'react';

import { Provider } from 'react-redux';
import App from './dApp/containers/App/App.js';

// TODO: Move this directly to the voting app
import store from './dApp/store.js';

export default function VotingdApp() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}
