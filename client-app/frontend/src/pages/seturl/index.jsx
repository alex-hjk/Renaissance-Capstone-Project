import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, TextField, Grid } from '@material-ui/core';
import useSetConfigs from './useSetConfigs';

const InitServices = ({
  cloudUrl, clientUrl,
}) => {
  const [localClientUrl, setLocalClientUrl] = useState(clientUrl || 'http://localhost:5000');
  const [localCloudUrl, setLocalCloudUrl] = useState(cloudUrl || 'http://localhost:5001');
  const [localMasterKey, setLocalMasterKey] = useState('1234');
  const [localClientID, setLocalClientID] = useState('A');
  const { setConfigs } = useSetConfigs();
  const handleClientUrlChange = useCallback((event) => {
    setLocalClientUrl(event.target.value);
  }, [setLocalClientUrl]);

  const handleCloudUrlChange = useCallback((event) => {
    setLocalCloudUrl(event.target.value);
  }, [setLocalCloudUrl]);

  const handleSubmit = useCallback(() => {
    setConfigs({
      clientUrl: localClientUrl,
      cloudUrl: localCloudUrl,
      masterKey: localMasterKey,
      clientID: localClientID,
    });
  }, [localClientUrl, localCloudUrl]);
  return (
    <Grid container item spacing={2} justify="center">
      <Grid item xs={12}>
        <TextField label="Client Url" value={localClientUrl} onChange={(handleClientUrlChange)} />
      </Grid>
      <Grid item xs={12}>
        <TextField label="Cloud Url" value={localCloudUrl} onChange={(handleCloudUrlChange)} />
      </Grid>
      <Grid item xs={12}>
        <TextField label="Master Key" value={localMasterKey} onChange={(event) => setLocalMasterKey(event.target.value)} />
      </Grid>
      <Grid item xs={12}>
        <TextField label="Client ID" value={localClientID} onChange={(event) => setLocalClientID(event.target.value)} />
      </Grid>
      <Grid item xs={12}>
        <Button onClick={handleSubmit}>
          Update Configs
        </Button>
      </Grid>
    </Grid>
  );
};

InitServices.propTypes = {
  cloudUrl: PropTypes.string.isRequired,
  clientUrl: PropTypes.string.isRequired,
};

export default InitServices;
