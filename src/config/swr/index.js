import fetcher from '@/lib/client/fetcher';

const handleOnError = (error) => {
  throw new Error(`Error: ${error}`);
};

const swrConfig = () => ({
  fetcher,
  onError: handleOnError,
  refreshInterval: 1000,
});

export default swrConfig;
