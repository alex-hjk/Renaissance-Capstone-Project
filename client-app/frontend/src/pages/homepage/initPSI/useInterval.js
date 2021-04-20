import { useEffect, useRef } from 'react';

export default function useInterval(callback, delay) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    const tick = () => {
      savedCallback.current();
    };

    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => {
        clearInterval(id);
      };
    }
  }, [callback, delay]);
}
