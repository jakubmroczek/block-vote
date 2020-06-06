import React, { useState } from 'react';
import {
  Button, Table, Modal, Form, FormGroup, ButtonToolbar,
} from 'react-bootstrap';

import graphQLFetch from './graphQLFetch.js';

function CandidateRemoveModal({
  candidate, visible, hideRemove, handleRemove,
}) {
  const { name, surname } = candidate;
  return (
    <Modal
      keyboard
      show={visible}
      onHide={hideRemove}
      style={{ opacity: 1 }}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>
          Do you want to remove
          {' '}
          {name}
          {' '}
          {surname}
          {' '}
          ?
        </Modal.Title>
      </Modal.Header>
      <Modal.Footer>
        <ButtonToolbar>
          <Button type="button" onClick={handleRemove}>Yes</Button>
          <Button type="button" onClick={hideRemove}>No</Button>
        </ButtonToolbar>
      </Modal.Footer>
    </Modal>
  );
}

function CandidateEditModal({
  candidate, visible, hideEdit, handleEdit,
}) {
  const { name, surname } = candidate;
  const [newName, setNewName] = useState(name);
  const [newSurname, setNewSurname] = useState(surname);

  const onClick = (event) => {
    event.preventDefault();
    hideEdit();

    const form = document.forms.candidateEdit;
    const changes = {
      name: form.name.value,
      surname: form.surname.value,
    };

    const updatedCandidate = Object.assign(candidate, changes);
    // TODO: Different name
    handleEdit(updatedCandidate);
  };

  return (
    <Modal
      keyboard
      show={visible}
      onHide={hideEdit}
      style={{ opacity: 1 }}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Edit candidate</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form name="candidateEdit">
          <FormGroup>
            <Form.Label>Name</Form.Label>
            <Form.Control
              name="name"
              autoFocus
              value={newName}
              onChange={e => setNewName(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Form.Label>Surname</Form.Label>
            <Form.Control
              name="surname"
              value={newSurname}
              onChange={e => setNewSurname(e.target.value)}
            />
          </FormGroup>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <ButtonToolbar>
          <Button
            type="button"
            onClick={onClick}
          >
            Submit
          </Button>
          <Button onClick={hideEdit}>Cancel</Button>
        </ButtonToolbar>
      </Modal.Footer>
    </Modal>
  );
}

class CandidateRow extends React.Component {
  constructor() {
    super();
    this.state = ({
      editVisible: false,
      removeVisible: false,
    });
    this.showEdit = this.showEdit.bind(this);
    this.hideEdit = this.hideEdit.bind(this);
    this.showRemove = this.showRemove.bind(this);
    this.hideRemove = this.hideRemove.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
  }

  showEdit() {
    this.setState({ editVisible: true });
  }

  hideEdit() {
    this.setState({ editVisible: false });
  }

  showRemove() {
    this.setState({ removeVisible: true });
  }

  hideRemove() {
    this.setState({ removeVisible: false });
  }

  async handleRemove(e) {
    e.preventDefault();
    this.hideRemove();

    const { candidate } = this.props;
    const { _id } = candidate;
    const { removeCandidate } = this.props;

    removeCandidate(_id);
  }

  render() {
    const { editVisible, removeVisible } = this.state;

    const { candidate, updateCandidate } = this.props;
    const { name, surname } = candidate;
    return (
      <>
        <tr>
          <td>{name}</td>
          <td>{surname}</td>
          <td>
            <Button onClick={this.showEdit}>
              Edit
            </Button>
            {'    '}
            <Button onClick={this.showRemove}>
              Remove
            </Button>
          </td>
        </tr>
        <CandidateEditModal
          candidate={candidate}
          visible={editVisible}
          hideEdit={this.hideEdit}
          handleEdit={updateCandidate}
        />
        <CandidateRemoveModal
          candidate={candidate}
          visible={removeVisible}
          hideRemove={this.hideRemove}
          handleRemove={this.handleRemove}
        />
      </>
    );
  }
}

function CandidateAddModal({ visible, hide, add }) {
  const onClick = (event) => {
    event.preventDefault();
    hide();

    const form = document.forms.candidateAdd;
    const candidate = {
      name: form.name.value,
      surname: form.surname.value,
    };

    add(candidate);
  };

  return (
    <React.Fragment>
      <Modal
        keyboard
        show={visible}
        onHide={hide}
        style={{ opacity: 1 }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Add candidate</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form name="candidateAdd">
            <FormGroup>
              <Form.Label>Name</Form.Label>
              <Form.Control name="name" autoFocus />
            </FormGroup>
            <FormGroup>
              <Form.Label>Surname</Form.Label>
              <Form.Control name="surname" />
            </FormGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <ButtonToolbar>
            <Button
              type="button"
              onClick={onClick}
            >
              Add
            </Button>
            <Button onClick={hide}>Cancel</Button>
          </ButtonToolbar>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
}

function CandidateTable({ candidates, update, remove }) {
  const rows = candidates
    .map(candidate => (
      <CandidateRow
        key={candidate.id}
        candidate={candidate}
        updateCandidate={update}
        removeCandidate={remove}
      />
    ));

  return (
    <Table bordered condensed hover responsive>
      <thead>
        <tr>
          <th>Name</th>
          <th>Surname</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {rows}
      </tbody>
    </Table>
  );
}

export default class CandidateList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      candidates: [],
      candidateAddVisible: false,
    };

    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.remove = this.remove.bind(this);

    this.showCandidateAddModal = this.showCandidateAddModal.bind(this);
    this.hideCanddiateAddModal = this.hideCanddiateAddModal.bind(this);
  }

  componentDidMount() {
    this.read();
  }

  async read() {
    const query = `query {
      candidateList {
        _id name surname
      }
    }`;

    const data = await graphQLFetch(query, []);
    if (data) {
      this.setState({ candidates: data.candidateList });
    } else {
      alert('Could not fetch candidates from the server');
    }
  }

  async create(candidate) {
    const query = `mutation addCandiate($candidate: CandidateInputs!) {
      addCandiate(candidate: $candidate) {
            _id name surname
        }
    }`;

    const data = await graphQLFetch(query, { candidate });
    if (data) {
      this.read();
    } else {
      alert(`Could not add candidate ${candidate.name} ${candidate.surname}`);
    }
  }

  async update(candidate) {
    const query = `mutation updateCandidate($_id: ID!
        $changes: CandidateUpdateInputs!) {
        updateCandidate(_id: $_id , changes: $changes) {
            _id 
        }
    }`;

    const { _id } = candidate;
    const changes = { name: candidate.name, surname: candidate.surname };
    const data = await graphQLFetch(query, { _id, changes });

    if (data) {
      this.read();
    } else {
      alert(`Could not update candidate ${candidate.name} ${candidate.surname}`);
    }
  }

  async remove(_id) {
    const query = `mutation removeCandidate($_id: ID!) {
        removeCandidate(_id: $_id) 
    }`;

    const data = await graphQLFetch(query, { _id });

    if (data) {
      this.read();
    } else {
      alert(`Could not remove a candidate of a ID: ${_id}`);
    }
  }

  showCandidateAddModal() {
    this.setState({ candidateAddVisible: true });
  }

  hideCanddiateAddModal() {
    this.setState({ candidateAddVisible: false });
  }

  render() {
    const { candidates, candidateAddVisible } = this.state;
    return (
      <>
        <CandidateTable
          candidates={candidates}
          update={this.update}
          remove={this.remove}
        />

        <Button onClick={this.showCandidateAddModal}>Add a new candidate</Button>
        <CandidateAddModal
          visible={candidateAddVisible}
          hide={this.hideCanddiateAddModal}
          add={this.create}
        />
      </>
    );
  }
}
