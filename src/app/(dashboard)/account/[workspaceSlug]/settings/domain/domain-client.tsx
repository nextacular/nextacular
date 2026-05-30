'use client';

import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState, type ChangeEvent, type MouseEvent } from 'react';
import toast from 'react-hot-toast';
import { mutate } from 'swr';
import isFQDN from 'validator/lib/isFQDN';

import Button from '@/components/Button/index';
import DomainCard, { type DomainInfo } from '@/components/Card/domain';
import Card from '@/components/Card/index';
import Content from '@/components/Content/index';
import { useDomains } from '@/hooks/data';
import apiFetch from '@/lib/common/api';

type WorkspaceForDomain = {
  slug: string;
  name: string;
  host: string;
  hostname: string;
};

type DomainClientProps = {
  isTeamOwner: boolean;
  workspace: WorkspaceForDomain | null;
};

type MutationResponse = {
  errors?: Record<string, { msg: string }>;
};

const DomainClient = ({ isTeamOwner, workspace }: DomainClientProps) => {
  const t = useTranslations();
  const { data, isLoading } = useDomains(workspace?.slug ?? '');
  const [domain, setDomain] = useState('');
  const [isSubmitting, setSubmittingState] = useState(false);
  const validDomainName = isFQDN(domain);

  if (!workspace) return null;

  const addDomain = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setSubmittingState(true);
    apiFetch<MutationResponse>(`/api/workspace/${workspace.slug}/domain`, {
      body: { domainName: domain },
      method: 'POST',
    }).then((response) => {
      setSubmittingState(false);

      if (response.errors) {
        Object.keys(response.errors).forEach((error) =>
          toast.error(response.errors?.[error]?.msg ?? 'Unknown error')
        );
      } else {
        setDomain('');
        toast.success('Domain successfully added to workspace!');
      }
    });
  };

  const handleDomainChange = (event: ChangeEvent<HTMLInputElement>) =>
    setDomain(event.target.value);

  const refresh = (domainName: string, verified: boolean | null) => {
    setSubmittingState(true);

    if (verified) {
      mutate(`/api/workspace/domain/check?domain=${domainName}`).then(() =>
        setSubmittingState(false)
      );
    } else {
      apiFetch<MutationResponse>(`/api/workspace/${workspace.slug}/domain`, {
        body: { domainName },
        method: 'PUT',
      }).then((response) => {
        setSubmittingState(false);

        if (response.errors) {
          Object.keys(response.errors).forEach((error) =>
            toast.error(response.errors?.[error]?.msg ?? 'Unknown error')
          );
        } else {
          toast.success('Domain successfully verified!');
        }
      });
    }

    return Boolean(verified);
  };

  const remove = (domainName: string) => {
    apiFetch<MutationResponse>(`/api/workspace/${workspace.slug}/domain`, {
      body: { domainName },
      method: 'DELETE',
    }).then((response) => {
      if (response.errors) {
        Object.keys(response.errors).forEach((error) =>
          toast.error(response.errors?.[error]?.msg ?? 'Unknown error')
        );
      } else {
        toast.success('Domain successfully deleted from workspace!');
      }
    });
  };

  const domains = data?.domains ?? [];

  return (
    <>
      <Content.Title
        title={t('settings.domain.subdomain.management')}
        subtitle={t('settings.domain.subdomain.management.description')}
      />
      <Content.Divider />
      <Content.Container>
        <Card>
          <Card.Body
            title={t('settings.domain.subdomain.title')}
            subtitle={t('settings.domain.subdomain.description')}
          >
            <div className="flex items-center justify-between px-3 py-2 font-mono text-sm border rounded md:w-1/2">
              <div>
                <strong>{workspace.slug}</strong>
                <span className="pr-3">.{workspace.host}</span>
              </div>
              <Link href={`http://${workspace.hostname}`} target="_blank">
                <ArrowTopRightOnSquareIcon className="w-5 h-5 cursor-pointer hover:text-blue-600" />
              </Link>
            </div>
          </Card.Body>
        </Card>
      </Content.Container>
      {isTeamOwner && (
        <>
          <Content.Divider thick />
          <Content.Title
            title={t('settings.domain.domain.configuration')}
            subtitle={t('settings.domain.domain.configuration.description')}
          />
          <Content.Divider />
          <Content.Container>
            <Card>
              <form>
                <Card.Body
                  title={t('settings.domain.add.label')}
                  subtitle={t('settings.domain.add.description')}
                >
                  <input
                    className="px-3 py-2 border rounded md:w-1/2"
                    disabled={isSubmitting}
                    onChange={handleDomainChange}
                    placeholder="mydomain.com"
                    type="text"
                    value={domain}
                  />
                </Card.Body>
                <Card.Footer>
                  <span />
                  <Button
                    className="text-white bg-blue-600 hover:bg-blue-500"
                    disabled={!validDomainName || isSubmitting}
                    onClick={addDomain}
                  >
                    Add
                  </Button>
                </Card.Footer>
              </form>
            </Card>
            {isLoading ? (
              <DomainCard isLoading />
            ) : domains.length > 0 ? (
              domains.map((entry, index) => (
                <DomainCard
                  key={index}
                  apex={process.env.NEXT_PUBLIC_VERCEL_IP_ADDRESS}
                  cname={workspace.hostname}
                  isLoading={isSubmitting}
                  domain={entry as DomainInfo}
                  refresh={refresh}
                  remove={remove}
                />
              ))
            ) : (
              <Content.Empty>
                {t('settings.domain.empty.message')}
              </Content.Empty>
            )}
          </Content.Container>
        </>
      )}
    </>
  );
};

export default DomainClient;
