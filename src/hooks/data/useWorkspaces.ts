import useSWR from 'swr';

type UseWorkspacesResult = {
  data?: { workspaces: unknown[] };
  isLoading: boolean;
  isError: unknown;
};

const useWorkspaces = (): UseWorkspacesResult => {
  const apiRoute = `/api/workspaces`;
  const { data, error } = useSWR<{ data?: { workspaces: unknown[] } }>(
    apiRoute
  );
  return {
    ...data,
    isLoading: !error && !data,
    isError: error,
  };
};

export default useWorkspaces;
