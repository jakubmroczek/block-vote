/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { Card, Table } from 'react-bootstrap';

function ElectionRow({ election }) {
  const { title } = election;
  return (
    <>
      <tr>
        <td>{title}</td>
      </tr>
    </>
  );
}

function ElectionTable({ elections }) {
  const rows = elections
    .map((election, index) => (
      <ElectionRow
        index={index}
        election={election}
      />
    ));

  return (
    <Table bordered condensed hover responsive className="text-left">
      <tbody>
        {rows}
      </tbody>
    </Table>
  );
}

export default class ElectionList extends React.Component {
  render() {
    const { elections } = this.props;

    return (
      <Card className="text-center mt-2 mr-3">
        <Card.Header as="h5">Your elections:</Card.Header>
        <Card.Body>
          <ElectionTable
            elections={elections}
          />
        </Card.Body>
      </Card>
    );
  }
}
