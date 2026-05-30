import useSWR from 'swr';

type UseDomainResult = {
  data?: { valid: boolean };
  isLoading: boolean;
  isError: unknown;
};

const useDomain = (domain: string): UseDomainResult => {
  const apiRoute = `/api/workspace/domain/check?domain=${domain}`;
  const { data, error } = useSWR<{ data?: { valid: boolean } }>(apiRoute);
  return {
    ...data,
    isLoading: !error && !data,
    isError: error,
  };
};

export default useDomain;
