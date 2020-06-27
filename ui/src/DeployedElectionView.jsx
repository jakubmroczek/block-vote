import React from 'react';
import { Button } from 'react-bootstrap';

// TODO: Rename this, I do not have a better name right now
export default function DeployedElectionView() {
    const onElectionFinish = () => {
        // TODO: Ask the user if he really wants to do this
        alert('Finish the elction');
    };
  
    return (
    <>
      <h1>Election successfully deployed on the blockchain</h1>
      <Button 
        variant="outline-success"
        onClick={onElectionFinish}>Finish the election</Button>
    </>
  );
}
