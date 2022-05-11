import { useState } from 'react';
import { ExternalLinkIcon } from '@heroicons/react/outline';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/solid';
import Link from 'next/link';

import Button from '@/components/Button/index';
import Card from '@/components/Card/index';
import { useDomain } from '@/hooks/data';

const DomainCard = ({ apex, cname, domain, isLoading, refresh, remove }) => {
  const { name, subdomain, value, verified } = domain || {};
  const { data, isLoading: isChecking } = useDomain(name);
  const [display, setDisplay] = useState(verified ? 'cname' : 'txt');

  const handleRefresh = (name, isVerified) => {
    const verified = refresh(name, isVerified);

    if (verified) {
      setDisplay('cname');
    }
  };

  const onRemove = () => {
    const result = confirm(
      `Are you sure you want to delete this domain: ${name}?`
    );

    if (result) {
      remove(name);
    }
  };

  const showApex = () => setDisplay('apex');

  const showCName = () => setDisplay('cname');

  const showTxt = () => setDisplay('txt');

  return (
    <Card>
      {isLoading ? (
        <Card.Body />
      ) : (
        <>
          <Card.Body title={name}>
            <div className="flex items-center mb-5 space-x-3">
              <Link href={`https://${name}`}>
                <a
                  className="flex items-center space-x-2 text-blue-600 hover:underline"
                  target="_blank"
                >
                  <span>Visit {name}</span>
                  <ExternalLinkIcon className="w-5 h-5" />
                </a>
              </Link>
              {!data?.valid || !verified ? (
                <h3 className="flex items-center space-x-1 text-red-600">
                  <XCircleIcon className="w-5 h-5" />
                  <span>Invalid Configuration</span>
                </h3>
              ) : (
                <h3 className="flex items-center space-x-1">
                  <CheckCircleIcon className="w-5 h-5 text-blue-600" />
                  <span>Valid Configuration</span>
                </h3>
              )}
            </div>
            <div className="flex flex-col space-y-5">
              <div className="flex space-x-3">
                {!verified ? (
                  <button
                    className={[
                      'py-2',
                      display === 'txt'
                        ? 'border-b-2 border-b-gray-800'
                        : 'text-gray-400',
                    ].join(' ')}
                    onClick={showTxt}
                  >
                    TXT Record (verification)
                  </button>
                ) : (
                  <>
                    <button
                      className={[
                        'py-2',
                        display === 'cname'
                          ? 'border-b-2 border-b-gray-800'
                          : 'text-gray-400',
                      ].join(' ')}
                      onClick={showCName}
                    >
                      CNAME Record (subdomains)
                    </button>
                    <button
                      className={[
                        'py-2',
                        display === 'apex'
                          ? 'border-b-2 border-b-gray-800'
                          : 'text-gray-400',
                      ].join(' ')}
                      onClick={showApex}
                    >
                      A Record (apex domain)
                    </button>
                  </>
                )}
              </div>
              <p>Set the following record on your DNS provider to continue:</p>
              <table className="bg-gray-100 table-fixed">
                <thead className="text-left">
                  <tr>
                    <th className="p-3">Type</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="font-mono text-sm">
                    <td className="p-3">
                      {display === 'cname'
                        ? 'CNAME'
                        : display === 'txt'
                        ? 'TXT'
                        : 'A'}
                    </td>
                    <td className="p-3">
                      {display === 'cname'
                        ? 'www'
                        : display === 'txt'
                        ? subdomain
                        : '@'}
                    </td>
                    <td className="p-3">
                      {display === 'cname'
                        ? cname
                        : display === 'txt'
                        ? value
                        : apex}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card.Body>
          <Card.Footer>
            {!verified ? (
              <span className="text-red-600">
                <strong>Error</strong>: Domain {name} was added to a different
                project. Please complete verification to add it to this project
                instead.
              </span>
            ) : (
              <span />
            )}
            <div className="flex flex-row space-x-3">
              {(!data?.valid || !verified) && (
                <Button
                  className="text-gray-600 border border-gray-600 hover:border-gray-600 hover:text-gray-600"
                  disabled={isChecking}
                  onClick={() => handleRefresh(name, verified)}
                >
                  {isChecking
                    ? 'Checking...'
                    : !verified
                    ? 'Verify'
                    : 'Refresh'}
                </Button>
              )}
              <Button
                className="text-white bg-red-600 hover:bg-red-500"
                onClick={onRemove}
              >
                Remove
              </Button>
            </div>
          </Card.Footer>
        </>
      )}
    </Card>
  );
};

DomainCard.defaultProps = {
  apex: '',
  cname: '',
  isLoading: true,
  name: '',
  refresh: () => {},
  remove: () => {},
  slug: '',
};

export default DomainCard;
