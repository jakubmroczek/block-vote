import React from 'react';
import { Button } from 'react-bootstrap';

import './fontawesome.js';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function ActionsItem({ handleEdit, handleRemove }) {
  return (
    <>
      <Button onClick={handleEdit} variant="secondary">
        <FontAwesomeIcon icon={faPen} />
      </Button>
      {' '}
      <Button onClick={handleRemove} variant="secondary">
        <FontAwesomeIcon icon={faTrash} />
      </Button>

    </>
  );
}
