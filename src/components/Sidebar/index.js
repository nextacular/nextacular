import { useState } from 'react';
import { Listbox } from '@headlessui/react';
import { PlusIcon, SelectorIcon } from '@heroicons/react/solid';
import Link from 'next/link';

import Button from '../Button';
import Modal from '../Modal';

const Sidebar = ({ menu, hideActions }) => {
  const [showModal, setModalState] = useState(false);

  const toggleModal = () => setModalState(!showModal);

  return (
    <aside className="sticky flex flex-col w-1/4 h-screen space-y-5 overflow-y-auto text-white bg-gray-800 overscroll-contain">
      <div className="flex items-center justify-center p-5 text-center border-b border-b-gray-900">
        <Link href="/">
          <a className="flex-grow text-2xl font-bold">Nextacular</a>
        </Link>
      </div>
      {!hideActions && (
        <div className="flex flex-col items-stretch justify-center px-5 space-y-3">
          <Button
            className="text-white bg-blue-600 hover:bg-blue-500"
            onClick={toggleModal}
          >
            <PlusIcon className="w-5 h-5 text-white" aria-hidden="true" />
            <span>Create Workspace</span>
          </Button>
          <Modal
            show={showModal}
            title="Create a Workspace"
            toggle={toggleModal}
          >
            <div className="space-y-0 text-sm text-gray-600">
              <p>
                Create a workspace to keep your team&apos;s content in one
                place.
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
            <div className="flex flex-col items-stretch">
              <Button
                className="text-white bg-blue-600 hover:bg-blue-500"
                onClick={toggleModal}
              >
                <span>Create Workspace</span>
              </Button>
            </div>
          </Modal>
          <Listbox className="" value={null} onChange={null}>
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
      )}
      <div className="flex flex-col p-5 space-y-10">
        <div className="space-y-2">
          <h5 className="text-sm font-bold text-gray-400">Account</h5>
          <ul className="ml-5 leading-10">
            <li>
              <Link href="/account">
                <a className="text-gray-300 hover:text-white">Dashboard</a>
              </Link>
            </li>
            <li>
              <Link href="/account/billing">
                <a className="text-gray-300 hover:text-white">Billing</a>
              </Link>
            </li>
            <li>
              <Link href="/account/settings">
                <a className="text-gray-300 hover:text-white">Settings</a>
              </Link>
            </li>
          </ul>
        </div>
        {menu.map((item, index) => (
          <div key={index} className="space-y-2">
            <h5 className="text-sm font-bold text-gray-400">{item.name}</h5>
            <ul className="ml-5 leading-10">
              {item.menuItems.map((entry, index) => (
                <li key={index}>
                  <Link href={entry.path}>
                    <a className="text-gray-300 hover:text-white">
                      {entry.name}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
