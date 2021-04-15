import React, { useCallback, useState } from 'react';
import {
  Select, InputLabel, MenuItem, Button, Grid,
} from '@material-ui/core';
import useEndpoints from '../../../shared/hooks/useEndpoints';
import PsiResults from './PsiResults';

const InitPSI = () => {
  const registeredClients = ['B']; // TODO: Get this from results retrieval instead

  const [requesteeID, setRequesteeID] = useState(registeredClients[0]);
  const handleChange = useCallback((event) => {
    setRequesteeID(event.target.value);
  }, [setRequesteeID]);

  const { initPSI } = useEndpoints();

  const handleInitPSI = useCallback(() => {
    initPSI(requesteeID);
  }, [initPSI, requesteeID]);

  return (
    <>
      <Grid container>
        <InputLabel>Client To initiate PSI with</InputLabel>
        <Select
          value={requesteeID}
          onChange={handleChange}
        >
          {registeredClients.map((value) => <MenuItem key={value} value={value}>{value}</MenuItem>)}
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
