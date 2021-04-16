import React, { useEffect } from 'react';
import {
  Paper, makeStyles, Grid, Typography,
} from '@material-ui/core';
import { useSelector } from 'react-redux';
import ListItem from '../../../shared/components/ListItem';
import UpdateAttributesModal from './UpdateAttributes';
import { selectors as attributesSelectors } from '../../../store/attributes';
import useEndpoints from '../../../shared/hooks/useEndpoints';

const useStyles = makeStyles(() => ({
  container: {
    margin: '16px',
  },
  paper: {
    minWidth: '500px',
    maxHeight: 200,
    overflow: 'auto',
  },
}));

const AttributesList = () => {
  const classes = useStyles();
  const attributes = useSelector(attributesSelectors.getAttributes);
  const { getAttributes } = useEndpoints();

  useEffect(() => {
    getAttributes();
  }, [getAttributes]);

  return (
    <Grid container>
      {attributes ? (
        <>
          <Grid item xs={12} container justify="center" className={classes.container}>
            <Typography variant="h6">
              Number of Attributes:
              {' '}
              {attributes.length}
            </Typography>
          </Grid>
          <Grid item xs={12} container justify="center" className={classes.container}>
            <Paper className={classes.paper}>
              {
            attributes && attributes.map(({ name, number }) => (
              <ListItem key={`${name + number}`} number={number} name={name} />))
        }
            </Paper>
          </Grid>
        </>
      ) : (
        <Grid item xs={12} container justify="center" className={classes.container}>
          <Typography variant="body1" color="secondary">
            Your attribute list is now empty. Click below to upload your attributes.
          </Typography>
        </Grid>
      )}
      <Grid item xs={12} container justify="center" className={classes.container}>
        <UpdateAttributesModal initClient={!attributes} />
      </Grid>

    </Grid>

  );
};

export default AttributesList;
