'use client';

import Content from '@/components/Content/index';
import { useWorkspace } from '@/providers/workspace';

const WorkspaceHome = () => {
  const { workspace } = useWorkspace();

  if (!workspace) return null;

  return (
    <>
      <Content.Title
        title={workspace.name}
        subtitle="This is your project's workspace"
      />
      <Content.Divider />
      <Content.Container>
        <span />
      </Content.Container>
    </>
  );
};

export default WorkspaceHome;
