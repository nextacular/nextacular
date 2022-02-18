import { useState } from 'react';
import {
  ChevronDownIcon,
  DocumentDuplicateIcon,
  DotsVerticalIcon,
  PlusCircleIcon,
  XIcon,
} from '@heroicons/react/outline';
import { TeamRole } from '@prisma/client';
import { getSession } from 'next-auth/react';
import CopyToClipboard from 'react-copy-to-clipboard';
import toast from 'react-hot-toast';
import isEmail from 'validator/lib/isEmail';

import Button from '../../../../components/Button';
import Card from '../../../../components/Card';
import Content from '../../../../components/Content';
import { AccountLayout } from '../../../../layouts';
import prisma from '../../../../../prisma';
import api from '../../../../lib/client/api';

const MEMBERS_TEMPLATE = { email: '', role: TeamRole.MEMBER };

const Team = ({ isOwnWorkspace, workspace }) => {
  const [isSubmitting, setSubmittingState] = useState(false);
  const [members, setMembers] = useState([{ ...MEMBERS_TEMPLATE }]);

  const addEmail = () => {
    members.push({ ...MEMBERS_TEMPLATE });
    setMembers([...members]);
  };

  const copyToClipboard = () => toast.success('Copied to clipboard!');

  const handleEmailChange = (event, index) => {
    const member = members[index];
    member.email = event.target.value;
    setMembers([...members]);
  };

  const handleRoleChange = (event, index) => {
    const member = members[index];
    member.role = event.target.value;
    setMembers([...members]);
  };

  const invite = () => {
    setSubmittingState(true);
    api(`/api/workspace/${workspace.slug}/invite`, {
      body: { members },
      method: 'POST',
    }).then((response) => {
      setSubmittingState(false);

      if (response.errors) {
        Object.keys(response.errors).forEach((error) =>
          toast.error(response.errors[error].msg)
        );
      } else {
        const members = [{ ...MEMBERS_TEMPLATE }];
        setMembers([...members]);
        toast.success('Invited team members!');
      }
    });
  };

  const remove = (index) => {
    members.splice(index, 1);
    setMembers([...members]);
  };

  const validateEmails = () =>
    members.filter((member) => !isEmail(member.email)).length !== 0;

  return (
    <AccountLayout>
      <Content.Title
        title="Team Management"
        subtitle="Manage your team under your workspace and invite team members"
      />
      <Content.Divider />
      <Content.Container>
        <Card>
          <Card.Body
            title="Invite Link"
            subtitle="Allow other people to join your team through the link below"
          >
            <div className="flex items-center justify-between px-3 py-2 space-x-5 font-mono text-sm border rounded">
              <span className="overflow-x-auto">
                {`${process.env.NEXT_PUBLIC_URL}/teams/invite?code=${encodeURI(
                  workspace.inviteCode
                )}`}
              </span>

              <CopyToClipboard
                onCopy={copyToClipboard}
                text={`${
                  process.env.NEXT_PUBLIC_URL
                }/teams/invite?code=${encodeURI(workspace.inviteCode)}`}
              >
                <DocumentDuplicateIcon className="w-5 h-5 cursor-pointer hover:text-blue-600" />
              </CopyToClipboard>
            </div>
          </Card.Body>
        </Card>
        {isOwnWorkspace && (
          <Card>
            <Card.Body
              title="Add New Members"
              subtitle="Invite Team members using email address"
            >
              <div className="flex flex-col space-y-3">
                <div className="flex flex-row space-x-5">
                  <div className="w-1/2">
                    <label className="text-sm font-bold text-gray-400">
                      Email
                    </label>
                  </div>
                  <div className="w-1/4">
                    <label className="text-sm font-bold text-gray-400">
                      Role
                    </label>
                  </div>
                </div>
                {members.map((member, index) => (
                  <div key={index} className="flex flex-row space-x-5">
                    <input
                      className="w-1/2 px-3 py-2 border rounded"
                      onChange={(event) => handleEmailChange(event, index)}
                      placeholder="name@email.com"
                      type="text"
                      value={member.email}
                    />
                    <div className="relative inline-block w-1/4 border rounded ">
                      <select
                        className="w-full px-3 py-2 capitalize rounded appearance-none"
                        onChange={(event) => handleRoleChange(event, index)}
                      >
                        {Object.keys(TeamRole).map((key, index) => (
                          <option key={index} value={TeamRole[`${key}`]}>
                            {TeamRole[`${key}`].toLowerCase()}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <ChevronDownIcon className="w-5 h-5" />
                      </div>
                    </div>
                    {index !== 0 && (
                      <button
                        className="text-red-600"
                        onClick={() => remove(index)}
                      >
                        <XIcon className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                <div>
                  <Button
                    className="text-sm border hover:border-black disabled:opacity-75"
                    disabled={members.length === 3}
                    onClick={addEmail}
                  >
                    <PlusCircleIcon className="w-5 h-5" />
                    <span>Add more</span>
                  </Button>
                </div>
              </div>
            </Card.Body>
            <Card.Footer>
              <small>
                All invited team members will be set to <strong>Pending</strong>
              </small>
              <Button
                className="text-white bg-blue-600 hover:bg-blue-500"
                disabled={validateEmails() || isSubmitting}
                onClick={invite}
              >
                Invite
              </Button>
            </Card.Footer>
          </Card>
        )}
      </Content.Container>
      <Content.Divider thick />
      <Content.Title
        title="Team Members"
        subtitle="View team members and pending invites"
      />
      <Content.Divider />
      <Content.Container>
        <Card>
          <Card.Body title="Manage Team Members">
            <table className="table-fixed">
              <thead className="text-gray-400 border-b">
                <tr>
                  <th className="py-3 text-left">Member Name</th>
                  <th className="text-right" />
                </tr>
              </thead>
              <tbody className="text-sm">
                {workspace?.members.map((member, index) => (
                  <tr key={index}>
                    <td className="py-5">
                      <div className="flex flex-row items-center justify-start space-x-3">
                        <div className="flex flex-col">
                          <h3>{member.member.name}</h3>
                          <h4 className="text-gray-400">{member.email}</h4>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex flex-row items-center justify-end space-x-3">
                        <h4 className="capitalize">
                          {member.teamRole.toLowerCase()}
                        </h4>
                        <DotsVerticalIcon className="w-5 h-5" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card.Body>
        </Card>
      </Content.Container>
    </AccountLayout>
  );
};

export const getServerSideProps = async (context) => {
  const session = await getSession(context);
  let workspace = null;
  let isOwnWorkspace = false;

  if (session) {
    const slug = context.params.workspaceSlug;
    workspace = await prisma.workspace.findFirst({
      select: {
        inviteCode: true,
        slug: true,
        creator: {
          select: {
            id: true,
          },
        },
        members: {
          select: {
            email: true,
            status: true,
            teamRole: true,
            member: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      where: {
        OR: [
          {
            id: session.user.userId,
          },
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
      isOwnWorkspace = workspace.creator.id === session.user.userId;
    }
  }

  return {
    props: {
      isOwnWorkspace,
      workspace,
    },
  };
};

export default Team;
