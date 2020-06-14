import React, { useState } from 'react';
import {
  Button, Table, Modal, Form, FormGroup, ButtonToolbar, Card,
} from 'react-bootstrap';
import './fontawesome.js';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import graphQLFetch from './graphQLFetch.js';
import ActionsItem from './ActionsItem.jsx';

function ParticipantUpdateModal({
  index, participant, visible, hide, update,
}) {
  const { email } = participant;
  const [newEmail, setNewEmail] = useState(email);

  const onClick = (event) => {
    event.preventDefault();
    hide();

    const form = document.forms.participantUpdate;
    const changes = {
      email: form.email.value,
    };

    const updatedParticipant = Object.assign(participant, changes);

    update(index, updatedParticipant);
  };

  return (
    <Modal
      keyboard
      show={visible}
      onHide={hide}
      style={{ opacity: 1 }}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Edit participant</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form name="participantUpdate">
          <FormGroup>
            <Form.Label>E-mail</Form.Label>
            <Form.Control
              name="email"
              autoFocus
              value={newEmail}
              onChange={e => setNewEmail(e.target.value)}
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
          <Button onClick={hide}>Cancel</Button>
        </ButtonToolbar>
      </Modal.Footer>
    </Modal>
  );
}


function ParticipantRemoveModal({
  index, participant, visible, hide, remove,
}) {
  const onRemove = () => {
    hide();
    remove(index);
  };

  const { email } = participant;
  return (
    <Modal
      keyboard
      show={visible}
      onHide={hide}
      style={{ opacity: 1 }}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>
          Do you want to remove
          {email}
          {' '}
          ?
        </Modal.Title>
      </Modal.Header>
      <Modal.Footer>
        <ButtonToolbar>
          <Button type="button" onClick={onRemove}>Yes</Button>
          <Button type="button" onClick={hide}>No</Button>
        </ButtonToolbar>
      </Modal.Footer>
    </Modal>
  );
}


class ParticipantRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      participantRemoveVisible: false,
      participantUpdateModalVisible: false,
    };

    this.showParticipantRemoveModal = this.showParticipantRemoveModal.bind(this);
    this.hideParticipantRemoveModal = this.hideParticipantRemoveModal.bind(this);

    this.showParticipantUpdateModal = this.showParticipantUpdateModal.bind(this);
    this.hideParticipantUpdateModal = this.hideParticipantUpdateModal.bind(this);
  }

  showParticipantRemoveModal() {
    this.setState({ participantRemoveVisible: true });
  }

  hideParticipantRemoveModal() {
    this.setState({ participantRemoveVisible: false });
  }

  showParticipantUpdateModal() {
    this.setState({ participantUpdateModalVisible: true });
  }

  hideParticipantUpdateModal() {
    this.setState({ participantUpdateModalVisible: false });
  }

  render() {
    const { participantRemoveVisible, participantUpdateModalVisible } = this.state;
    const {
      index, update, remove, participant,
    } = this.props;
    const { email } = participant;

    return (
      <>
        <tr>
          <td>{email}</td>
          <td>
            <ActionsItem handleEdit={this.showParticipantUpdateModal} handleRemove={this.showParticipantRemoveModal} />
          </td>
        </tr>
        <ParticipantRemoveModal
          index={index}
          participant={participant}
          visible={participantRemoveVisible}
          hide={this.hideParticipantRemoveModal}
          remove={remove}
        />
        <ParticipantUpdateModal
          index={index}
          participant={participant}
          visible={participantUpdateModalVisible}
          hide={this.hideParticipantUpdateModal}
          update={update}
        />
      </>
    );
  }
}

function ParticipantAddModal({ visible, hide, add }) {
  const onClick = (event) => {
    event.preventDefault();
    hide();

    const form = document.forms.participantAdd;
    const participant = {
      email: form.email.value,
    };

    add(participant);
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
          <Modal.Title>Add participant</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form name="participantAdd">
            <FormGroup>
              <Form.Label>E-mail</Form.Label>
              <Form.Control name="email" autoFocus />
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

function ParticipantTable({ participants, update, remove }) {
  const rows = participants.map((participant, index) => (
    <ParticipantRow
      index={index}
      key={index}
      participant={participant}
      update={update}
      remove={remove}
    />
  ));

  return (
    <>
      <Table bordered condensed hover responsive className="text-left">
        <thead>
          <tr>
            <th>E-mail</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </Table>
    </>
  );
}

export default class ParticipantList extends React.Component {
  constructor(props) {
    super(props);
    const { participants } = this.props;
    this.state = {
      participants,
      addModalVisible: false,
    };

    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.remove = this.remove.bind(this);
    this.showParticipantAddModal = this.showParticipantAddModal.bind(this);
    this.hideParticipantAddModal = this.hideParticipantAddModal.bind(this);
  }

  async read() {
    const query = `query 
        getElection($id: ID!) {
                getElection(id: $id) {
                    participants {
                        email 
                    }  
                }
    }`;

    const { id } = this.props;
    const vars = { id };

    const data = await graphQLFetch(query, vars);

    const { getElection } = data;
    const { participants } = getElection;
    if (participants) {
      this.setState({ participants });
    } else {
      alert('Could not fetch participant from the server');
    }
  }

  async create(participant) {
    const query = `mutation 
    updateElection($id: ID!, $changes: ElectionUpdateInputs!) {
      updateElection(id: $id, changes: $changes) {
        _id      
      }
}`;

    const { id } = this.props;

    const { participants } = this.state;
    const updatedParticipants = Array.from(participants);
    updatedParticipants.push(participant);
    const changes = { participants: updatedParticipants };

    const vars = { id, changes };
    const data = await graphQLFetch(query, vars);
    if (data) {
      this.read();
    } else {
      alert(`Could not add participant ${participant.email}`);
    }
  }

  async update(index, participant) {
    const query = `mutation 
        updateElection($id: ID!, $changes: ElectionUpdateInputs!) {
          updateElection(id: $id, changes: $changes) {
            _id      
          }
    }`;

    const { id } = this.props;

    const { participants } = this.state;
    const updatedParticipants = Array.from(participants);
    updatedParticipants[index] = participant;
    const changes = { participants: updatedParticipants };

    const vars = { id, changes };
    const data = await graphQLFetch(query, vars);
    if (data) {
      this.read();
    } else {
      alert(`Could not update participant ${participant.email}`);
    }
  }

  async remove(index) {
    const query = `mutation 
        updateElection($id: ID!, $changes: ElectionUpdateInputs!) {
          updateElection(id: $id, changes: $changes) {
            _id      
          }
    }`;

    const { id } = this.props;

    const { participants } = this.state;
    const updatedParticipants = Array.from(participants);
    updatedParticipants.splice(index, 1);
    const changes = { participants: updatedParticipants };

    const vars = { id, changes };
    const data = await graphQLFetch(query, vars);
    if (data) {
      this.read();
    } else {
      alert(`Could not remove a participant of a index ${index}`);
    }
  }

  showParticipantAddModal() {
    this.setState({ addModalVisible: true });
  }

  hideParticipantAddModal() {
    this.setState({ addModalVisible: false });
  }

  render() {
    const { participants, addModalVisible } = this.state;
    return (
      <Card className="text-center">
        <Card.Header as="h5">Participants</Card.Header>
        <Card.Body>
          <ParticipantTable participants={participants} update={this.update} remove={this.remove} />
          <Button onClick={this.showParticipantAddModal} variant="secondary">
            <FontAwesomeIcon icon={faPlus} />
          </Button>
          <ParticipantAddModal
            visible={addModalVisible}
            hide={this.hideParticipantAddModal}
            add={this.create}
          />
        </Card.Body>

      </Card>
    );
  }
}
