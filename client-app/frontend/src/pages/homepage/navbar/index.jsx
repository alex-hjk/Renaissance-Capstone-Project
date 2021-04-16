import React from 'react';
import {
  makeStyles, AppBar, Toolbar, Typography,
} from '@material-ui/core';
import useGetConfig from '../../../shared/hooks/useGetConfig';

import Logo from '../../../assets/logo.png';

const useStyles = makeStyles(() => ({
  image: {
    height: '30px',
    width: '30px',
    marginRight: '10px',
  },
}));

const Navbar = () => {
  const classes = useStyles();
  const { clientID } = useGetConfig();
  return (
    <AppBar position="static" className={classes.root}>
      <Toolbar variant="dense">
        <img src={Logo} alt="Logo" className={classes.image} />
        <Typography variant="subtitle2">
          PSI Application | Welcome Client
          {' '}
          {clientID}
          {'!'}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};
export default Navbar;
