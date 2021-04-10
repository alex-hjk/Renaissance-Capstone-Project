import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, TextField, Grid } from '@material-ui/core';

const InitServices = ({
  cloudUrl, clientUrl, setCloudUrl, setClientUrl,
}) => {
  const [localClientUrl, setLocalClientUrl] = useState(clientUrl || 'http://localhost:5000');
  const [localCloudUrl, setLocalCloudUrl] = useState(cloudUrl || 'http://localhost:5001');

  const handleClientUrlChange = useCallback((event) => {
    setLocalClientUrl(event.target.value);
  }, [setLocalClientUrl]);

  const handleCloudUrlChange = useCallback((event) => {
    setLocalCloudUrl(event.target.value);
  }, [setLocalCloudUrl]);

  const handleSubmit = useCallback(() => {
    setCloudUrl(localCloudUrl);
    setClientUrl(localClientUrl);
  }, [localClientUrl, localCloudUrl, setClientUrl, setCloudUrl]);
  return (
    <Grid container item spacing={2} justify="center">
      <Grid item xs={12}>
        <TextField label="Cloud Url" value={localClientUrl} onChange={(handleClientUrlChange)} />
      </Grid>
      <Grid item xs={12}>
        <TextField label="Client Url" value={localCloudUrl} onChange={(handleCloudUrlChange)} />
      </Grid>
      <Grid item xs={12}>
        <Button onClick={handleSubmit}>
          Update Urls
        </Button>
      </Grid>
    </Grid>
  );
};

InitServices.propTypes = {
  cloudUrl: PropTypes.string.isRequired,
  clientUrl: PropTypes.string.isRequired,
  setClientUrl: PropTypes.func.isRequired,
  setCloudUrl: PropTypes.func.isRequired,
};

export default InitServices;
