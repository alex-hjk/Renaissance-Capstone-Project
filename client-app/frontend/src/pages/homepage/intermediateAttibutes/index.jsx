import React from 'react';
import { makeStyles, Paper, Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { selectors as intermediateAttributesSelectors } from '../../../store/intermediateAttributes';

const useStyles = makeStyles(() => ({
  container: { width: '50%', overflow: 'auto' },
}));

const IntermediateAttributes = () => {
  const initClientRes = useSelector(intermediateAttributesSelectors.initClientResSelector);
  const resultsRetrievalReq = useSelector(intermediateAttributesSelectors
    .resultsRetrievalReqSelector);
  const classes = useStyles();

  return (
    <>
      <Typography>
        Blinded Values:
      </Typography>
      <Paper className={classes.container}>
        {initClientRes}
      </Paper>
      <Paper>
        Cloud to client:
        {' '}
        {JSON.stringify(resultsRetrievalReq)}
      </Paper>

    </>
  );
};

export default IntermediateAttributes;
