import Content from '../../components/Content';
import { AccountLayout } from '../../layouts';
import { useWorkspace } from '../../providers/workspace';

const Workspace = () => {
  const { workspace } = useWorkspace();

  return (
    <AccountLayout>
      <Content.Title
        title={workspace.name}
        subtitle="This is your project's workspace"
      />
      <Content.Divider />
      <Content.Container />
    </AccountLayout>
  );
};

export default Workspace;
