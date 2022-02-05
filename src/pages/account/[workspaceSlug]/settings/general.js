import { useEffect, useState } from 'react';
import { DocumentDuplicateIcon } from '@heroicons/react/outline';
import { getSession } from 'next-auth/react';
import toast from 'react-hot-toast';

import Button from '../../../../components/Button';
import Card from '../../../../components/Card';
import Content from '../../../../components/Content';
import { AccountLayout } from '../../../../layouts';
import api from '../../../../lib/client/api';
import prisma from '../../../../../prisma';

// import PrismaClient from '@prisma/client';
// const prisma = new PrismaClient();

const General = ({ workspace }) => {
  const [isSubmitting, setSubmittingState] = useState(false);
  const [name, setName] = useState(workspace.name || '');
  const validName = name.length > 0 && name.length <= 16;

  const changeName = (event) => {
    event.preventDefault();
    setSubmittingState(true);
    api(`/api/workspace/${workspace.slug}/name`, {
      body: { name },
      method: 'PUT',
    }).then((response) => {
      setSubmittingState(false);

      if (response.errors) {
        Object.keys(response.errors).forEach((error) =>
          toast.error(response.errors[error].msg)
        );
      } else {
        toast.success('Workspace name successfully updated!');
      }
    });
  };

  const handleNameChange = (event) => setName(event.target.value);

  useEffect(() => {
    setName(workspace.name);
  }, [workspace]);

  return (
    <AccountLayout>
      <Content.Title
        title="Workspace Information"
        subtitle="Manage your workspace details and information"
      />
      <Content.Divider />
      <Content.Container>
        <Card>
          <Card.Body
            title="Workspace Name"
            subtitle="Used to identify your Workspace on the Dashboard"
          >
            <input
              className="w-1/2 px-3 py-2 border rounded"
              disabled={isSubmitting}
              onChange={handleNameChange}
              type="text"
              value={name}
            />
          </Card.Body>
          <Card.Footer>
            <small>Please use 16 characters at maximum</small>
            <Button
              className="text-white bg-blue-600 hover:bg-blue-500"
              disabled={!validName || isSubmitting}
              onClick={changeName}
            >
              Save
            </Button>
          </Card.Footer>
        </Card>
        <Card>
          <Card.Body
            title="Workspace ID"
            subtitle="Used when interacting with APIs"
          >
            <div className="flex items-center justify-between w-1/2 px-3 py-2 space-x-5 font-mono text-sm border rounded">
              <span className="overflow-x-auto">{workspace.workspaceCode}</span>
              <DocumentDuplicateIcon className="w-5 h-5 cursor-pointer hover:text-blue-600" />
            </div>
          </Card.Body>
        </Card>
      </Content.Container>
    </AccountLayout>
  );
};

export const getServerSideProps = async (context) => {
  const session = await getSession(context);
  let workspace = null;

  if (session) {
    const slug = context.params.workspaceSlug;
    workspace = await prisma.workspace.findFirst({
      select: {
        name: true,
        slug: true,
        workspaceCode: true,
      },
      where: {
        OR: [
          {
            id: session.user.userId,
          },
          {
            members: {
              every: {
                userId: session.user.userId,
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
  }

  return {
    props: {
      workspace,
    },
  };
};

export default General;
