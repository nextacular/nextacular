import { DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import type { GetServerSideProps } from 'next';
import { getSession, signOut } from 'next-auth/react';
import { useState, type ChangeEvent, type MouseEvent } from 'react';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';
import isEmail from 'validator/lib/isEmail';

import Button from '@/components/Button/index';
import Card from '@/components/Card/index';
import Content from '@/components/Content/index';
import Meta from '@/components/Meta/index';
import Modal from '@/components/Modal/index';
import { AccountLayout } from '@/layouts/index';
import { copyToClipboard } from '@/lib/client/clipboard';
import apiFetch from '@/lib/common/api';
import { getUser } from '@/prisma/services/user';

type SettingsUser = {
  email: string;
  name: string;
  userCode: string;
};

type SettingsProps = {
  user: SettingsUser;
};

type MutationResponse = {
  errors?: Record<string, { msg: string }>;
};

const Settings = ({ user }: SettingsProps) => {
  const [email, setEmail] = useState(user.email || '');
  const [isSubmitting, setSubmittingState] = useState(false);
  const [name, setName] = useState(user.name || '');
  const [showModal, setModalState] = useState(false);
  const [userCode] = useState(user.userCode);
  const [verifyEmail, setVerifyEmail] = useState('');
  const validName = name.length > 0 && name.length <= 32;
  const validEmail = isEmail(email);
  const t = useTranslations();
  const verifiedEmail = verifyEmail === email;

  const handleCopyUserCode = async () => {
    try {
      await copyToClipboard(userCode);
      toast.success('Copied to clipboard!');
    } catch {
      toast.error('Could not copy to clipboard');
    }
  };

  const changeName = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setSubmittingState(true);
    apiFetch<MutationResponse>('/api/user/name', {
      body: { name },
      method: 'PUT',
    }).then((response) => {
      setSubmittingState(false);

      if (response.errors) {
        Object.keys(response.errors).forEach((error) =>
          toast.error(response.errors?.[error]?.msg ?? 'Unknown error')
        );
      } else {
        toast.success('Name successfully updated!');
      }
    });
  };

  const changeEmail = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const result = confirm(
      'Are you sure you want to update your email address?'
    );

    if (!result) return;

    setSubmittingState(true);
    apiFetch<MutationResponse>('/api/user/email', {
      body: { email },
      method: 'PUT',
    }).then((response) => {
      setSubmittingState(false);

      if (response.errors) {
        Object.keys(response.errors).forEach((error) =>
          toast.error(response.errors?.[error]?.msg ?? 'Unknown error')
        );
      } else {
        toast.success('Email successfully updated and signing you out!');
        setTimeout(() => signOut({ callbackUrl: '/auth/login' }), 2000);
      }
    });
  };

  const deactivateAccount = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setSubmittingState(true);
    apiFetch<MutationResponse>('/api/user', {
      method: 'DELETE',
    }).then((response) => {
      setSubmittingState(false);
      toggleModal();

      if (response.errors) {
        Object.keys(response.errors).forEach((error) =>
          toast.error(response.errors?.[error]?.msg ?? 'Unknown error')
        );
      } else {
        toast.success('Account has been deactivated!');
      }
    });
  };

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) =>
    setEmail(event.target.value);

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) =>
    setName(event.target.value);

  const handleVerifyEmailChange = (event: ChangeEvent<HTMLInputElement>) =>
    setVerifyEmail(event.target.value);

  const toggleModal = () => {
    setVerifyEmail('');
    setModalState(!showModal);
  };

  return (
    <AccountLayout>
      <Meta title="Nextacular - Account Settings" />
      <Content.Title
        title={t('settings.header.title')}
        subtitle={t('settings.header.description')}
      />
      <Content.Divider />
      <Content.Container>
        <Card>
          <form>
            <Card.Body
              title={t('settings.profile.name')}
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
              <small>{t('settings.profile.name.validation.message')}</small>
              <Button
                className="text-white bg-blue-600 hover:bg-blue-500"
                disabled={!validName || isSubmitting}
                onClick={changeName}
              >
                {t('common.label.save')}
              </Button>
            </Card.Footer>
          </form>
        </Card>
        <Card>
          <form>
            <Card.Body
              title={t('settings.profile.email.label')}
              subtitle={t('settings.profile.email.description')}
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
              <small>{t('settings.profile.email.message')}</small>
              <Button
                className="text-white bg-blue-600 hover:bg-blue-500"
                disabled={!validEmail || isSubmitting}
                onClick={changeEmail}
              >
                {t('common.label.save')}
              </Button>
            </Card.Footer>
          </form>
        </Card>
        <Card>
          <Card.Body
            title={t('settings.profile.personal.account.id')}
            subtitle={t('settings.profile.personal.account.message')}
          >
            <div className="flex items-center justify-between px-3 py-2 space-x-5 font-mono text-sm border rounded md:w-1/2">
              <span className="overflow-x-auto">{userCode}</span>
              <button
                type="button"
                aria-label="Copy user code"
                onClick={handleCopyUserCode}
              >
                <DocumentDuplicateIcon className="w-5 h-5 cursor-pointer hover:text-blue-600" />
              </button>
            </div>
          </Card.Body>
        </Card>
        <Card danger>
          <Card.Body
            title={t('settings.account.deactive.title')}
            subtitle={t('settings.account.deactive.description')}
          />
          <Card.Footer>
            <small>{t('settings.account.deactive.message')}</small>
            <Button
              className="text-white bg-red-600 hover:bg-red-500"
              onClick={toggleModal}
            >
              {t('settings.account.action.deactive.label')}
            </Button>
          </Card.Footer>
          <Modal
            show={showModal}
            title="Deactivate Personal Account"
            toggle={toggleModal}
          >
            <p>{t('settings.account.action.deactive.label')}</p>
            <p className="px-3 py-2 text-red-600 border border-red-600 rounded">
              <strong>Warning:</strong> {t('settings.account.deactive.message')}
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
                <span>{t('settings.account.action.deactive.label')}</span>
              </Button>
            </div>
          </Modal>
        </Card>
      </Content.Container>
    </AccountLayout>
  );
};

export const getServerSideProps: GetServerSideProps<SettingsProps> = async (
  context
) => {
  const session = await getSession(context);
  const userId = session?.user?.userId;

  if (!userId) {
    return { redirect: { destination: '/auth/login', permanent: false } };
  }

  const user = await getUser(userId);

  return {
    props: {
      user: {
        email: user?.email ?? '',
        name: user?.name ?? '',
        userCode: user?.userCode ?? '',
      },
    },
  };
};

export default Settings;
