import { createContext, useContext, useState, type ReactNode } from 'react';

export type Workspace = {
  slug: string;
  name: string;
  inviteCode: string;
  workspaceCode: string;
  inviteLink?: string;
  [key: string]: unknown;
};

type WorkspaceContextValue = {
  setWorkspace: (_workspace: Workspace | null) => void;
  workspace: Workspace | null;
};

const initialState: WorkspaceContextValue = {
  setWorkspace: () => {},
  workspace: null,
};

const WorkspaceContext = createContext<WorkspaceContextValue>(initialState);

export const useWorkspace = (): WorkspaceContextValue =>
  useContext(WorkspaceContext);

type WorkspaceProviderProps = {
  children: ReactNode;
};

const WorkspaceProvider = ({ children }: WorkspaceProviderProps) => {
  const [workspace, setWorkspaceState] = useState<Workspace | null>(null);

  const setWorkspace = (next: Workspace | null) => {
    setWorkspaceState(next);
  };

  return (
    <WorkspaceContext.Provider value={{ setWorkspace, workspace }}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export default WorkspaceProvider;
