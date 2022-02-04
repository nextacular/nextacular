import { createContext, useContext, useState } from 'react';

const initialState = {
  setWorkspace: () => {},
  workspace: null,
};

const WorkspaceContext = createContext(initialState);

export const useWorkspace = () => useContext(WorkspaceContext);

const WorkspaceProvider = ({ children }) => {
  const [workspace, setWorkspaceState] = useState(null);

  const setWorkspace = (workspace) => {
    setWorkspaceState(workspace);
  };

  return (
    <WorkspaceContext.Provider value={{ setWorkspace, workspace }}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export default WorkspaceProvider;
