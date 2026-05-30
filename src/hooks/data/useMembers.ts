import useSWR from 'swr';

type UseMembersResult = {
  data?: { members: unknown[] };
  isLoading: boolean;
  isError: unknown;
};

const useMembers = (slug: string): UseMembersResult => {
  const apiRoute = `/api/workspace/${slug}/members`;
  const { data, error } = useSWR<{ data?: { members: unknown[] } }>(apiRoute);
  return {
    ...data,
    isLoading: !error && !data,
    isError: error,
  };
};

export default useMembers;
