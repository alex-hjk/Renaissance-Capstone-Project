import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Grid } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {
    padding: '10px',
  },
}));

const ListItem = ({ name, number }) => {
  const classes = useStyles();
  return (
    <Grid className={classes.root} container>
      <Grid item xs={6}>
        {name}
      </Grid>
      <Grid item xs={6}>
        {number}
      </Grid>
    </Grid>
  );
};

ListItem.propTypes = {
  name: PropTypes.string.isRequired,
  number: PropTypes.number.isRequired,
};

export default ListItem;
