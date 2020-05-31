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
    const query = `query {
        electionTitle 
    }`;

    const data = await graphQLFetch(query);

    if (data) {
      this.setState({ title: data.electionTitle });
    } else {
      alert('Could not fetch election title');
    }
  }

  async update(title) {
    const query = `mutation updateElectionTitle($title: String!) {
        updateElectionTitle(title: $title)
    }`;

    const data = await graphQLFetch(query, { title });

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
