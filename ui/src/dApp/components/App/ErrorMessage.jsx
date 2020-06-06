import * as React from 'react';
import { Card, CardContent, Typography } from '@material-ui/core';
import { StyleCardHeader } from '../Common/StyledCardHeader.js';

function ErrorMessage({ messageTitle, message }) {
  return (
    <Card>
      <StyleCardHeader title={messageTitle} />
      <CardContent variant="h1">
        <Typography>
          {' '}
          {message}
          {' '}
        </Typography>
      </CardContent>
    </Card>
  );
}

// TODO: Is this needed
export default ErrorMessage;
