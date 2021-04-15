import React, { useCallback, useEffect, useState } from 'react';
import {
  Select, InputLabel, MenuItem, Button, Grid,
} from '@material-ui/core';
import useEndpoints from '../../../shared/hooks/useEndpoints';
import PsiResults from './PsiResults';
import useGetConfig from '../../../shared/hooks/useGetConfig';

const InitPSI = () => {
  const { clientID } = useGetConfig(); // To ensure that the client cannot choose to compute PSI with himself
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
    <>
      <Grid container>
        <InputLabel>Client To initiate PSI with</InputLabel>
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
      </Grid>
      <Grid container>
        <PsiResults />
      </Grid>
    </>
  );
};

export default InitPSI;
