import React, { useCallback, useEffect, useState } from 'react';
import {
  Select, InputLabel, MenuItem, Button, Grid, FormControl, makeStyles, Typography,
} from '@material-ui/core';
import useEndpoints from '../../../shared/hooks/useEndpoints';
import PsiResults from './PsiResults';
import useGetConfig from '../../../shared/hooks/useGetConfig';

import Intersect from '../../../assets/intersect.png';

const useStyles = makeStyles(() => ({
  container: {
    margin: '16px',
  },
  image: {
    marginTop: '20px',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: '20px',
    height: '50px',
    width: '50px',
  },
}));

const InitPSI = () => {
  const classes = useStyles();
  // To ensure that the client cannot choose to compute PSI with himself
  const { clientID } = useGetConfig();
  const [registeredClients, setRegisteredClients] = useState([]);
  const [requesteeID, setRequesteeID] = useState('');

  const handleChange = useCallback((event) => {
    setRequesteeID(event.target.value);
  }, [setRequesteeID]);

  const { initPSI, getRegisteredClients } = useEndpoints();

  const handleInitPSI = useCallback(() => {
    initPSI(requesteeID);
  }, [initPSI, requesteeID]);

  const handleSetRegisteredClients = useCallback((_registeredClients) => {
    setRegisteredClients(_registeredClients);
  }, [setRegisteredClients]);

  useEffect(() => {
    getRegisteredClients(handleSetRegisteredClients);
  }, [getRegisteredClients, handleSetRegisteredClients]);

  return (
    <Grid container justify="center" spacing={5} className={classes.container}>
      <img src={Intersect} alt="Intersection" className={classes.image} />
      <Grid container item justify="center" xs={12}>
        <Grid item container xs={6}>
          <Typography variant="h6" style={{ marginLeft: 'auto', marginRight: 'auto', marginBottom: '20px' }}>
            Initiate a PSI Request with another Client!
          </Typography>
          <FormControl fullWidth>
            <InputLabel>Who do you want to compute your PSI with?</InputLabel>
            <Select
              value={requesteeID}
              onChange={handleChange}
            >
              {registeredClients.filter((value) => value !== clientID)
                .map((value) => <MenuItem key={value} value={value}>{value}</MenuItem>)}
            </Select>
            <Button onClick={handleInitPSI}>
              Initiate PSI Computation
            </Button>
          </FormControl>
        </Grid>
      </Grid>
      <Grid container item justify="center" xs={12}>
        <Grid item xs={6}>
          <PsiResults />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default InitPSI;
