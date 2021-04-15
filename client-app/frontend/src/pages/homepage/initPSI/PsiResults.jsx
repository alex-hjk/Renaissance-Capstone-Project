import React, { useCallback, useState } from 'react';
import { Grid, Paper, Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';
import useEndpoints from '../../../shared/hooks/useEndpoints';
import useInterval from './useInterval';
import { selectors as pendingStateSelectors } from '../../../store/pendingState';

const PsiResults = () => {
  const isPending = useSelector(pendingStateSelectors.isPendingStateSelector);

  const [intersectionResult, setIntersectionResult] = useState(null);
  const { getIntersectionResult } = useEndpoints();

  const handleRetrieveResults = useCallback((_intersectionResult) => {
    setIntersectionResult(_intersectionResult);
  }, [setIntersectionResult]);

  useInterval(() => {
    if (isPending) {
      getIntersectionResult(handleRetrieveResults);
    }
  }, 1000); // Poll every second

  return (
    <Paper style={{ width: '100%' }}>
      <Grid item xs={12}>
        <Typography variant="h6">
          PSI results
        </Typography>

      </Grid>
      <Grid item container xs={12}>
        {intersectionResult.map(({ name, number }) => (
          <Grid item container xs={12} key={`${name} ${number}`}>
            <Grid item xs={6}>
              {`${name}`}
            </Grid>
            <Grid item xs={6}>
              {`${number}`}
            </Grid>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default PsiResults;
