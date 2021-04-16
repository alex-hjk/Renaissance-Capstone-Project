import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, TextField, Grid } from '@material-ui/core';
import useSetConfigs from './useSetConfigs';

import SocialMedia from '../../assets/social-media.png';

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

  const cardStyle = {
    fontFamily: 'arial',
    width: '80%',
    margin: '16px auto',
    border: '1px solid #eee',
    boxShadow: '0 2px 3px #ccc',
    padding: '15px',
    textAlign: 'center',
  };

  return (
    <>
      <div style={cardStyle}>
        <img style={{ height: '50px', width: '50px' }} src={SocialMedia} alt="socialmedia" />
        <h2><b>Welcome to our PSI Application</b></h2>
        <p>Identify common attributes with other users without the risk of data leakage.</p>
        <br />
        <p><b>Please Log In Below</b></p>
        <Grid container item spacing={2} justify="center">
          {/* <Grid item xs={12}>
            <TextField label="Client Url" value={localClientUrl}
            onChange={(handleClientUrlChange)} />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Cloud Url" value={localCloudUrl} onChange={(handleCloudUrlChange)} />
          </Grid> */}
          <Grid item xs={12}>
            <TextField label="Client ID" value={localClientID} onChange={(event) => setLocalClientID(event.target.value)} />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Master Key" value={localMasterKey} onChange={(event) => setLocalMasterKey(event.target.value)} />
          </Grid>
          <Grid item xs={12}>
            <Button onClick={handleSubmit}>
              Log In
            </Button>
          </Grid>
        </Grid>
      </div>
      <div style={cardStyle}>
        <p><b>Internal Application Configurations</b></p>
        <Grid container item spacing={2} justify="center">
          <Grid item xs={12}>
            <TextField label="Client Url" value={localClientUrl} onChange={(handleClientUrlChange)} />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Cloud Url" value={localCloudUrl} onChange={(handleCloudUrlChange)} />
          </Grid>
        </Grid>
      </div>
    </>
  );
};

InitServices.propTypes = {
  cloudUrl: PropTypes.string.isRequired,
  clientUrl: PropTypes.string.isRequired,
};

export default InitServices;
