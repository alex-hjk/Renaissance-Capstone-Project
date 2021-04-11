import React, { useEffect } from 'react';
import { Paper } from '@material-ui/core';
import { useSelector } from 'react-redux';
import ListItem from './ListItem';
import UpdateAttributesModal from './UpdateAttributes';
import { selectors as attributesSelectors } from '../../../store/attributes';
import useEndpoints from '../../../shared/hooks/useEndpoints';

const AttributesList = () => {
  const attributes = useSelector(attributesSelectors.getAttributes);
  const { getAttributes } = useEndpoints();

  useEffect(() => {
    getAttributes();
  }, [getAttributes]);

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
