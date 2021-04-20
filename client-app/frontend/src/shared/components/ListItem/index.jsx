import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Grid } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {
    padding: '10px',
    borderBottom: '1px solid rgba(100,100,100,0.2)',
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
  number: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
};

export default ListItem;
