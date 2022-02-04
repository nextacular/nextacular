import api from '../../lib/client/api';

const handleOnError = (error) => {
  throw new Error(`Error: ${error}`);
};

const swrConfig = () => ({
  fetcher: api,
  onError: handleOnError,
  refreshInterval: 1000,
});

export default swrConfig;
