import useSWR from 'swr';

const useDomains = (slug) => {
  const apiRoute = `/api/workspace/${slug}/domains`;
  const { data, error } = useSWR(`${apiRoute}`);
  return {
    ...data,
    isLoading: !error && !data,
    isError: error,
  };
};

export default useDomains;
