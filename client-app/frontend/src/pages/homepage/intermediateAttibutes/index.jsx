import React from 'react';
import {
  makeStyles,
  Paper,
  Typography,
  Grid,
} from '@material-ui/core';
import { useSelector } from 'react-redux';
import { selectors as intermediateAttributesSelectors } from '../../../store/intermediateAttributes';

const useStyles = makeStyles(() => ({
  container: { width: '100%', overflow: 'auto' },
  grid: {
    marginTop: '20px',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '50%',
  },
}));

const IntermediateAttributes = () => {
  const initClientRes = useSelector(intermediateAttributesSelectors.initClientResSelector);
  const resultsRetrievalReq = useSelector(intermediateAttributesSelectors
    .resultsRetrievalReqSelector);
  const classes = useStyles();

  return (
    <>
      <Grid className={classes.grid} container spacing={2}>
        <Grid item xs={12}>
          <Typography>
            Blinded Values:
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.container}>
            {initClientRes}
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper>
            <Typography>
              Cloud to Client:
            </Typography>
            {' '}
            {JSON.stringify(resultsRetrievalReq)}
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default IntermediateAttributes;
