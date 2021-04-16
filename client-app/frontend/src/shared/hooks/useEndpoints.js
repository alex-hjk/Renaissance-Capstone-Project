import useAxois from 'axios-hooks';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { slice as attributesSlice } from '../../store/attributes';
import { slice as isPendingSlice } from '../../store/pendingState';
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

  const initPSI = useCallback((requesteeID) => {
    const url = `${clientUrl}/initPSI`;
    const config = {
      url, method: 'POST', data: { requesteeID },
    };
    fetch(config).then((res) => {
      if (res.data.ok) {
        dispatch(isPendingSlice.actions.updatePendingState({ isPending: true }));
      } else {
        console.log(res.data);
      }
    }).catch((e) => {
      console.log(e);
    });
  });

  const getIntersectionResult = useCallback((callback) => {
    const url = `${clientUrl}/getIntersectionResult`;
    const config = { url, method: 'GET' };
    fetch(config).then((res) => {
      const { intersectionResult, timeTaken } = res.data;
      if (intersectionResult) {
        dispatch(isPendingSlice.actions.updatePendingState({ isPending: false }));
        callback(intersectionResult, timeTaken);
      }
    }).catch((e) => {
      console.log(e);
    });
  }, [dispatch, fetch]);

  const getRegisteredClients = useCallback((callback) => {
    const url = `${cloudUrl}/api/psi/getRegisteredClients`;
    const config = { url, method: 'GET' };
    fetch(config).then((res) => {
      const { registeredClients } = res.data;
      callback(registeredClients);
    }).catch((e) => {
      console.log(e);
    });
  }, [fetch]);

  const getCloudConfig = useCallback((callback) => {
    const url = `${cloudUrl}/api/psi/getCloudConfig`;
    const config = { url, method: 'GET' };
    fetch(config).then((res) => {
      const { cloudConfig } = res.data;
      if (cloudConfig) {
        callback(JSON.parse(cloudConfig));
      }
    }).catch((e) => {
      console.log(e);
    });
  }, []);

  return {
    initClient,
    getAttributes,
    getIntersectionResult,
    initPSI,
    loading,
    getRegisteredClients,
    getCloudConfig,
  };
};

export default useEndpoints;
