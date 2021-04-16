import React, { useEffect } from 'react';
import {
  Paper, makeStyles, Grid, Typography,
} from '@material-ui/core';
import { useSelector } from 'react-redux';
import ListItem from '../../../shared/components/ListItem';
import UpdateAttributesModal from './UpdateAttributes';
import { selectors as attributesSelectors } from '../../../store/attributes';
import useEndpoints from '../../../shared/hooks/useEndpoints';

import Attributes from '../../../assets/address-book.png';
import EmptyBox from '../../../assets/empty-box.png';

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

  const imageStyle = {
    marginTop: '20px',
    marginLeft: 'auto',
    marginRight: 'auto',
    height: '50px',
    width: '50px',
  };

  return (
    <Grid container>
      {attributes ? (
        <>
          <img style={imageStyle} src={Attributes} alt="Address Book" />
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
        <>
          <img style={imageStyle} src={EmptyBox} alt="Empty Box" />
          <Grid item xs={12} container justify="center" className={classes.container}>
            <Typography variant="body1">
              Your attribute list is now empty. Click below to upload your attributes.
            </Typography>
          </Grid>
        </>
      )}
      <Grid item xs={12} container justify="center" className={classes.container}>
        <UpdateAttributesModal initClient={!attributes} />
      </Grid>

    </Grid>

  );
};

export default AttributesList;
