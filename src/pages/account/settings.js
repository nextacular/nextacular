import { useState } from 'react';
import { DocumentDuplicateIcon } from '@heroicons/react/outline';
import { getSession, signOut } from 'next-auth/react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import toast from 'react-hot-toast';
import isEmail from 'validator/lib/isEmail';

import Button from '@/components/Button/index';
import Card from '@/components/Card/index';
import Content from '@/components/Content/index';
import Meta from '@/components/Meta';
import Modal from '@/components/Modal/index';
import { AccountLayout } from '@/layouts/index';
import api from '@/lib/common/api';
import { getUser } from '@/prisma/services/user';

const Settings = ({ user }) => {
  const [email, setEmail] = useState(user.email || '');
  const [isSubmitting, setSubmittingState] = useState(false);
  const [name, setName] = useState(user.name || '');
  const [showModal, setModalState] = useState(false);
  const [userCode] = useState(user.userCode);
  const [verifyEmail, setVerifyEmail] = useState('');
  const validName = name.length > 0 && name.length <= 32;
  const validEmail = isEmail(email);
  const verifiedEmail = verifyEmail === email;

  const copyToClipboard = () => toast.success('Copied to clipboard!');

  const changeName = (event) => {
    event.preventDefault();
    setSubmittingState(true);
    api('/api/user/name', {
      body: { name },
      method: 'PUT',
    }).then((response) => {
      setSubmittingState(false);

      if (response.errors) {
        Object.keys(response.errors).forEach((error) =>
          toast.error(response.errors[error].msg)
        );
      } else {
        toast.success('Name successfully updated!');
      }
    });
  };

  const changeEmail = (event) => {
    event.preventDefault();
    const result = confirm(
      'Are you sure you want to update your email address?'
    );

    if (result) {
      setSubmittingState(true);
      api('/api/user/email', {
        body: { email },
        method: 'PUT',
      }).then((response) => {
        setSubmittingState(false);

        if (response.errors) {
          Object.keys(response.errors).forEach((error) =>
            toast.error(response.errors[error].msg)
          );
        } else {
          toast.success('Email successfully updated and signing you out!');
          setTimeout(() => signOut({ callbackUrl: '/auth/login' }), 2000);
        }
      });
    }
  };

  const deactivateAccount = (event) => {
    event.preventDefault();
    setSubmittingState(true);
    api('/api/user', {
      method: 'DELETE',
    }).then((response) => {
      setSubmittingState(false);
      toggleModal();

      if (response.errors) {
        Object.keys(response.errors).forEach((error) =>
          toast.error(response.errors[error].msg)
        );
      } else {
        toast.success('Account has been deactivated!');
      }
    });
  };

  const handleEmailChange = (event) => setEmail(event.target.value);

  const handleNameChange = (event) => setName(event.target.value);

  const handleVerifyEmailChange = (event) => setVerifyEmail(event.target.value);

  const toggleModal = () => {
    setVerifyEmail('');
    setModalState(!showModal);
  };

  return (
    <AccountLayout>
      <Meta title="Nextacular - Account Settings" />
      <Content.Title
        title="Account Settings"
        subtitle="Manage your profile, preferences, and account settings"
      />
      <Content.Divider />
      <Content.Container>
        <Card>
          <form>
            <Card.Body
              title="Your Name"
              subtitle="Please enter your full name, or a display name you are comfortable with"
            >
              <input
                className="px-3 py-2 border rounded md:w-1/2"
                disabled={isSubmitting}
                onChange={handleNameChange}
                type="text"
                value={name}
              />
            </Card.Body>
            <Card.Footer>
              <small>Please use 32 characters at maximum</small>
              <Button
                className="text-white bg-blue-600 hover:bg-blue-500"
                disabled={!validName || isSubmitting}
                onClick={changeName}
              >
                Save
              </Button>
            </Card.Footer>
          </form>
        </Card>
        <Card>
          <form>
            <Card.Body
              title="Email Address"
              subtitle="Please enter the email address you want to use to log in with
              Nextacular"
            >
              <input
                className="px-3 py-2 border rounded md:w-1/2"
                disabled={isSubmitting}
                onChange={handleEmailChange}
                type="email"
                value={email}
              />
            </Card.Body>
            <Card.Footer>
              <small>We will email you to verify the change</small>
              <Button
                className="text-white bg-blue-600 hover:bg-blue-500"
                disabled={!validEmail || isSubmitting}
                onClick={changeEmail}
              >
                Save
              </Button>
            </Card.Footer>
          </form>
        </Card>
        <Card>
          <Card.Body
            title="Personal Account ID"
            subtitle="Used when interacting with APIs"
          >
            <div className="flex items-center justify-between px-3 py-2 space-x-5 font-mono text-sm border rounded md:w-1/2">
              <span className="overflow-x-auto">{userCode}</span>
              <CopyToClipboard onCopy={copyToClipboard} text={userCode}>
                <DocumentDuplicateIcon className="w-5 h-5 cursor-pointer hover:text-blue-600" />
              </CopyToClipboard>
            </div>
          </Card.Body>
        </Card>
        <Card danger>
          <Card.Body
            title="Danger Zone"
            subtitle="Permanently remove your Personal Account and all of its contents
              from Nextacular platform"
          />
          <Card.Footer>
            <small>
              This action is not reversible, so please continue with caution
            </small>
            <Button
              className="text-white bg-red-600 hover:bg-red-500"
              onClick={toggleModal}
            >
              Deactivate Personal Account
            </Button>
          </Card.Footer>
          <Modal
            show={showModal}
            title="Deactivate Personal Account"
            toggle={toggleModal}
          >
            <p>
              Your account will be deleted, along with all of its Workspace
              contents.
            </p>
            <p className="px-3 py-2 text-red-600 border border-red-600 rounded">
              <strong>Warning:</strong> This action is not reversible. Please be
              certain.
            </p>
            <div className="flex flex-col">
              <label className="text-sm text-gray-400">
                Enter <strong>{user.email}</strong> to continue:
              </label>
              <input
                className="px-3 py-2 border rounded"
                disabled={isSubmitting}
                onChange={handleVerifyEmailChange}
                type="email"
                value={verifyEmail}
              />
            </div>
            <div className="flex flex-col items-stretch">
              <Button
                className="text-white bg-red-600 hover:bg-red-500"
                disabled={!verifiedEmail || isSubmitting}
                onClick={deactivateAccount}
              >
                <span>Deactivate Personal Account</span>
              </Button>
            </div>
          </Modal>
        </Card>
      </Content.Container>
    </AccountLayout>
  );
};

export const getServerSideProps = async (context) => {
  const session = await getSession(context);
  const { email, name, userCode } = await getUser(session.user?.userId);
  return {
    props: {
      user: {
        email,
        name,
        userCode,
      },
    },
  };
};

export default Settings;
