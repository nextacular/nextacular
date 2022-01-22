import { DocumentDuplicateIcon } from '@heroicons/react/outline';
import Card from '../../components/Card';

import Content from '../../components/Content';
import { AccountLayout } from '../../layouts';

const Settings = () => {
  return (
    <AccountLayout>
      <Content.Title
        title="Account Settings"
        subtitle="Manage your profile, preferences, and account settings"
      />
      <Content.Divider />
      <Content.Container>
        <Card>
          <Card.Body
            title="Your Name"
            subtitle="Please enter your full name, or a display name you are comfortable with"
          >
            <input className="w-1/2 px-3 py-2 border rounded" type="text" />
          </Card.Body>
          <Card.Footer>
            <p className="text-sm">Please use 32 characters at maximum</p>
            <button className="flex flex-row items-center justify-center px-5 py-2 space-x-3 text-white bg-blue-600 rounded hover:bg-blue-500">
              Save
            </button>
          </Card.Footer>
        </Card>
        <Card>
          <Card.Body
            title="Email Address"
            subtitle="Please enter the email address you want to use to log in with
              Nextacular"
          >
            <input className="w-1/2 px-3 py-2 border rounded" type="email" />
          </Card.Body>
          <Card.Footer>
            <p className="text-sm">We will email you to verify the change</p>
            <button className="flex flex-row items-center justify-center px-5 py-2 space-x-3 text-white bg-blue-600 rounded hover:bg-blue-500">
              Save
            </button>
          </Card.Footer>
        </Card>
        <Card>
          <Card.Body
            title="Personal Account ID"
            subtitle="Used when interacting with APIs"
          >
            <div className="flex items-center justify-between w-1/2 px-3 py-2 space-x-5 font-mono text-sm border rounded">
              <span className="overflow-x-auto">
                id_qajCxF4KtpBsfLhQsU80rOnx
              </span>
              <DocumentDuplicateIcon className="w-5 h-5 cursor-pointer hover:text-blue-600" />
            </div>
          </Card.Body>
        </Card>
        <Card danger>
          <Card.Body
            title="Danger Zone"
            subtitle="Permanently remove your Personal Account and all of its contents
              from Nextacular platform"
          />
          <Card.Footer>
            <p className="text-sm">
              This action is not reversible, so please continue with caution
            </p>
            <button className="flex flex-row items-center justify-center px-5 py-2 space-x-3 text-white bg-red-600 rounded hover:bg-red-500">
              Delete Personal Account
            </button>
          </Card.Footer>
        </Card>
      </Content.Container>
    </AccountLayout>
  );
};

export default Settings;
