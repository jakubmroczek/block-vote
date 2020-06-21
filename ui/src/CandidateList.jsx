import React, { useState } from 'react';
import {
  Button, Table, Modal, Form, FormGroup, ButtonToolbar, Card,
} from 'react-bootstrap';
import './fontawesome.js';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ActionsItem from './ActionsItem.jsx';

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
  index, candidate, visible, hideEdit, handleEdit,
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
    handleEdit(index, updatedCandidate);
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
          {' '}
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

    const { index, removeCandidate } = this.props;
    removeCandidate(index);
  }

  render() {
    const { editVisible, removeVisible } = this.state;

    const { index, candidate, updateCandidate } = this.props;
    const { name, surname } = candidate;
    return (
      <>
        <tr>
          <td>{name}</td>
          <td>{surname}</td>
          <td>
            <ActionsItem handleEdit={this.showEdit} handleRemove={this.showRemove} />
          </td>
        </tr>
        <CandidateEditModal
          index={index}
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
    .map((candidate, index) => (
      <CandidateRow
        index={index}
        key={candidate.id}
        candidate={candidate}
        updateCandidate={update}
        removeCandidate={remove}
      />
    ));

  return (
    <Table bordered condensed hover responsive className="text-left">
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
    const { candidates } = this.props;
    this.state = {
      candidates,
      candidateAddVisible: false,
    };

    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.remove = this.remove.bind(this);

    this.showCandidateAddModal = this.showCandidateAddModal.bind(this);
    this.hideCanddiateAddModal = this.hideCanddiateAddModal.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { candidates } = this.props;
    if (candidates !== prevProps.candidates) {
      this.setState({ candidates });
    }
  }

  async create(candidate) {
    const { candidates } = this.state;
    const updatedCandidates = Array.from(candidates);
    updatedCandidates.push(candidate);
    const changes = { candidates: updatedCandidates };

    const { update } = this.props;
    update(changes);
  }

  async update(index, candidate) {
    const { candidates } = this.state;
    const updatedCandidates = Array.from(candidates);
    updatedCandidates[index] = candidate;
    const changes = { candidates: updatedCandidates };

    const { update } = this.props;
    update(changes);
  }

  async remove(index) {
    const { candidates } = this.state;
    const updatedCandidates = Array.from(candidates);
    updatedCandidates.splice(index, 1);
    const changes = { candidates: updatedCandidates };

    const { update } = this.props;
    update(changes);
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
      <Card className="text-center">
        <Card.Header as="h5">Candidates</Card.Header>
        <Card.Body>
          <CandidateTable
            candidates={candidates}
            update={this.update}
            remove={this.remove}
          />
          <Button onClick={this.showCandidateAddModal} variant="secondary">
            <FontAwesomeIcon icon={faPlus} />
          </Button>
          <CandidateAddModal
            visible={candidateAddVisible}
            hide={this.hideCanddiateAddModal}
            add={this.create}
          />
        </Card.Body>
      </Card>
    );
  }
}
