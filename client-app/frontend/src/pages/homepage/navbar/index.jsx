import React from 'react';
import {
  makeStyles, AppBar, Toolbar, Typography,
} from '@material-ui/core';

const useStyles = makeStyles(() => ({
}));

const Navbar = () => {
  const classes = useStyles();
  return (
    <AppBar position="static" className={classes.root}>
      <Toolbar variant="dense">
        <Typography variant="h6" color="inherit">
          Find your private set
        </Typography>
      </Toolbar>
    </AppBar>
  );
};
export default Navbar;
