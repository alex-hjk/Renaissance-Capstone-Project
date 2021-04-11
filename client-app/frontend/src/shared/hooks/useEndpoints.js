import useAxois from 'axios-hooks';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { slice as attributesSlice } from '../../store/attributes';
import useGetConfig from './useGetConfig';

const useEndpoints = () => {
  const {
    masterKey, clientID, clientUrl, cloudUrl,
  } = useGetConfig();
  const dispatch = useDispatch();
  const [{ loading }, fetch] = useAxois();

  const getAttributes = useCallback(() => {
    const url = `${clientUrl}/getAttributes`;
    const config = {
      url,
      method: 'GET',
    };
    fetch(config).then((res) => {
      const { attributes } = res.data;
      dispatch(attributesSlice.actions.updateAttributes({ attributes }));
    }).catch((e) => {
      console.log(e);
    });
  }, [fetch, clientUrl, dispatch]);

  const initClient = useCallback((attributes, callback) => {
    const url = `${clientUrl}/initClient`;
    const data = {
      attributes, masterKey, clientID, cloudUrl,
    };
    const config = {
      url,
      method: 'POST',
      data,
    };
    fetch(config).then(() => {
      setTimeout(getAttributes, 500); // To make sure that axios does not cancel the request
      callback();
    }).catch((e) => {
      console.log(e);
    });
  }, []);

  return { initClient, getAttributes, loading };
};

export default useEndpoints;
