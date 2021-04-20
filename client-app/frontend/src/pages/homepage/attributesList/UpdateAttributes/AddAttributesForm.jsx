import React, { useCallback, useState } from 'react';
import { Button, Grid, TextField } from '@material-ui/core';
import PropTypes from 'prop-types';

const AddAttributesForm = ({ addAttribute }) => {
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const handleAddAttribute = useCallback(() => {
    addAttribute({ name, number });
    setName('');
    setNumber('');
  });
  return (
    <Grid container>
      <Grid item xs={5}>
        <TextField label="Name" value={name} onChange={(event) => setName(event.target.value)} />
      </Grid>
      <Grid item xs={5}>
        <TextField label="Phone Number" value={number} onChange={(event) => { setNumber(event.target.value); }} />
      </Grid>
      <Grid container item xs={2} alignItems="center" justify="center">
        <Button variant="contained" onClick={handleAddAttribute}>
          Add
        </Button>
      </Grid>
    </Grid>
  );
};

AddAttributesForm.propTypes = {
  addAttribute: PropTypes.func.isRequired,
};

export default AddAttributesForm;
