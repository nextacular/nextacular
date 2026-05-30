import { useRouter } from 'next/router';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';

import Button from '@/components/Button/index';
import Card from '@/components/Card/index';
import Content from '@/components/Content/index';
import Meta from '@/components/Meta/index';
import { useInvitations, useWorkspaces } from '@/hooks/data/index';
import { AccountLayout } from '@/layouts/index';
import apiFetch from '@/lib/common/api';
import { useWorkspace, type Workspace } from '@/providers/workspace';

type Invitation = {
  id: string;
  workspace: { name: string };
  invitedBy: { name?: string | null; email?: string | null };
};

type MutationResponse = {
  errors?: Record<string, { msg: string }>;
};

const Welcome = () => {
  const router = useRouter();
  const { data: invitationsData, isLoading: isFetchingInvitations } =
    useInvitations();
  const { data: workspacesData, isLoading: isFetchingWorkspaces } =
    useWorkspaces();
  const { setWorkspace } = useWorkspace();
  const t = useTranslations();
  const [isSubmitting, setSubmittingState] = useState(false);
  const workspaces =
    (workspacesData?.workspaces as Workspace[] | undefined) ?? [];
  const invitations =
    (invitationsData?.invitations as Invitation[] | undefined) ?? [];

  const accept = (memberId: string) => {
    setSubmittingState(true);
    apiFetch<MutationResponse>('/api/workspace/team/accept', {
      body: { memberId },
      method: 'PUT',
    }).then((response) => {
      setSubmittingState(false);

      if (response.errors) {
        Object.keys(response.errors).forEach((error) =>
          toast.error(response.errors?.[error]?.msg ?? 'Unknown error')
        );
      } else {
        toast.success('Accepted invitation!');
      }
    });
  };

  const decline = (memberId: string) => {
    setSubmittingState(true);
    apiFetch<MutationResponse>('/api/workspace/team/decline', {
      body: { memberId },
      method: 'PUT',
    }).then((response) => {
      setSubmittingState(false);

      if (response.errors) {
        Object.keys(response.errors).forEach((error) =>
          toast.error(response.errors?.[error]?.msg ?? 'Unknown error')
        );
      } else {
        toast.success('Declined invitation!');
      }
    });
  };

  const navigate = (workspace: Workspace) => {
    setWorkspace(workspace);
    router.replace(`/account/${workspace.slug}`);
  };

  return (
    <AccountLayout>
      <Meta title="Nextacular - Dashboard" />
      <Content.Title
        title={t('workspace.dashboard.header.title')}
        subtitle={t('workspace.dashboard.header.description')}
      />
      <Content.Divider />
      <Content.Container>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {isFetchingWorkspaces ? (
            <Card>
              <Card.Body />
              <Card.Footer>
                <span />
              </Card.Footer>
            </Card>
          ) : workspaces.length > 0 ? (
            workspaces.map((workspace, index) => (
              <Card key={index}>
                <Card.Body title={workspace.name} />
                <Card.Footer>
                  <button
                    className="text-blue-600"
                    onClick={() => navigate(workspace)}
                  >
                    Select workspace &rarr;
                  </button>
                </Card.Footer>
              </Card>
            ))
          ) : (
            <Card.Empty>{t('workspace.message.createworkspace')}</Card.Empty>
          )}
        </div>
      </Content.Container>
      <Content.Divider thick />
      <Content.Title
        title={t('workspace.dashboard.header.invitations.title')}
        subtitle={t('workspace.dashboard.header.invitations.description')}
      />
      <Content.Divider />
      <Content.Container>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {isFetchingInvitations ? (
            <Card>
              <Card.Body />
              <Card.Footer>
                <span />
              </Card.Footer>
            </Card>
          ) : invitations.length > 0 ? (
            invitations.map((invitation, index) => (
              <Card key={index}>
                <Card.Body
                  title={invitation.workspace.name}
                  subtitle={`You have been invited by ${
                    invitation.invitedBy.name || invitation.invitedBy.email
                  }`}
                />
                <Card.Footer>
                  <Button
                    className="text-white bg-blue-600 hover:bg-blue-500"
                    disabled={isSubmitting}
                    onClick={() => accept(invitation.id)}
                  >
                    Accept
                  </Button>
                  <Button
                    className="text-red-600 border border-red-600 hover:bg-red-600 hover:text-white"
                    disabled={isSubmitting}
                    onClick={() => decline(invitation.id)}
                  >
                    Decline
                  </Button>
                </Card.Footer>
              </Card>
            ))
          ) : (
            <Card.Empty>
              {t('workspace.team.invitations.empty.message')}
            </Card.Empty>
          )}
        </div>
      </Content.Container>
    </AccountLayout>
  );
};

export default Welcome;
