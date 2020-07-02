import React from 'react';
import {
  Modal, Button,
} from 'react-bootstrap';

export default class SignInItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.signIn = this.signIn.bind(this);
  }

  async componentDidMount() {
    const clientId = window.ENV.GOOGLE_CLIENT_ID;
    if (!clientId) {
      return;
    }
    window.gapi.load('auth2', () => {
      if (!window.gapi.auth2.getAuthInstance()) {
        window.gapi.auth2.init({ client_id: clientId }).then(() => {
        });
      }
    });
  }

  async signIn() {
    this.hideModal();

    let googleToken;
    try {
      const auth2 = window.gapi.auth2.getAuthInstance();
      const googleUser = await auth2.signIn();
      googleToken = googleUser.getAuthResponse().id_token;
    } catch (e) {
      const message = JSON.stringify(e);
      alert(`Error authenticating with Google: ${message}`);
    }

    try {
      const apiEndpoint = window.ENV.UI_AUTH_ENDPOINT;
      const response = await fetch(`${apiEndpoint}/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ google_token: googleToken }),
      });

      const body = await response.text();
      const result = JSON.parse(body);

      const { signedIn, email } = result;

      // TODO: Reorganize this code
      const user = { signedIn, email };
      const { onSucessfulSignIn } = this.props;
      onSucessfulSignIn(user);
    } catch (error) {
      alert(`Error signing into the app: ${error}`);
    }
  }

  showModal() {
    const clientId = window.ENV.GOOGLE_CLIENT_ID;
    if (!clientId) {
      alert('Missing environment variable GOOGLE_CLIENT_ID');
      return;
    }
    this.setState({ visible: true });
  }

  hideModal() {
    this.setState({ visible: false });
  }

  render() {
    const { visible } = this.state;
    return (
      <>
        <Button onClick={this.showModal}>
          Sign in
        </Button>
        <Modal centered keyboard show={visible} style={{ opacity: 1 }} onHide={this.hideModal}>
          <Modal.Header closeButton>
            <Modal.Title>Sign in</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Button
              block
              onClick={this.signIn}
              variant="outline-success"
            >
              <img src="signWithGoogle.png" alt="Sign In" />
            </Button>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.hideModal} variant="outline-dark">Cancel</Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}
