import * as React from 'react';
import { Card, CardContent } from '@material-ui/core';
import { StyleCardHeader } from '../Common/StyledCardHeader.js';
import CircularDeterminate from './CircularDeterminate.jsx';

// TODO: Move title to the constants
function ElectionFetching() {
  return (
    <Card>
      <StyleCardHeader title="Connecting to the blockchain" />
      <CardContent variant="h1">
        <CircularDeterminate />
      </CardContent>
    </Card>
  );
}

// TODO: Is this needed
export default ElectionFetching;
