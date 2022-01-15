import { Listbox } from '@headlessui/react';
import { PlusIcon, SelectorIcon } from '@heroicons/react/solid';

const Sidebar = () => {
  return (
    <aside className="sticky flex flex-col w-1/4 h-screen space-y-5 overflow-y-auto text-white bg-gray-800 overscroll-contain">
      <div className="p-5 text-center border-b border-b-gray-900">
        <a className="text-2xl font-bold" href="#!">
          Nextacular
        </a>
      </div>
      <div className="flex flex-col items-center justify-center px-5 space-y-3">
        <button className="flex flex-row items-center justify-center w-full p-2 space-x-3 bg-blue-600 rounded hover:bg-blue-500">
          <PlusIcon className="w-5 h-5 text-white" aria-hidden="true" />
          <span>Create Workspace</span>
        </button>
        <Listbox className="w-full" value={null} onChange={null}>
          <div className="relative mt-1">
            <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-white rounded-lg shadow-md cursor-default sm:text-sm">
              <span className="block truncate">Select</span>
              <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <SelectorIcon
                  className="w-5 h-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>
          </div>
        </Listbox>
      </div>
      <div className="flex flex-col p-5 space-y-10">
        <div className="space-y-2">
          <h5 className="text-sm font-bold text-gray-400">Documentation</h5>
          <ul className="ml-5 leading-10">
            <li>Quick Start</li>
            <li>Design System</li>
            <li>Features</li>
          </ul>
        </div>
        <div className="space-y-2">
          <h5 className="text-sm font-bold text-gray-400">Workspace</h5>
          <ul className="ml-5 leading-10">
            <li>Dashboard</li>
            <li>Integrations</li>
          </ul>
        </div>
        <div className="space-y-2">
          <h5 className="text-sm font-bold text-gray-400">Settings</h5>
          <ul className="ml-5 leading-10">
            <li>Project Information</li>
            <li>Domain Configuration</li>
            <li>Team Management</li>
            <li>Advanced</li>
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
