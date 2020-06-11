import * as React from 'react';

import {
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Checkbox,
} from '@material-ui/core';

// TODO: Refactor this
const object = { variant: 'h5', padding: '100px' };

export function Candidate(props) {
  return (
    <ListItem key={props.index}>
      <ListItemText
        primary={props.nameAndSurname}
        primaryTypographyProps={object}
      />
      <ListItemSecondaryAction>
        <Checkbox
          edge="end"
          onChange={props.onChange}
          checked={props.checked}
        />
      </ListItemSecondaryAction>
    </ListItem>
  );
}
