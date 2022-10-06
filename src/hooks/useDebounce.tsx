import { useRef } from "react";

const MIN_TIMEOUT_IN_MILLISECONDS = 200;

const useDebounce = () => {
  const timeoutIdRef = useRef<number>(0);

  return (func: Function, ms = 1000) => {
    const timeout =
      ms < MIN_TIMEOUT_IN_MILLISECONDS ? MIN_TIMEOUT_IN_MILLISECONDS : ms;

    clearTimeout(timeoutIdRef.current);
    timeoutIdRef.current = setTimeout(() => {
      if (func) {
        func();
      }
    }, timeout);
  };
};

export default useDebounce;
