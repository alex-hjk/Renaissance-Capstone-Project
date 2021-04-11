import { useCallback, useEffect, useState } from 'react';
import useEndpoints from '../../../../shared/hooks/useEndpoints';

const useGetAttributes = () => {
  const [attributes, setAttributes] = useState(null);
  const [refresh, setRefresh] = useState(null);
  const { getAttributes } = useEndpoints();

  const getAttributesHook = useCallback(() => {
    getAttributes().then(({ data }) => {
      if (data.ok) {
        setAttributes(data);
      }
    });
  }, [setAttributes, getAttributes]);

  const refreshAttributes = useCallback(() => {
    setRefresh(!refresh);
  }, [setRefresh, refresh]);

  useEffect(() => {
    getAttributesHook();
  }, [getAttributes, refreshAttributes]);

  return { attributes, refreshAttributes };
};

export default useGetAttributes;
