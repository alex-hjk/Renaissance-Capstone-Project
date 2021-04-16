import React, { useCallback, useState } from 'react';
import {
  Grid, Paper, Typography, makeStyles, CircularProgress,
} from '@material-ui/core';
import { useSelector } from 'react-redux';
import useEndpoints from '../../../shared/hooks/useEndpoints';
import useInterval from './useInterval';
import ListItem from '../../../shared/components/ListItem';
import { selectors as pendingStateSelectors } from '../../../store/pendingState';

const useStyles = makeStyles(() => ({
  container: { padding: '16px' },
}));

const PsiResults = () => {
  const classes = useStyles();
  const isPending = useSelector(pendingStateSelectors.isPendingStateSelector);
  const [intersectionResult, setIntersectionResult] = useState(null);
  const [timeTaken, setTimeTaken] = useState(null);
  const { getIntersectionResult } = useEndpoints();

  const handleRetrieveResults = useCallback((_intersectionResult, _timeTaken) => {
    setIntersectionResult(_intersectionResult);
    setTimeTaken(_timeTaken);
  }, [setIntersectionResult, setTimeTaken]);

  useInterval(() => {
    if (isPending) {
      getIntersectionResult(handleRetrieveResults);
    }
  }, 1000); // Poll every second

  return isPending
    ? (
      <Grid container justify="center">
        <CircularProgress />
      </Grid>
    )
    : (
      <Paper style={{ width: '100%' }}>
        <Grid item xs={12} className={classes.container}>
          <Typography variant="h6">
            PSI results
          </Typography>
        </Grid>
        <Grid item container xs={12}>
          {intersectionResult ? intersectionResult.map(({ name, number }) => (
            <ListItem number={number} name={name} />
          )) : (
            <Typography variant="caption" className={classes.container} color="secondary">
              PSI not initiated
            </Typography>
          )}
        </Grid>
        {timeTaken && (
        <Grid item xs={12} className={classes.container}>
          <Typography variant="body2" color="primary" style={{ fontWeight: '700' }}>
            Time taken for completion:
            {' '}
            {`${(timeTaken / 1000).toFixed(2)}s`}
          </Typography>
        </Grid>
        )}
      </Paper>
    );
};

export default PsiResults;
