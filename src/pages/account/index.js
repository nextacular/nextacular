import { useRouter } from 'next/router';

import Card from '../../components/Card';
import Content from '../../components/Content';
import { useWorkspaces } from '../../hooks/data';
import { AccountLayout } from '../../layouts';
import { useWorkspace } from '../../providers/workspace';

const Welcome = () => {
  const router = useRouter();
  const { data, isLoading } = useWorkspaces();
  const { setWorkspace } = useWorkspace();

  const navigate = (workspace) => {
    setWorkspace(workspace);
    router.replace(`/account/${workspace.slug}`);
  };

  return (
    <AccountLayout>
      <Content.Title
        title="Nextacular Dashboard"
        subtitle="Start building SaaS platforms in a day"
      />
      <Content.Divider />
      <Content.Container>
        <div className="grid grid-cols-3 gap-5">
          {isLoading ? (
            <Card>
              <Card.Body />
              <Card.Footer />
            </Card>
          ) : data?.workspaces.length > 0 ? (
            data.workspaces.map((workspace, index) => (
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
    </AccountLayout>
  );
};

export default Welcome;
