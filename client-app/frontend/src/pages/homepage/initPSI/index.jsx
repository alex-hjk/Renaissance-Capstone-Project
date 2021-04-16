import React, { useCallback, useEffect, useState } from 'react';
import {
  Select, InputLabel, MenuItem, Button, Grid, FormControl, makeStyles,
} from '@material-ui/core';
import useEndpoints from '../../../shared/hooks/useEndpoints';
import PsiResults from './PsiResults';
import useGetConfig from '../../../shared/hooks/useGetConfig';

const useStyles = makeStyles(() => ({
  container: {
    margin: '16px',
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
      <Grid container item justify="center" xs={12}>
        <Grid item container xs={6}>
          <FormControl fullWidth>
            <InputLabel>Who do you want to compute your PSI with?</InputLabel>
            <Select
              value={requesteeID}
              onChange={handleChange}
            >
              {registeredClients.map((value) => {
                if (value !== clientID) {
                  return <MenuItem key={value} value={value}>{value}</MenuItem>;
                }
                return <></>;
              })}
            </Select>

            <Button onClick={handleInitPSI}>
              Init PSI
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
