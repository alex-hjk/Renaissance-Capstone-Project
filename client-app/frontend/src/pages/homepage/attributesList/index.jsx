import React from 'react';
import { Paper } from '@material-ui/core';
import ListItem from './ListItem';
import UpdateAttributesModal from './UpdateAttributes';
import useGetAttributes from './useGetAttributes';

const AttributesList = () => {
  const { attributes } = useGetAttributes();

  return (
    <>
      <Paper style={{ maxHeight: 200, overflow: 'auto' }}>
        {
        attributes && attributes.map(({ name, number }) => (
          <ListItem key={`${name + number}`} number={number} name={name} />))
      }
      </Paper>
      <UpdateAttributesModal />
    </>

  );
};

export default AttributesList;
