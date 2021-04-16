import React, { useEffect } from 'react';
import { Paper, makeStyles, Grid } from '@material-ui/core';
import { useSelector } from 'react-redux';
import ListItem from './ListItem';
import UpdateAttributesModal from './UpdateAttributes';
import { selectors as attributesSelectors } from '../../../store/attributes';
import useEndpoints from '../../../shared/hooks/useEndpoints';

const useStyles = makeStyles(() => ({
  root: {

  },
  paper: {
    minWidth: '500px',
    margin: '16px',
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
      <Grid item xs={12} container justify="center">
        <Paper className={classes.paper}>
          {
            attributes && attributes.map(({ name, number }) => (
              <ListItem key={`${name + number}`} number={number} name={name} />))
          }
        </Paper>
      </Grid>
      <Grid item xs={12} container justify="center">
        <UpdateAttributesModal />
      </Grid>

    </Grid>

  );
};

export default AttributesList;
