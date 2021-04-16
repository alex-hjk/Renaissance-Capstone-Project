import React, { useCallback, useEffect, useState } from 'react';
import {
  Paper, Grid, makeStyles, Typography, Button, Input,
} from '@material-ui/core';
import useEndpoints from '../../../shared/hooks/useEndpoints';
import ListItem from '../../../shared/components/ListItem';

const useStyles = makeStyles(() => ({
  root: {
    margin: '16px',
  },
}));

const CloudConfig = () => {
  const classes = useStyles();
  const { getCloudConfig, updateNumBins } = useEndpoints();
  const [cloudConfig, setCloudConfig] = useState(null);
  const [localNumBins, setLocalNumBins] = useState(0);

  const handleGetCloudConfig = useCallback((_cloudConfig) => {
    setCloudConfig(_cloudConfig);
    setLocalNumBins(_cloudConfig.NUMBER_OF_BINS);
  }, [setCloudConfig]);

  const handleLocalNumBinsChange = useCallback((event) => {
    setLocalNumBins(event.target.value);
  }, [setLocalNumBins]);

  const handleUpdateBinsSubmit = useCallback(() => {
    updateNumBins(localNumBins, handleGetCloudConfig);
  }, [localNumBins, handleGetCloudConfig, updateNumBins]);

  useEffect(() => {
    getCloudConfig(handleGetCloudConfig);
  }, [getCloudConfig]);

  return cloudConfig && (
  <>
    <Grid container justify="center" className={classes.root}>
      <Typography variant="h5">
        Cloud Configuration
      </Typography>
    </Grid>
    <Grid container justify="center" className={classes.root}>
      <Grid item xs={9}>
        <Paper>
          <ListItem number={cloudConfig.MAXIMUM_LOAD} name="Maximum Load" />
          <ListItem number={cloudConfig.NUMBER_OF_BINS} name="Number of Bins" />
          <ListItem number={cloudConfig.LARGE_PRIME_NUMBER} name="Large prime Number" />
          <ListItem number={cloudConfig.SMALL_PRIME_NUMBER} name="Small Prime Number" />
        </Paper>
      </Grid>
    </Grid>
    <Grid container justify="center" className={classes.root}>
      <Grid item xs={12} container justify="center">
        <Typography component="p">
          Maximum Number of attributes for each client:
        </Typography>
      </Grid>
      <Grid item xs={12} container justify="center">
        <Typography style={{ fontWeight: 'bold' }} component="p">
          {`${Math.round(cloudConfig.NUMBER_OF_BINS * 40)}`}
        </Typography>
      </Grid>
    </Grid>
    <Grid container justify="center" className={classes.root} spacing={3}>
      <Grid item>
        <Input value={localNumBins} onChange={handleLocalNumBinsChange} />
      </Grid>
      <Grid item>
        <Button variant="contained" color="primary" size="small" onClick={handleUpdateBinsSubmit}>
          Update Num Bins
        </Button>
      </Grid>
    </Grid>
  </>
  );
};

export default CloudConfig;
