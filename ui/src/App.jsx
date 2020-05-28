import 'babel-polyfill';
import 'whatwg-fetch';
import React from 'react';
import ReactDOM from 'react-dom';

/* eslint "react/react-in-jsx-scope": "off" */

import IssueList from './IssueList.jsx';

const element = <IssueList />;
ReactDOM.render(element,
  document.getElementById('contents'));
