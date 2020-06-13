import React from 'react';
import { Button } from 'react-bootstrap'

export default function ElectionLobby() {
  const deployElection = () => {
    alert('Deplonig electoin....')
  };
  
  return (
    <>
      <h1>Please wait for voters to register</h1>
      <Button onClick={deployElection}>
        Deploy election on blockchain
      </Button>
    </>
  );
}
