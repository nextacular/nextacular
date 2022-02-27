import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import {
  CogIcon,
  CreditCardIcon,
  DesktopComputerIcon,
  LogoutIcon,
  MoonIcon,
  SunIcon,
  UserCircleIcon,
} from '@heroicons/react/outline';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { useTheme } from 'next-themes';

const Header = () => {
  const { data } = useSession();
  const { theme, setTheme } = useTheme();

  const logOut = () => {
    const result = confirm('Are you sure you want to logout?');

    if (result) {
      signOut({ callbackUrl: '/' });
    }
  };

  const toggleTheme = (event) => {
    event.preventDefault();
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="flex flex-row items-center justify-between">
      <div>
        <h5 className="font-bold text-gray-800 dark:text-gray-200">
          {data && data.user && (
            <span>{data.user.name || data.user.email}</span>
          )}
        </h5>
      </div>
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="flex items-center justify-center px-5 py-2 space-x-3 border rounded hover:bg-gray-100 dark:hover:text-gray-800">
            <CogIcon aria-hidden="true" className="w-5 h-5" />
            <span>Settings</span>
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 w-40 mt-2 origin-top-right bg-white border divide-y divide-gray-100 rounded">
            <div className="p-2">
              <Menu.Item>
                <Link href="/account/settings">
                  <a className="flex items-center w-full px-2 py-2 space-x-2 text-sm text-gray-800 rounded hover:bg-blue-600 hover:text-white group">
                    <UserCircleIcon aria-hidden="true" className="w-5 h-5" />
                    <span>Account</span>
                  </a>
                </Link>
              </Menu.Item>
              <Menu.Item>
                <Link href="/account/billing">
                  <a className="flex items-center w-full px-2 py-2 space-x-2 text-sm text-gray-800 rounded hover:bg-blue-600 hover:text-white group">
                    <CreditCardIcon aria-hidden="true" className="w-5 h-5" />
                    <span>Billing</span>
                  </a>
                </Link>
              </Menu.Item>
            </div>
            <div className="p-2">
              <Menu.Item>
                <Link href="/">
                  <a className="flex items-center w-full px-2 py-2 space-x-2 text-sm text-gray-800 rounded hover:bg-blue-600 hover:text-white group">
                    <DesktopComputerIcon
                      aria-hidden="true"
                      className="w-5 h-5"
                    />
                    <span>Landing Page</span>
                  </a>
                </Link>
              </Menu.Item>
              <Menu.Item>
                <button
                  className="flex items-center w-full px-2 py-2 space-x-2 text-sm text-gray-800 rounded hover:bg-blue-600 hover:text-white group"
                  onClick={toggleTheme}
                >
                  {theme === 'dark' ? (
                    <>
                      <SunIcon className="w-5 h-5" />
                      <span>Light Mode</span>
                    </>
                  ) : (
                    <>
                      <MoonIcon className="w-5 h-5" />
                      <span>Dark Mode</span>
                    </>
                  )}
                </button>
              </Menu.Item>
            </div>
            <div className="p-2">
              <Menu.Item>
                <button
                  className="flex items-center w-full px-2 py-2 space-x-2 text-sm text-gray-800 rounded hover:bg-blue-600 hover:text-white group"
                  onClick={logOut}
                >
                  <LogoutIcon aria-hidden="true" className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};

export default Header;
