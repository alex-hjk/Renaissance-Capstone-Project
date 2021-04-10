import React, { useState } from 'react';
import Homepage from './pages/homepage';
import InitServices from './pages/seturl';

function App() {
  const [cloudUrl, setCloudUrl] = useState(null);
  const [clientUrl, setClientUrl] = useState(null);

  return (cloudUrl && clientUrl) ? (
    <Homepage />
  ) : (
    <InitServices {...{
      cloudUrl, setCloudUrl, clientUrl, setClientUrl,
    }}
    />
  );
}

export default App;
