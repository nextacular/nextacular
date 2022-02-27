import { useState } from 'react';
import { ExternalLinkIcon } from '@heroicons/react/outline';
import { getSession } from 'next-auth/react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { mutate } from 'swr';
import isFQDN from 'validator/lib/isFQDN';

import Button from '@/components/Button/index';
import DomainCard from '@/components/Card/domain';
import Card from '@/components/Card/index';
import Content from '@/components/Content/index';
import { useDomains } from '@/hooks/data';
import { AccountLayout } from '@/layouts/index';
import api from '@/lib/common/api';
import prisma from '@/prisma/index';
import { TeamRole } from '@prisma/client';

const Domain = ({ isTeamOwner, workspace }) => {
  const { data, isLoading } = useDomains(workspace.slug);
  const [domain, setDomain] = useState('');
  const [isSubmitting, setSubmittingState] = useState(false);
  const validDomainName = isFQDN(domain);

  const addDomain = (event) => {
    event.preventDefault();
    setSubmittingState(true);
    api(`/api/workspace/${workspace.slug}/domain`, {
      body: { domainName: domain },
      method: 'POST',
    }).then((response) => {
      setSubmittingState(false);

      if (response.errors) {
        Object.keys(response.errors).forEach((error) =>
          toast.error(response.errors[error].msg)
        );
      } else {
        setDomain('');
        toast.success('Domain successfully added to workspace!');
      }
    });
  };

  const handleDomainChange = (event) => setDomain(event.target.value);

  const refresh = (domain) =>
    mutate(`/api/workspace/domain/check?domain=${domain}`);

  const remove = (domain) => {
    api(`/api/workspace/${workspace.slug}/domain`, {
      body: { domainName: domain },
      method: 'DELETE',
    }).then((response) => {
      if (response.errors) {
        Object.keys(response.errors).forEach((error) =>
          toast.error(response.errors[error].msg)
        );
      } else {
        toast.success('Domain successfully deleted from workspace!');
      }
    });
  };

  return (
    <AccountLayout>
      <Content.Title
        title="Subdomain Management"
        subtitle="Manage your subdomain"
      />
      <Content.Divider />
      <Content.Container>
        <Card>
          <Card.Body
            title="Subdomain"
            subtitle="Your subdomain depends on your workspace slug"
          >
            <div className="flex items-center justify-between px-3 py-2 font-mono text-sm border rounded md:w-1/2">
              <div>
                <strong>{workspace.slug}</strong>
                <span className="pr-3">
                  .{process.env.NEXT_PUBLIC_ROOT_URL}
                </span>
              </div>
              <Link
                href={`http://${workspace.slug}.${process.env.NEXT_PUBLIC_ROOT_URL}`}
              >
                <a target="_blank">
                  <ExternalLinkIcon className="w-5 h-5 cursor-pointer hover:text-blue-600" />
                </a>
              </Link>
            </div>
          </Card.Body>
        </Card>
      </Content.Container>
      {isTeamOwner && (
        <>
          <Content.Divider thick />
          <Content.Title
            title="Domain Configuration"
            subtitle="Manage your subdomain and domain names"
          />
          <Content.Divider />
          <Content.Container>
            <Card>
              <form>
                <Card.Body
                  title="Add Your Domain"
                  subtitle="This domain is assigned to your current workspace"
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
            ) : data?.domains.length > 0 ? (
              data.domains.map((domain, index) => (
                <DomainCard
                  key={index}
                  apex={process.env.NEXT_PUBLIC_VERCEL_IP_ADDRESS}
                  cname={`${workspace.slug}.${process.env.NEXT_PUBLIC_ROOT_URL}`}
                  isLoading={false}
                  name={domain.name}
                  refresh={refresh}
                  remove={remove}
                />
              ))
            ) : (
              <Content.Empty>
                Once you&apos;ve added your domain on Nextacular, that domain
                will show up here
              </Content.Empty>
            )}
          </Content.Container>
        </>
      )}
    </AccountLayout>
  );
};

export const getServerSideProps = async (context) => {
  const session = await getSession(context);
  let isTeamOwner = false;
  let workspace = null;

  if (session) {
    const slug = context.params.workspaceSlug;
    workspace = await prisma.workspace.findFirst({
      select: {
        creatorId: true,
        slug: true,
        members: {
          select: {
            email: true,
            teamRole: true,
          },
        },
      },
      where: {
        OR: [
          { id: session.user.userId },
          {
            members: {
              some: {
                email: session.user.email,
                deletedAt: null,
              },
            },
          },
        ],
        AND: {
          deletedAt: null,
          slug,
        },
      },
    });

    if (workspace) {
      const member = workspace.members.find(
        (member) =>
          member.email === session.user.email &&
          member.teamRole === TeamRole.OWNER
      );

      if (member) {
        isTeamOwner = true;
      }
    }
  }

  return {
    props: {
      isTeamOwner,
      workspace,
    },
  };
};

export default Domain;
