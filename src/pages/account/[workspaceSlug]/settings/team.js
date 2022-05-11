import { Fragment, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import {
  ChevronDownIcon,
  DocumentDuplicateIcon,
  DotsVerticalIcon,
  PlusCircleIcon,
  XIcon,
} from '@heroicons/react/outline';
import { InvitationStatus, TeamRole } from '@prisma/client';
import { getSession } from 'next-auth/react';
import CopyToClipboard from 'react-copy-to-clipboard';
import toast from 'react-hot-toast';
import isEmail from 'validator/lib/isEmail';

import Button from '@/components/Button/index';
import Card from '@/components/Card/index';
import Content from '@/components/Content/index';
import Meta from '@/components/Meta/index';
import { useMembers } from '@/hooks/data';
import { AccountLayout } from '@/layouts/index';
import api from '@/lib/common/api';
import { getWorkspace, isWorkspaceOwner } from '@/prisma/services/workspace';

const MEMBERS_TEMPLATE = { email: '', role: TeamRole.MEMBER };

const Team = ({ isTeamOwner, workspace }) => {
  const { data, isLoading } = useMembers(workspace.slug);
  const [isSubmitting, setSubmittingState] = useState(false);
  const [members, setMembers] = useState([{ ...MEMBERS_TEMPLATE }]);
  const validateEmails =
    members.filter((member) => !isEmail(member.email)).length !== 0;

  const addEmail = () => {
    members.push({ ...MEMBERS_TEMPLATE });
    setMembers([...members]);
  };

  const changeRole = (memberId) => {
    api(`/api/workspace/team/role`, {
      body: { memberId },
      method: 'PUT',
    }).then((response) => {
      if (response.errors) {
        Object.keys(response.errors).forEach((error) =>
          toast.error(response.errors[error].msg)
        );
      } else {
        toast.success('Updated team member role!');
      }
    });
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

  const removeMember = (memberId) => {
    api(`/api/workspace/team/member`, {
      body: { memberId },
      method: 'DELETE',
    }).then((response) => {
      if (response.errors) {
        Object.keys(response.errors).forEach((error) =>
          toast.error(response.errors[error].msg)
        );
      } else {
        toast.success('Removed team member from workspace!');
      }
    });
  };

  return (
    <AccountLayout>
      <Meta title={`Nextacular - ${workspace.name} | Team Management`} />
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
              <span className="overflow-x-auto">{workspace.inviteLink}</span>
              <CopyToClipboard
                onCopy={copyToClipboard}
                text={workspace.inviteLink}
              >
                <DocumentDuplicateIcon className="w-5 h-5 cursor-pointer hover:text-blue-600" />
              </CopyToClipboard>
            </div>
          </Card.Body>
        </Card>
        {isTeamOwner && (
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
                  <div className="w-1/2 md:w-1/4">
                    <label className="text-sm font-bold text-gray-400">
                      Role
                    </label>
                  </div>
                </div>
                {members.map((member, index) => (
                  <div key={index} className="flex flex-row space-x-5">
                    <input
                      className="w-1/2 px-3 py-2 border rounded"
                      disabled={isSubmitting}
                      onChange={(event) => handleEmailChange(event, index)}
                      placeholder="name@email.com"
                      type="text"
                      value={member.email}
                    />
                    <div className="relative inline-block w-1/2 border rounded md:w-1/4 ">
                      <select
                        className="w-full px-3 py-2 capitalize rounded appearance-none"
                        disabled={isSubmitting}
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
                    disabled={members.length === 3 || isSubmitting}
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
                disabled={validateEmails || isSubmitting}
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
                {!isLoading ? (
                  data?.members.map((member, index) => (
                    <tr key={index}>
                      <td className="py-5">
                        <div className="flex flex-row items-center justify-start space-x-3">
                          <div className="flex flex-col">
                            <h3 className="font-bold">{member.member.name}</h3>
                            <h4 className="text-gray-400">{member.email}</h4>
                          </div>
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="flex flex-row items-center justify-end space-x-3">
                          <span
                            className={[
                              'font-mono text-xs px-2 py-0.5 rounded-full capitalize',
                              member.status === InvitationStatus.ACCEPTED
                                ? 'bg-green-200 text-green-600'
                                : member.status === InvitationStatus.PENDING
                                ? 'bg-blue-200 text-blue-600'
                                : 'bg-red-200 text-red-600',
                            ].join(' ')}
                          >
                            {member.status.toLowerCase()}
                          </span>
                          <h4 className="capitalize">
                            {member.teamRole.toLowerCase()}
                          </h4>
                          {workspace?.creator.email !== member.email &&
                            isTeamOwner && (
                              <Menu
                                as="div"
                                className="relative inline-block text-left"
                              >
                                <div>
                                  <Menu.Button className="flex items-center justify-center p-3 space-x-3 rounded hover:bg-gray-100">
                                    <DotsVerticalIcon className="w-5 h-5" />
                                  </Menu.Button>
                                </div>
                                <Transition
                                  as={Fragment}
                                  enter="transition ease-out duration-100"
                                  enterFrom="transform opacity-0 scale-95"
                                  enterTo="transform opacity-100 scale-100"
                                  leave="transition ease-in duration-75"
                                  leaveFrom="transform opacity-100 scale-100"
                                  leaveTo="transform opacity-0 scale-95"
                                >
                                  <Menu.Items className="absolute right-0 z-20 mt-2 origin-top-right bg-white border divide-y divide-gray-100 rounded w-60">
                                    <div className="p-2">
                                      <Menu.Item>
                                        <button
                                          className="flex items-center w-full px-2 py-2 space-x-2 text-sm text-gray-800 rounded hover:bg-blue-600 hover:text-white"
                                          onClick={() => changeRole(member.id)}
                                        >
                                          <span>
                                            Change role to &quot;
                                            {member.teamRole === TeamRole.MEMBER
                                              ? TeamRole.OWNER
                                              : TeamRole.MEMBER}
                                            &quot;
                                          </span>
                                        </button>
                                      </Menu.Item>
                                      <Menu.Item>
                                        <button
                                          className="flex items-center w-full px-2 py-2 space-x-2 text-sm text-red-600 rounded hover:bg-red-600 hover:text-white"
                                          onClick={() =>
                                            removeMember(member.id)
                                          }
                                        >
                                          <span>Remove Team Member</span>
                                        </button>
                                      </Menu.Item>
                                    </div>
                                  </Menu.Items>
                                </Transition>
                              </Menu>
                            )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2}>
                      <div className="w-full h-8 bg-gray-400 rounded animate-pulse" />
                    </td>
                  </tr>
                )}
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
  let isTeamOwner = false;
  let workspace = null;

  if (session) {
    workspace = await getWorkspace(
      session.user.userId,
      session.user.email,
      context.params.workspaceSlug
    );

    if (workspace) {
      isTeamOwner = isWorkspaceOwner(session.user.email, workspace);
      workspace.inviteLink = `${
        process.env.APP_URL
      }/teams/invite?code=${encodeURI(workspace.inviteCode)}`;
    }
  }

  return {
    props: {
      isTeamOwner,
      workspace,
    },
  };
};

export default Team;
