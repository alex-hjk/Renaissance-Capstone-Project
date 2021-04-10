import React, { useCallback, useState } from 'react';
import {
  Paper, Grid, Button, TextField,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import generateRandomNameAndNumbers from './TestDataUtil';
import ListItem from '../ListItem';

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
        <TextField label="name" value={name} onChange={(event) => setName(event.target.value)} />
      </Grid>
      <Grid item xs={5}>
        <TextField label="number" value={number} onChange={(event) => { setNumber(event.target.value); }} />
      </Grid>
      <Grid container item xs={2} alignItems="center" justify="center">
        <Button onClick={handleAddAttribute}>
          Add
        </Button>
      </Grid>
    </Grid>
  );
};

AddAttributesForm.propTypes = {
  addAttribute: PropTypes.func.isRequired,
};

const UpdatableAttributesList = () => {
  const [attributes, setAttributes] = useState([]);
  const [numTestAttr, setNumTestAttr] = useState(100);
  const addAttribute = useCallback((attribute) => {
    // eslint-disable-next-line no-underscore-dangle
    const _attributes = [...attributes];
    _attributes.push(attribute);
    setAttributes(_attributes);
  });

  const generateTestData = useCallback((numAttr) => {
    const temp = generateRandomNameAndNumbers(numAttr);
    setAttributes([...attributes, ...temp]);
  }, [addAttribute]);

  return (
    <>
      <Grid container style={{ margin: '8px 0' }}>
        <Paper style={{ width: '100%', maxHeight: 200, overflow: 'auto' }}>
          {
            attributes.map(({ name, number }) => <ListItem key={`${name}+ ${number}`} number={number} name={name} />)
          }
        </Paper>
        <Grid item xs={12} style={{ width: '100%', marginTop: '8px' }}>
          <AddAttributesForm addAttribute={addAttribute} />
        </Grid>
        <Grid item container xs={12} justify="center" style={{ margin: '12px 0' }}>
          <Button color="secondary" variant="contained" onClick={() => generateTestData(numTestAttr)}>
            Populate with test attributes
          </Button>
          <TextField label="number of attributes" style={{ marginLeft: '12px' }} value={numTestAttr} onChange={(event) => { setNumTestAttr(event.target.value); }} />
        </Grid>
        <Grid item container xs={12} justify="center" style={{ margin: '12px 0' }}>
          <Button color="primary" variant="contained">
            Submit
          </Button>
        </Grid>

      </Grid>

    </>
  );
};

export default UpdatableAttributesList;
