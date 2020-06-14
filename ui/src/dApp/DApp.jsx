import React from 'react';

import { Provider } from 'react-redux';
import App from './containers/App/App.js';

// TODO: Move this directly to the voting app
import store from './store.js';

export default function DApp() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}
