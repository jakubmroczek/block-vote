import * as React from 'react';

import { Form } from 'react-bootstrap';

// TODO: Change props to name, surnmae not nameAndSurname
export default function Candidate({ index, name, surname, checked, onChange }) {
  return (
    <>
      <tr>
        <td>{name}</td>
        <td>{surname}</td>
        <td>
          <Form.Check
            name={index}
            aria-label="option 1"
            checked={checked}
            onChange={onChange}
          />
        </td>
      </tr>
    </>
  );
}
