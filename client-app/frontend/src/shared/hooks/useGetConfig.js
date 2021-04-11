import { useSelector } from 'react-redux';
import { selectors as configSelectors } from '../../store/config';

const useGetConfig = () => {
  const masterKey = useSelector(configSelectors.masterKeySelector);
  const clientID = useSelector(configSelectors.clientIDSelector);
  const cloudUrl = useSelector(configSelectors.cloudUrlSelector);
  const clientUrl = `${useSelector(configSelectors.clientUrlSelector)}/api/psi`;
  return {
    masterKey, clientID, cloudUrl, clientUrl,
  };
};

export default useGetConfig;
