import { useState } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

import Button from '@/components/Button/index';
import Meta from '@/components/Meta/index';
import Modal from '@/components/Modal/index';
import Card from '@/components/Card/index';
import Content from '@/components/Content/index';
import { AccountLayout } from '@/layouts/index';
import api from '@/lib/common/api';
import { useWorkspace } from '@/providers/workspace';
import { getSession } from 'next-auth/react';
import { getWorkspace, isWorkspaceCreator } from '@/prisma/services/workspace';
import { useTranslation } from "react-i18next";

const Advanced = ({ isCreator }) => {
  const { setWorkspace, workspace } = useWorkspace();
  const { t } = useTranslation();
  const router = useRouter();
  const [isSubmitting, setSubmittingState] = useState(false);
  const [showModal, setModalState] = useState(false);
  const [verifyWorkspace, setVerifyWorkspace] = useState('');
  const verifiedWorkspace = verifyWorkspace === workspace?.slug;

  const handleVerifyWorkspaceChange = (event) =>
    setVerifyWorkspace(event.target.value);

  const deleteWorkspace = () => {
    setSubmittingState(true);
    api(`/api/workspace/${workspace.slug}`, {
      method: 'DELETE',
    }).then((response) => {
      setSubmittingState(false);

      if (response.errors) {
        Object.keys(response.errors).forEach((error) =>
          toast.error(response.errors[error].msg)
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
        title={t("settings.workspace.advanced")}
        subtitle={t("settings.workspace.manage.label")}
      />
      <Content.Divider />
      <Content.Container>
        <Card danger>
          <Card.Body
            title={t("settings.workspace.delete")}
            subtitle={t("settings.workspace.delete.message")}
          />
          <Card.Footer>
            <small className={[isCreator && 'text-red-600']}>
              {isCreator
                ? t("setting.workspace.delete.warning.message")
                : t("settings.workspace.delete.contact.message")}
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
              <span>
                {t("settings.workspace.delete.data.warning")}
              </span>
              <span>
                Data associated with this workspace can&apos;t be accessed by
                team members.
              </span>
            </p>
            <p className="px-3 py-2 text-red-600 border border-red-600 rounded">
              <strong>Warning:</strong> {t("settings.workspace.delete.final.message")}
            </p>
            <div className="flex flex-col">
              <label className="text-sm text-gray-400">
                Enter <strong>{workspace?.slug}</strong> to continue:
              </label>
              <input
                className="px-3 py-2 border rounded"
                disabled={isSubmitting}
                onChange={handleVerifyWorkspaceChange}
                type="email"
                value={verifyWorkspace}
              />
            </div>
            <div className="flex flex-col items-stretch">
              <Button
                className="text-white bg-red-600 hover:bg-red-500"
                disabled={!verifiedWorkspace || isSubmitting}
                onClick={deleteWorkspace}
              >
                <span>{t("settings.workspace.delete")}</span>
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
  let isCreator = false;

  if (session) {
    const workspace = await getWorkspace(
      session.user.userId,
      session.user.email,
      context.params.workspaceSlug
    );
    isCreator = isWorkspaceCreator(session.user.userId, workspace.creatorId);
  }

  return { props: { isCreator } };
};

export default Advanced;
