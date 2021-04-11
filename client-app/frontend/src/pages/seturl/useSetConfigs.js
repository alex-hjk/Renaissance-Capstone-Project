import { useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { slice as configSlice } from '../../store/config';

const useSetConfigs = () => {
  const dispatch = useDispatch();
  const setConfigs = useCallback(({
    clientUrl, cloudUrl, clientID, masterKey,
  }) => {
    dispatch(configSlice.actions.updateUrls({
      clientUrl, cloudUrl,
    }));
    dispatch(configSlice.actions.updateConfig({
      clientID, masterKey,
    }));
  }, [dispatch]);
  return { setConfigs };
};

export default useSetConfigs;
