import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import { useState, type ChangeEvent } from 'react';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';

import Button from '@/components/Button/index';
import Card from '@/components/Card/index';
import Content from '@/components/Content/index';
import Meta from '@/components/Meta/index';
import Modal from '@/components/Modal/index';
import { AccountLayout } from '@/layouts/index';
import apiFetch from '@/lib/common/api';
import { useWorkspace } from '@/providers/workspace';
import { getWorkspace, isWorkspaceCreator } from '@/prisma/services/workspace';

type AdvancedProps = {
  isCreator: boolean;
};

type MutationResponse = {
  errors?: Record<string, { msg: string }>;
};

const Advanced = ({ isCreator }: AdvancedProps) => {
  const { setWorkspace, workspace } = useWorkspace();
  const t = useTranslations();
  const router = useRouter();
  const [isSubmitting, setSubmittingState] = useState(false);
  const [showModal, setModalState] = useState(false);
  const [verifyWorkspace, setVerifyWorkspace] = useState('');
  const verifiedWorkspace = verifyWorkspace === workspace?.slug;

  const handleVerifyWorkspaceChange = (event: ChangeEvent<HTMLInputElement>) =>
    setVerifyWorkspace(event.target.value);

  const deleteWorkspace = () => {
    if (!workspace) return;
    setSubmittingState(true);
    apiFetch<MutationResponse>(`/api/workspace/${workspace.slug}`, {
      method: 'DELETE',
    }).then((response) => {
      setSubmittingState(false);

      if (response.errors) {
        Object.keys(response.errors).forEach((error) =>
          toast.error(response.errors?.[error]?.msg ?? 'Unknown error')
        );
      } else {
        toggleModal();
        setWorkspace(null);
        router.replace('/account');
        toast.success('Workspace has been deleted!');
      }
    });
  };

  const toggleModal = () => {
    setVerifyWorkspace('');
    setModalState(!showModal);
  };

  return (
    <AccountLayout>
      <Meta title={`Nextacular - ${workspace?.name} | Advanced Settings`} />
      <Content.Title
        title={t('settings.workspace.advanced')}
        subtitle={t('settings.workspace.manage.label')}
      />
      <Content.Divider />
      <Content.Container>
        <Card danger>
          <Card.Body
            title={t('settings.workspace.delete')}
            subtitle={t('settings.workspace.delete.message')}
          />
          <Card.Footer>
            <small className={isCreator ? 'text-red-600' : undefined}>
              {isCreator
                ? t('setting.workspace.delete.warning.message')
                : t('settings.workspace.delete.contact.message')}
            </small>
            {isCreator && (
              <Button
                className="text-white bg-red-600 hover:bg-red-500"
                disabled={isSubmitting}
                onClick={toggleModal}
              >
                {isSubmitting ? 'Deleting' : 'Delete'}
              </Button>
            )}
          </Card.Footer>
          <Modal
            show={showModal}
            title="Deactivate Workspace"
            toggle={toggleModal}
          >
            <p className="flex flex-col">
              <span>{t('settings.workspace.delete.data.warning')}</span>
              <span>
                Data associated with this workspace can&apos;t be accessed by
                team members.
              </span>
            </p>
            <p className="px-3 py-2 text-red-600 border border-red-600 rounded">
              <strong>Warning:</strong>{' '}
              {t('settings.workspace.delete.final.message')}
            </p>
            <div className="flex flex-col">
              <label className="text-sm text-gray-400">
                Enter <strong>{workspace?.slug}</strong> to continue:
              </label>
              <input
                className="px-3 py-2 border rounded"
                disabled={isSubmitting}
                onChange={handleVerifyWorkspaceChange}
                type="text"
                value={verifyWorkspace}
              />
            </div>
            <div className="flex flex-col items-stretch">
              <Button
                className="text-white bg-red-600 hover:bg-red-500"
                disabled={!verifiedWorkspace || isSubmitting}
                onClick={deleteWorkspace}
              >
                <span>{t('settings.workspace.delete')}</span>
              </Button>
            </div>
          </Modal>
        </Card>
      </Content.Container>
    </AccountLayout>
  );
};

export const getServerSideProps: GetServerSideProps<AdvancedProps> = async (
  context
) => {
  const session = await getSession(context);
  let isCreator = false;

  if (session?.user) {
    const workspaceSlug =
      typeof context.params?.workspaceSlug === 'string'
        ? context.params.workspaceSlug
        : '';
    const workspace = workspaceSlug
      ? await getWorkspace(
          session.user.userId,
          session.user.email,
          workspaceSlug
        )
      : null;

    if (workspace) {
      isCreator = isWorkspaceCreator(session.user.userId, workspace.creatorId);
    }
  }

  return { props: { isCreator } };
};

export default Advanced;
