import React, { useCallback, useState } from 'react';
import {
  Grid, Paper, Tabs, Tab,
} from '@material-ui/core';
import Navbar from './navbar';
import AttributesList from './attributesList';
import InitPSI from './initPSI';
import CloudConfig from './cloudConfig';
import IntermediateAttributes from './intermediateAttibutes';

const Homepage = () => {
  const [tab, setTab] = useState(0);
  const handleChange = useCallback((event, newValue) => {
    setTab(newValue);
  }, []);
  return (
    <>
      <Navbar />
      <Paper square>
        <Tabs
          value={tab}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleChange}
          aria-label="disabled tabs example"
        >
          <Tab label="Initialise Client" />
          <Tab label="Initiate PSI" />
          <Tab label="View Cloud Configurations" />
          <Tab label="View Intermediate Attributes" />
        </Tabs>
      </Paper>

      <Grid container>
        <Grid item xs={12}>
          {tab === 0 && <AttributesList />}
          {tab === 1 && <InitPSI />}
          {tab === 2 && <CloudConfig />}
          {tab === 3 && <IntermediateAttributes />}
        </Grid>
      </Grid>
    </>
  );
};

export default Homepage;
