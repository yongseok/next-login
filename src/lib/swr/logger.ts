import { Middleware, SWRHook } from "swr";

export const logger: Middleware = (useSWRNext: SWRHook) => {
  if (process.env.NODE_ENV !== 'development') {
    return useSWRNext;
  }
  return (key, fetcher, config) => {
    if (!fetcher) {
      return useSWRNext(key, null, config);
    }
    const extendedFetcher = (...args: unknown[]) => {
      console.log('SWR Request:', key);
      return fetcher(...args);
    };
    return useSWRNext(key, extendedFetcher, config);
  };
};