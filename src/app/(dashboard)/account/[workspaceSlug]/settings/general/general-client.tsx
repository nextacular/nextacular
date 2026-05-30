'use client';

import { DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useState, type ChangeEvent, type MouseEvent } from 'react';
import toast from 'react-hot-toast';
import isAlphanumeric from 'validator/lib/isAlphanumeric';
import isSlug from 'validator/lib/isSlug';

import Button from '@/components/Button/index';
import Card from '@/components/Card/index';
import Content from '@/components/Content/index';
import { copyToClipboard } from '@/lib/client/clipboard';
import apiFetch from '@/lib/common/api';
import { useWorkspace, type Workspace } from '@/providers/workspace';

type GeneralClientProps = {
  isTeamOwner: boolean;
  workspace: Workspace | null;
};

type SlugResponse = {
  errors?: Record<string, { msg: string }>;
  data?: { slug: string };
};

type MutationResponse = {
  errors?: Record<string, { msg: string }>;
};

const GeneralClient = ({ isTeamOwner, workspace }: GeneralClientProps) => {
  const router = useRouter();
  const { setWorkspace } = useWorkspace();
  const t = useTranslations();
  const [isSubmitting, setSubmittingState] = useState(false);
  const [name, setName] = useState(workspace?.name ?? '');
  const [slug, setSlug] = useState(workspace?.slug ?? '');
  const validName = name.length > 0 && name.length <= 16;
  const validSlug =
    slug.length > 0 &&
    slug.length <= 16 &&
    isSlug(slug) &&
    isAlphanumeric(slug, undefined, { ignore: '-' });

  useEffect(() => {
    if (!workspace) return;
    setName(workspace.name);
    setSlug(workspace.slug);
    setWorkspace(workspace);
  }, [workspace, setWorkspace]);

  if (!workspace) return null;

  const changeName = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setSubmittingState(true);
    apiFetch<MutationResponse>(`/api/workspace/${workspace.slug}/name`, {
      body: { name },
      method: 'PUT',
    }).then((response) => {
      setSubmittingState(false);

      if (response.errors) {
        Object.keys(response.errors).forEach((error) =>
          toast.error(response.errors?.[error]?.msg ?? 'Unknown error')
        );
      } else {
        toast.success('Workspace name successfully updated!');
      }
    });
  };

  const changeSlug = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setSubmittingState(true);
    apiFetch<SlugResponse>(`/api/workspace/${workspace.slug}/slug`, {
      body: { slug },
      method: 'PUT',
    }).then((response) => {
      setSubmittingState(false);
      const newSlug = response?.data?.slug;

      if (response.errors) {
        Object.keys(response.errors).forEach((error) =>
          toast.error(response.errors?.[error]?.msg ?? 'Unknown error')
        );
      } else if (newSlug) {
        toast.success('Workspace slug successfully updated!');
        router.replace(`/account/${newSlug}/settings/general`);
      }
    });
  };

  const handleCopyWorkspaceCode = async () => {
    try {
      await copyToClipboard(String(workspace.workspaceCode));
      toast.success('Copied to clipboard!');
    } catch {
      toast.error('Could not copy to clipboard');
    }
  };

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) =>
    setName(event.target.value);

  const handleSlugChange = (event: ChangeEvent<HTMLInputElement>) =>
    setSlug(event.target.value);

  return (
    <>
      <Content.Title
        title={t('settings.workspace.information')}
        subtitle={t('settings.general.workspace.description')}
      />
      <Content.Divider />
      <Content.Container>
        <Card>
          <Card.Body
            title={t('workspace.action.name.label')}
            subtitle={t('settings.workspace.name.description')}
          >
            <input
              className="px-3 py-2 border rounded md:w-1/2"
              disabled={isSubmitting || !isTeamOwner}
              onChange={handleNameChange}
              type="text"
              value={name}
            />
          </Card.Body>
          <Card.Footer>
            <small>Please use 16 characters at maximum</small>
            {isTeamOwner && (
              <Button
                className="text-white bg-blue-600 hover:bg-blue-500"
                disabled={!validName || isSubmitting}
                onClick={changeName}
              >
                Save
              </Button>
            )}
          </Card.Footer>
        </Card>
        <Card>
          <Card.Body
            title={t('settings.workspace.slug')}
            subtitle={t('setting.workspace.slug.description')}
          >
            <div className="flex items-center space-x-3">
              <input
                className="px-3 py-2 border rounded md:w-1/2"
                disabled={isSubmitting || !isTeamOwner}
                onChange={handleSlugChange}
                type="text"
                value={slug}
              />
              <span
                className={`text-sm ${slug.length > 16 ? 'text-red-600' : ''}`}
              >
                {slug.length} / 16
              </span>
            </div>
          </Card.Body>
          <Card.Footer>
            <small>{t('settings.workspace.slug.validation.message')}</small>
            {isTeamOwner && (
              <Button
                className="text-white bg-blue-600 hover:bg-blue-500"
                disabled={!validSlug || isSubmitting}
                onClick={changeSlug}
              >
                {t('common.label.save')}
              </Button>
            )}
          </Card.Footer>
        </Card>
        <Card>
          <Card.Body
            title={t('settings.workspace.slug.validation.message')}
            subtitle={t('settings.workspace.id.description')}
          >
            <div className="flex items-center justify-between px-3 py-2 space-x-5 font-mono text-sm border rounded md:w-1/2">
              <span className="overflow-x-auto">
                {String(workspace.workspaceCode)}
              </span>
              <button
                type="button"
                aria-label="Copy workspace code"
                onClick={handleCopyWorkspaceCode}
              >
                <DocumentDuplicateIcon className="w-5 h-5 cursor-pointer hover:text-blue-600" />
              </button>
            </div>
          </Card.Body>
        </Card>
      </Content.Container>
    </>
  );
};

export default GeneralClient;
