import useSWR from 'swr';

type Domain = {
  name: string;
  subdomain: string | null;
  verified: boolean | null;
  value: string | null;
};

type UseDomainsResult = {
  data?: { domains: Domain[] };
  isLoading: boolean;
  isError: unknown;
};

const useDomains = (slug: string): UseDomainsResult => {
  const apiRoute = `/api/workspace/${slug}/domains`;
  const { data, error } = useSWR<{ data?: { domains: Domain[] } }>(apiRoute);
  return {
    ...data,
    isLoading: !error && !data,
    isError: error,
  };
};

export default useDomains;
