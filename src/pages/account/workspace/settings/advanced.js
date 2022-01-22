import Card from '../../../../components/Card';
import Content from '../../../../components/Content';
import { AccountLayout } from '../../../../layouts';

const Advanced = () => {
  return (
    <AccountLayout>
      <Content.Title
        title="Advanced Workspace Settings"
        subtitle="Manage your workspace settings"
      />
      <Content.Divider />
      <Content.Container>
        <Card danger>
          <Card.Body
            title="Delete Workspace"
            subtitle="The workspace will be permanently deleted, including its contents and domains. This action is irreversible and can not be undone."
          />
          <Card.Footer>
            <span />
            <button className="flex flex-row items-center justify-center px-5 py-2 space-x-3 text-white bg-red-600 rounded hover:bg-red-500">
              Delete
            </button>
          </Card.Footer>
        </Card>
      </Content.Container>
    </AccountLayout>
  );
};

export default Advanced;
