import React, { useCallback, useState } from 'react';
import {
  Grid, Paper, Typography, makeStyles, CircularProgress,
} from '@material-ui/core';
import { useSelector } from 'react-redux';
import useEndpoints from '../../../shared/hooks/useEndpoints';
import useInterval from './useInterval';
import ListItem from '../../../shared/components/ListItem';
import { selectors as pendingStateSelectors } from '../../../store/pendingState';

import Results from '../../../assets/results.png';

const useStyles = makeStyles(() => ({
  container: { padding: '10px', textAlign: 'center' },
  image: {
    marginTop: '20px',
    marginLeft: 'auto',
    marginRight: 'auto',
    height: '50px',
    width: '50px',
  },
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
    : intersectionResult && (
      <Paper style={{ width: '100%' }}>
        <Grid item xs={12} className={classes.container}>
          <img src={Results} alt="Results" className={classes.image} />
          <Typography variant="h6" className={classes.container}>
            PSI Results
          </Typography>
        </Grid>
        <Grid item container xs={12}>
          {intersectionResult ? intersectionResult.map(({ name, number }) => (
            <ListItem number={number} name={name} key={`${name}${number}`} />
          )) : (
            <Typography variant="caption" className={classes.container} color="secondary">
              PSI computation has not yet been initiated.
            </Typography>
          )}
        </Grid>
        {timeTaken && (
        <Grid item xs={12} className={classes.container}>
          <Typography variant="body2" color="primary" style={{ fontWeight: '700' }}>
            Time Taken for Completion:
            {' '}
            {`${(timeTaken / 1000).toFixed(2)}s`}
          </Typography>
        </Grid>
        )}
      </Paper>
    );
};

export default PsiResults;
