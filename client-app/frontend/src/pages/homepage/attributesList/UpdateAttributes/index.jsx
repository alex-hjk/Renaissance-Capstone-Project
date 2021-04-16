import { React, useState } from 'react';
import {
  Modal, Button, Paper, Typography, makeStyles,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import UpdatableAttributesList from './UpdatableAttributesList';

const useStyles = makeStyles(() => ({
  root: {
    position: 'absolute',
    width: '50vw',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    padding: '8px',
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
          <Typography variant="h5">
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
