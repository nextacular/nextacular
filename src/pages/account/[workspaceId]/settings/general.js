import { DocumentDuplicateIcon } from '@heroicons/react/outline';

import Button from '../../../../components/Button';
import Card from '../../../../components/Card';
import Content from '../../../../components/Content';
import { AccountLayout } from '../../../../layouts';

const General = () => {
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
            <input className="w-1/2 px-3 py-2 border rounded" type="text" />
          </Card.Body>
          <Card.Footer>
            <small>Please use 32 characters at maximum</small>
            <Button className="text-white bg-blue-600 hover:bg-blue-500">
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
              <span className="overflow-x-auto">
                wksp_qajCxF4KtpBsfLhQsU80rOnx
              </span>
              <DocumentDuplicateIcon className="w-5 h-5 cursor-pointer hover:text-blue-600" />
            </div>
          </Card.Body>
        </Card>
      </Content.Container>
    </AccountLayout>
  );
};

export default General;
