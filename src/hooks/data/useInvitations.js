import useSWR from 'swr';

const useWorkspaces = () => {
  const apiRoute = `/api/workspaces/invitations`;
  const { data, error } = useSWR(`${apiRoute}`);
  return {
    ...data,
    isLoading: !error && !data,
    isError: error,
  };
};

export default useWorkspaces;
