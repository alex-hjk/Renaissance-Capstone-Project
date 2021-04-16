import { React, useState } from 'react';
import {
  Modal, Button, Paper, Typography, makeStyles,
} from '@material-ui/core';
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

const UpdateAttributesModal = () => {
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
        Update your attributes
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Paper className={classes.root}>
          <Typography variant="h5">
            Update your attributes
          </Typography>
          <UpdatableAttributesList setOpen={setOpen} />
        </Paper>
      </Modal>
    </>
  );
};

export default UpdateAttributesModal;
