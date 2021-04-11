import React from 'react';
import { useSelector } from 'react-redux';
import Homepage from './pages/homepage';
import InitServices from './pages/seturl';
import { selectors as urlSelectors } from './store/config';

function App() {
  const clientUrl = useSelector(urlSelectors.clientUrlSelector);
  const cloudUrl = useSelector(urlSelectors.cloudUrlSelector);

  return (cloudUrl && clientUrl) ? (
    <Homepage />
  ) : (
    <InitServices {...{
      cloudUrl, clientUrl,
    }}
    />
  );
}

export default App;
