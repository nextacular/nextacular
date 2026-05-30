import type { SWRConfiguration } from 'swr';

import fetcher from '@/lib/client/fetcher';

const handleOnError = (error: unknown): never => {
  throw new Error(`Error: ${String(error)}`);
};

const swrConfig = (): SWRConfiguration => ({
  fetcher,
  onError: handleOnError,
  refreshInterval: 1000,
});

export default swrConfig;
