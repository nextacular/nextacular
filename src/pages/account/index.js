import { useState } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

import Button from '@/components/Button/index';
import Card from '@/components/Card/index';
import Content from '@/components/Content/index';
import Meta from '@/components/Meta/index';
import { useInvitations, useWorkspaces } from '@/hooks/data/index';
import { AccountLayout } from '@/layouts/index';
import api from '@/lib/common/api';
import { useWorkspace } from '@/providers/workspace';

const Welcome = () => {
  const router = useRouter();
  const { data: invitationsData, isLoading: isFetchingInvitations } =
    useInvitations();
  const { data: workspacesData, isLoading: isFetchingWorkspaces } =
    useWorkspaces();
  const { setWorkspace } = useWorkspace();
  const [isSubmitting, setSubmittingState] = useState(false);

  const accept = (memberId) => {
    setSubmittingState(true);
    api(`/api/workspace/team/accept`, {
      body: { memberId },
      method: 'PUT',
    }).then((response) => {
      setSubmittingState(false);

      if (response.errors) {
        Object.keys(response.errors).forEach((error) =>
          toast.error(response.errors[error].msg)
        );
      } else {
        toast.success('Accepted invitation!');
      }
    });
  };

  const decline = (memberId) => {
    setSubmittingState(true);
    api(`/api/workspace/team/decline`, {
      body: { memberId },
      method: 'PUT',
    }).then((response) => {
      setSubmittingState(false);

      if (response.errors) {
        Object.keys(response.errors).forEach((error) =>
          toast.error(response.errors[error].msg)
        );
      } else {
        toast.success('Declined invitation!');
      }
    });
  };

  const navigate = (workspace) => {
    setWorkspace(workspace);
    router.replace(`/account/${workspace.slug}`);
  };

  return (
    <AccountLayout>
      <Meta title="Nextacular - Dashboard" />
      <Content.Title
        title="Nextacular Dashboard"
        subtitle="Start building SaaS platforms in a day"
      />
      <Content.Divider />
      <Content.Container>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {isFetchingWorkspaces ? (
            <Card>
              <Card.Body />
              <Card.Footer />
            </Card>
          ) : workspacesData?.workspaces.length > 0 ? (
            workspacesData.workspaces.map((workspace, index) => (
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
            <Card.Empty>Start creating a workspace now</Card.Empty>
          )}
        </div>
      </Content.Container>
      <Content.Divider thick />
      <Content.Title
        title="Workspace Invitations"
        subtitle="Listed here are the invitations received by your account"
      />
      <Content.Divider />
      <Content.Container>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {isFetchingInvitations ? (
            <Card>
              <Card.Body />
              <Card.Footer />
            </Card>
          ) : invitationsData?.invitations.length > 0 ? (
            invitationsData.invitations.map((invitation, index) => (
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
              You haven&apos;t received any invitations to a workspace yet.
            </Card.Empty>
          )}
        </div>
      </Content.Container>
    </AccountLayout>
  );
};

export default Welcome;
