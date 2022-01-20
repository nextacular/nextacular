import { useState } from 'react';
import { Listbox } from '@headlessui/react';
import { PlusIcon, SelectorIcon } from '@heroicons/react/solid';
import Link from 'next/link';

import Modal from '../Modal';

const Sidebar = () => {
  const [showModal, setModalState] = useState(false);

  const toggleModal = () => setModalState(!showModal);

  return (
    <aside className="sticky flex flex-col w-1/4 h-screen space-y-5 overflow-y-auto text-white bg-gray-800 overscroll-contain">
      <div className="p-5 text-center border-b border-b-gray-900">
        <a className="text-2xl font-bold" href="#!">
          Nextacular
        </a>
      </div>
      <div className="flex flex-col items-center justify-center px-5 space-y-3">
        <button
          className="flex flex-row items-center justify-center w-full p-2 space-x-3 bg-blue-600 rounded hover:bg-blue-500"
          onClick={toggleModal}
        >
          <PlusIcon className="w-5 h-5 text-white" aria-hidden="true" />
          <span>Create Workspace</span>
        </button>
        <Modal show={showModal} title="Create a Workspace" toggle={toggleModal}>
          <div className="space-y-0 text-sm text-gray-600">
            <p>
              Create a workspace to keep your team&apos;s content in one place.
            </p>
            <p>You&apos;ll be able to invite everyone later!</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold">Workspace Name</h3>
            <p className="text-sm text-gray-400">
              Name your workspace. Keep it simple.
            </p>
            <input className="w-full px-3 py-2 border rounded" type="text" />
          </div>
          <div>
            <button
              className="flex flex-row items-center justify-center w-full p-2 space-x-3 text-white bg-blue-600 rounded hover:bg-blue-500"
              onClick={toggleModal}
            >
              <span>Create Workspace</span>
            </button>
          </div>
        </Modal>
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
            <li>
              <Link href="/account">
                <a className="text-gray-300 hover:text-white">Overview</a>
              </Link>
            </li>
            <li>
              <Link href="/account/quick-start">
                <a className="text-gray-300 hover:text-white">Quick Start</a>
              </Link>
            </li>
            <li>
              <Link href="/account/design-system">
                <a className="text-gray-300 hover:text-white">Design System</a>
              </Link>
            </li>
            <li>
              <Link href="/account/features">
                <a className="text-gray-300 hover:text-white">Features</a>
              </Link>
            </li>
          </ul>
        </div>
        <div className="space-y-2">
          <h5 className="text-sm font-bold text-gray-400">Workspace</h5>
          <ul className="ml-5 leading-10">
            <li>
              <Link href="#!">
                <a className="text-gray-300 hover:text-white">Dashboard</a>
              </Link>
            </li>
            <li>
              <Link href="#!">
                <a className="text-gray-300 hover:text-white">Integrations</a>
              </Link>
            </li>
          </ul>
        </div>
        <div className="space-y-2">
          <h5 className="text-sm font-bold text-gray-400">Settings</h5>
          <ul className="ml-5 leading-10">
            <li>
              <Link href="/account/workspace/settings/general">
                <a className="text-gray-300 hover:text-white">
                  Workspace Information
                </a>
              </Link>
            </li>
            <li>
              <Link href="/account/workspace/settings/domains">
                <a className="text-gray-300 hover:text-white">
                  Domain Configurations
                </a>
              </Link>
            </li>
            <li>
              <Link href="/account/workspace/settings/team">
                <a className="text-gray-300 hover:text-white">
                  Team Management
                </a>
              </Link>
            </li>
            <li>
              <Link href="/account/workspace/settings/advanced">
                <a className="text-gray-300 hover:text-white">Advanced</a>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
