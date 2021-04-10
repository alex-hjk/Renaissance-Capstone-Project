import { useCallback, useEffect, useState } from 'react';

const useGetAttributes = () => {
  const [attributes, setAttributes] = useState(null);

  const getAttributes = useCallback(() => {
    // To simulate the api call
    setAttributes([{ name: 'Collin', number: 91111111 }, { name: 'Vincent', number: 91234564 }, { name: 'Alex', number: 89008888 }]);
  }, [setAttributes]);

  useEffect(() => {
    getAttributes();
  }, [getAttributes]);

  return { attributes };
};

export default useGetAttributes;
