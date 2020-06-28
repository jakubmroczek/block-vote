import * as React from 'react';

import { Form } from 'react-bootstrap';

// TODO: Change props to name, surnmae not nameAndSurname
export default function Candidate(props) {
  return (
    <>
      <tr>
        <td>{props.nameAndSurname}</td>
        <td>{props.nameAndSurname}</td>
        <td>
          <Form.Check aria-label="option 1" />
          {/* <Checkbox
          edge="end"
          onChange={props.onChange}
          checked={props.checked}
        /> */}
        </td>
      </tr>
    </>
  );
}
