import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

const Modal = ({ children, show, subtitle, title, toggle }) => {
  return (
    <Transition appear as={Fragment} show={show}>
      <Dialog
        className="fixed inset-0 z-20 overflow-y-auto text-gray-800"
        onClose={toggle}
      >
        <div className="h-screen px-5 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-30" />
          </Transition.Child>
          <span
            aria-hidden="true"
            className="inline-block h-screen align-middle"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block p-10 my-10 space-y-5 overflow-hidden text-left align-middle transition-all transform bg-white rounded shadow-xl">
              <Dialog.Title as="h2" className="text-2xl font-bold leading-5">
                {title}
              </Dialog.Title>
              {children}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
