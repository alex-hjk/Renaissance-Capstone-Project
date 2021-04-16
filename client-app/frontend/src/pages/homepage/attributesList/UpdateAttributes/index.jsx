import { React, useState } from 'react';
import {
  Modal, Button, Paper, Typography, makeStyles, Grid,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import UpdatableAttributesList from './UpdatableAttributesList';

import AddAttributes from '../../../../assets/add-attributes.png';

const useStyles = makeStyles(() => ({
  root: {
    position: 'absolute',
    width: '50vw',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    padding: '30px',
  },
  image: {
    align: 'center',
    height: '50px',
    width: '50px',
  },
}));

const UpdateAttributesModal = ({ initClient }) => {
  const [open, setOpen] = useState(false);
  const classes = useStyles();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button type="button" onClick={handleOpen} variant="contained" color="primary">
        {initClient ? 'Upload Attributes' : 'Update Attributes'}
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Paper className={classes.root}>
          <Grid container justify="center">
            <img src={AddAttributes} alt="Add Attributes" className={classes.image} />
          </Grid>
          <Typography variant="h6" align="center">
            Update Your Attributes
          </Typography>
          <UpdatableAttributesList setOpen={setOpen} />
        </Paper>
      </Modal>
    </>
  );
};

UpdateAttributesModal.propTypes = {
  initClient: PropTypes.bool.isRequired,
};

export default UpdateAttributesModal;
