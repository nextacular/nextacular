import Button from '../../../../components/Button';
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
            <Button className="text-white bg-red-600 hover:bg-red-500">
              Delete
            </Button>
          </Card.Footer>
        </Card>
      </Content.Container>
    </AccountLayout>
  );
};

export default Advanced;
