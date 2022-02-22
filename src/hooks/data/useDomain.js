import useSWR from 'swr';

const useDomain = (domain) => {
  const apiRoute = `/api/workspace/domain/check?domain=${domain}`;
  const { data, error } = useSWR(`${apiRoute}`);
  return {
    ...data,
    isLoading: !error && !data,
    isError: error,
  };
};

export default useDomain;
