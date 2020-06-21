import React from 'react';
import {
  Button, Form, FormGroup, Card,
} from 'react-bootstrap';

export default class ElectionTitleForm extends React.Component {
  constructor(props) {
    super(props);
    const { title } = this.props;
    this.state = {
      title,
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { title } = this.props;
    if (title !== prevProps.title) {
      this.setState({ title });
    }
  }

  onChange(event) {
    this.setState({ title: event.target.value });
  }

  onSubmit() {
    const { title } = this.state;
    this.update(title);
  }

  async update(title) {
    const changes = { title };
    const { update } = this.props;
    update(changes);
  }

  render() {
    const { title } = this.state;
    return (
      <Card className="text-center">
        <Card.Header as="h5">Election Title</Card.Header>
        <Card.Body>
          <Form name="electionTitle">
            <FormGroup>
              <Form.Control
                name="title"
                autoFocus
                value={title}
                onChange={this.onChange}
              />
            </FormGroup>
          </Form>
          <Button onClick={this.onSubmit} variant="secondary"> Save election title</Button>
        </Card.Body>
      </Card>
    );
  }
}
