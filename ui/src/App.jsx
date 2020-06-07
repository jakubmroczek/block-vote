import 'babel-polyfill';
import 'whatwg-fetch';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import AppContents from './AppContents.jsx';

/* eslint "react/react-in-jsx-scope": "off" */

const element = (
  <Router>
    <AppContents />
  </Router>
);

ReactDOM.render(element,
  document.getElementById('contents'));

if (module.hot) {
  module.hot.accept();
}
