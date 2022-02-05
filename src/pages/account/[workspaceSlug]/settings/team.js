import { useState } from 'react';
import {
  ChevronDownIcon,
  DocumentDuplicateIcon,
  DotsVerticalIcon,
  PlusCircleIcon,
} from '@heroicons/react/outline';

import Button from '../../../../components/Button';
import Card from '../../../../components/Card';
import Content from '../../../../components/Content';
import { AccountLayout } from '../../../../layouts';

const Team = () => {
  const [emails, setEmails] = useState(['']);

  const addEmail = () => {
    emails.push('');
    setEmails([...emails]);
  };

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
            <div className="flex items-center justify-between w-1/2 px-3 py-2 space-x-5 font-mono text-sm border rounded">
              <span className="overflow-x-auto">
                https://nextacular.co/teams/invite/BmezYknZT4BepSDBzmdoZMLFS6UqUbsT
              </span>
              <DocumentDuplicateIcon className="w-5 h-5 cursor-pointer hover:text-blue-600" />
            </div>
          </Card.Body>
        </Card>
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
              {emails.map((email, index) => (
                <div key={index} className="flex flex-row space-x-5">
                  <input
                    className="w-1/2 px-3 py-2 border rounded"
                    placeholder="name@email.com"
                    type="text"
                    value={email}
                  />
                  <div className="relative inline-block w-1/4 border rounded ">
                    <select className="w-full px-3 py-2 appearance-none">
                      <option>Member</option>
                      <option>Owner</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <ChevronDownIcon className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              ))}
              <div>
                <Button
                  className="text-sm border hover:border-black"
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
            <Button className="text-white bg-blue-600 hover:bg-blue-500">
              Invite
            </Button>
          </Card.Footer>
        </Card>
      </Content.Container>
      <Content.Divider thick />
      <Content.Title
        title="Team Members"
        subtitle="View team members and pending invites"
      />
      <Content.Divider />
      <Content.Container>
        <Card>
          <Card.Body>
            <table className="table-fixed">
              <thead className="text-gray-400 border-b">
                <tr>
                  <th className="py-3 text-left">Member Name</th>
                  <th className="text-right" />
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr>
                  <td className="py-5">
                    <div className="flex flex-row items-center justify-start space-x-3">
                      <div className="w-10 h-10 bg-gray-400 rounded-full" />
                      <div className="flex flex-col">
                        <h3>Administrator User</h3>
                        <h4 className="text-gray-400">
                          administrator@mail.com
                        </h4>
                      </div>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="flex flex-row items-center justify-end space-x-3">
                      <h4>Owner</h4>
                      <DotsVerticalIcon className="w-5 h-5" />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="py-5">
                    <div className="flex flex-row items-center justify-start space-x-3">
                      <div className="w-10 h-10 bg-gray-400 rounded-full" />
                      <div className="flex flex-col">
                        <h3>Administrator User</h3>
                        <h4 className="text-gray-400">
                          administrator@mail.com
                        </h4>
                      </div>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="flex flex-row items-center justify-end space-x-3">
                      <h4>Owner</h4>
                      <DotsVerticalIcon className="w-5 h-5" />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </Card.Body>
        </Card>
      </Content.Container>
    </AccountLayout>
  );
};

export default Team;
