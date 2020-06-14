import React from 'react';

// get our fontawesome imports
import './fontawesome.js';
import { faImages } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function ActionsItem({handleEdit, handleRemove}) {
//     <Button onClick={this.showEdit}>
//     Edit
//   </Button>
//   {'    '}
//   <Button onClick={this.showRemove}>
//     Remove
//   </Button>
  
    return (
    <>
      <FontAwesomeIcon icon={faImages} />
    </>
  );
}
