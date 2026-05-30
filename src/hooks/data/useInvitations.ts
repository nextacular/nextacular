import useSWR from 'swr';

type UseInvitationsResult = {
  data?: { invitations: unknown[] };
  isLoading: boolean;
  isError: unknown;
};

const useInvitations = (): UseInvitationsResult => {
  const apiRoute = `/api/workspaces/invitations`;
  const { data, error } = useSWR<{ data?: { invitations: unknown[] } }>(
    apiRoute
  );
  return {
    ...data,
    isLoading: !error && !data,
    isError: error,
  };
};

export default useInvitations;
