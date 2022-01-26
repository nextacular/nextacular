import { useState } from 'react';
import { ExternalLinkIcon } from '@heroicons/react/outline';
import { XCircleIcon } from '@heroicons/react/solid';

import Button from '../../../../components/Button';
import Card from '../../../../components/Card';
import Content from '../../../../components/Content';
import { AccountLayout } from '../../../../layouts';

const Domains = () => {
  const [domain, setDomain] = useState('');
  const [domainVerification, setDomainVerification] = useState(null);

  const addDomain = () => setDomainVerification(domain);

  const handleDomainChange = (event) => setDomain(event.target.value);

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
            subtitle="You can customize your subdomain here"
          >
            <div className="flex items-center w-1/2 font-mono text-sm border rounded">
              <input className="w-full px-3 py-2 text-right bg-transparent" />
              <span className="pr-3">.domain.com</span>
            </div>
          </Card.Body>
          <Card.Footer>
            <small>Please use 16 characters at maximum</small>
            <Button className="text-white bg-blue-600 hover:bg-blue-500">
              Save
            </Button>
          </Card.Footer>
        </Card>
      </Content.Container>
      <Content.Divider thick />
      <Content.Title
        title="Domain Configuration"
        subtitle="Manage your subdomain and domain names"
      />
      <Content.Divider />
      <Content.Container>
        <Card>
          <Card.Body
            title="Add Your Domain"
            subtitle="This domain is assigned to your current workspace"
          >
            <input
              className="w-1/2 px-3 py-2 border rounded"
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
              onClick={addDomain}
            >
              Add
            </Button>
          </Card.Footer>
        </Card>
        {domainVerification ? (
          <Card>
            <Card.Body>
              <h2 className="flex items-center space-x-2 text-2xl font-bold">
                <span>{domainVerification}</span>
                <span>
                  <ExternalLinkIcon className="w-6 h-6" />
                </span>
              </h2>
              <h3 className="flex items-center space-x-3 text-red-600">
                <XCircleIcon className="w-5 h-5" />
                <span>Invalid Configuration</span>
              </h3>
              <div className="flex flex-col w-1/2 space-y-5">
                <div className="flex space-x-3">
                  <button className="py-2 border-b-2 border-b-gray-800">
                    CNAME Record (subdomains)
                  </button>
                  <button className="py-2 text-gray-400">
                    A Record (apex domain)
                  </button>
                </div>
                <p>
                  Set the following record on your DNS provider to continue:
                </p>
                <table className="bg-gray-100 table-fixed">
                  <thead className="text-left">
                    <tr>
                      <th className="p-3">Type</th>
                      <th className="p-3">Name</th>
                      <th className="p-3">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="font-mono">
                      <td className="p-3">CNAME</td>
                      <td className="p-3">www</td>
                      <td className="p-3">cname.domain.com</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card.Body>
            <Card.Footer>
              <span />
              <div className="flex flex-row space-x-3">
                <Button className="text-gray-400 border border-gray-400 hover:border-gray-600 hover:text-gray-600">
                  Refresh
                </Button>
                <Button className="text-white bg-red-600 hover:bg-red-500">
                  Remove
                </Button>
              </div>
            </Card.Footer>
          </Card>
        ) : (
          <Content.Empty>
            Once you&apos;ve added your domain on Nextacular, that domain will
            show up here
          </Content.Empty>
        )}
      </Content.Container>
    </AccountLayout>
  );
};

export default Domains;
