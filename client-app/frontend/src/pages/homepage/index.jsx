import React from 'react';
import { Grid } from '@material-ui/core';
import Navbar from './navbar';
import AttributesList from './attributesList';

const Homepage = () => (
  <>
    <Navbar />
    <Grid container>
      <Grid item xs={6}>
        <AttributesList />

      </Grid>
      <Grid item xs={6}>
        Init PSI
      </Grid>

    </Grid>
  </>
);

export default Homepage;
