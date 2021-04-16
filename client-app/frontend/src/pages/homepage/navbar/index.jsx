import React from 'react';
import {
  makeStyles, AppBar, Toolbar, Typography,
} from '@material-ui/core';
import useGetConfig from '../../../shared/hooks/useGetConfig';

const useStyles = makeStyles(() => ({
}));

const Navbar = () => {
  const classes = useStyles();
  const { clientID } = useGetConfig();
  return (
    <AppBar position="static" className={classes.root}>
      <Toolbar variant="dense">
        <Typography>
          Client ID:
          {' '}
          {clientID}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};
export default Navbar;
