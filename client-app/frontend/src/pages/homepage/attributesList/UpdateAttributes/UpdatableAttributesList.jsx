import React, { useCallback, useState } from 'react';
import {
  Paper, Grid, Button, TextField,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import generateRandomNameAndNumbers from './TestDataUtil';
import ListItem from '../ListItem';
import useEndpoints from '../../../../shared/hooks/useEndpoints';
import AddAttributesForm from './AddAttributesForm';

const UpdatableAttributesList = ({ setOpen }) => {
  const [attributes, setAttributes] = useState([]);
  const [numTestAttr, setNumTestAttr] = useState(100);
  const { initClient } = useEndpoints();
  const addAttribute = useCallback((attribute) => {
    // eslint-disable-next-line no-underscore-dangle
    const _attributes = [...attributes];
    _attributes.push(attribute);
    setAttributes(_attributes);
  });

  const generateTestData = useCallback((numAttr) => {
    const temp = generateRandomNameAndNumbers(numAttr);
    setAttributes([...attributes, ...temp]);
  }, [setAttributes, attributes]);

  const handleInitClient = useCallback(() => {
    initClient(attributes, () => { setOpen(false); });
  }, [initClient, setOpen, attributes]);

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
          <Button color="secondary" variant="contained" onClick={() => generateTestData(numTestAttr)} size="small">
            Populate with test attributes
          </Button>
          <TextField label="number of attributes" style={{ marginLeft: '12px' }} value={numTestAttr} onChange={(event) => { setNumTestAttr(event.target.value); }} />
        </Grid>
        <Grid item container xs={12} justify="center" style={{ margin: '12px 0' }}>
          <Button color="primary" variant="contained" onClick={handleInitClient}>
            Submit
          </Button>
        </Grid>

      </Grid>

    </>
  );
};

UpdatableAttributesList.propTypes = {
  setOpen: PropTypes.func.isRequired,
};

export default UpdatableAttributesList;
