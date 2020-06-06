import React, { useState } from 'react';
import {
  Button, Table, Modal, Form, FormGroup, ButtonToolbar,
} from 'react-bootstrap';
import graphQLFetch from './graphQLFetch.js';

function ParticipantUpdateModal({
  participant, visible, hide, update,
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
    
    update(updatedParticipant);
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
  participant, visible, hide, remove,
}) {
  const onRemove = () => {
    const { _id } = participant;
    hide();
    remove(_id);
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
    const { update, remove, participant } = this.props;
    const { email } = participant;

    return (
      <>
        <tr>
          <td>{email}</td>
          <td>
            <Button onClick={this.showParticipantUpdateModal}>
              Edit
            </Button>
            {' '}
            <Button onClick={this.showParticipantRemoveModal}>
              Remove
            </Button>
          </td>
        </tr>
        <ParticipantRemoveModal
          participant={participant}
          visible={participantRemoveVisible}
          hide={this.hideParticipantRemoveModal}
          remove={remove}
        />
        <ParticipantUpdateModal
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
      key={index}
      participant={participant}
      update={update}
      remove={remove}
    />
  ));

  return (
    <>
      <Table bordered condensed hover responsive>
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
  constructor() {
    super();
    this.state = {
      participants: [],
      addModalVisible: false,
    };

    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.remove = this.remove.bind(this);
    this.showParticipantAddModal = this.showParticipantAddModal.bind(this);
    this.hideParticipantAddModal = this.hideParticipantAddModal.bind(this);
  }

  componentDidMount() {
    this.read();
  }

  async read() {
    const query = `query {
        participantList {
          _id email
        }
      }`;

    const data = await graphQLFetch(query);
    if (data) {
      this.setState({ participants: data.participantList });
    } else {
      alert('Could not fetch participant from the server');
    }
  }

  async create(participant) {
    const query = `mutation addParticipant($participant: ParticipantInputs!) {
        addParticipant(participant: $participant) {
              _id email
          }
      }`;

    const data = await graphQLFetch(query, { participant });
    if (data) {
      this.read();
    } else {
      alert(`Could not add participant ${participant.email}`);
    }
  }

  async update(participant) {
    const query = `mutation updateParticipant($_id: ID!
        $changes: ParticipantUpdateInputs!) {
            updateParticipant(_id: $_id , changes: $changes) {
            _id 
        }
    }`;

    const { _id } = participant;
    const changes = { email: participant.email };
    const data = await graphQLFetch(query, { _id, changes });

    if (data) {
      this.read();
    } else {
      alert(`Could not update participant ${participant.email}`);
    }
  }

  async remove(_id) {
    const query = `mutation removeParticipant($_id: ID!) {
        removeParticipant(_id: $_id) 
    }`;

    const data = await graphQLFetch(query, { _id });

    if (data) {
      this.read();
    } else {
      alert(`Could not remove a participant of a ID: ${_id}`);
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
      <>
        <ParticipantTable participants={participants} update={this.update} remove={this.remove} />
        <Button onClick={this.showParticipantAddModal}>Add a new participant</Button>
        <ParticipantAddModal
          visible={addModalVisible}
          hide={this.hideParticipantAddModal}
          add={this.create}
        />
      </>
    );
  }
}
