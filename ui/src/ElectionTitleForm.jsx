import React from 'react';
import { Button, Form, FormGroup } from 'react-bootstrap';
import graphQLFetch from './graphQLFetch.js';

export default class ElectionTitleForm extends React.Component {
  constructor() {
    super();
    this.state = {
      title: '',
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.read();
  }

  onChange(event) {
    this.setState({ title: event.target.value });
  }

  onSubmit() {
    const { title } = this.state;
    this.update(title);
  }

  async read() {
    const query = `query 
        getElection($id: ID!) {
                getElection(id: $id) {
                    title  
                }
    }`;

    const { id } = this.props;
    const vars = { id };
    const data = await graphQLFetch(query, vars);

    const { getElection } = data;
    const { title } = getElection;

    if (title) {
      this.setState({ title });
    } else {
      alert('Could not fetch election title');
    }
  }

  async update(title) {
    const query = `mutation 
        updateElection($id: ID!, $changes: ElectionUpdateInputs!) {
          updateElection(id: $id, changes: $changes) {
                  title
                }
    }`;

    const { id } = this.props;
    const changes = { title };
    const vars = { id, changes };
    const data = await graphQLFetch(query, vars);
    if (data) {
      this.read();
    } else {
      alert(`Could not update election title ${title}`);
    }
  }

  render() {
    const { title } = this.state;
    return (
      <>
        <Form name="electionTitle">
          <FormGroup>
            <Form.Label>Election title</Form.Label>
            <Form.Control
              name="title"
              autoFocus
              value={title}
              onChange={this.onChange}
            />
          </FormGroup>
        </Form>
        <Button onClick={this.onSubmit}> Save election title</Button>
      </>
    );
  }
}
