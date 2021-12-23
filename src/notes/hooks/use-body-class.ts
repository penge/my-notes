import { useEffect } from "preact/hooks";

export const useBodyClass = (clazz: string): void => {
  useEffect(() => {
    document.body.classList.add(clazz);
    return () => document.body.classList.remove(clazz);
  }, []);
};
