import { useState } from 'react';
import { ExternalLinkIcon } from '@heroicons/react/outline';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/solid';
import Link from 'next/link';

import Button from '../Button';
import Card from './index';

const DomainCard = ({ apex, cname, isLoading, name, refresh, remove }) => {
  const [display, setDisplay] = useState('cname');
  const isValid = true;

  const showApex = () => setDisplay('apex');

  const showCName = () => setDisplay('cname');

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
              {!isValid ? (
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
                      {display === 'cname' ? 'CNAME' : 'A'}
                    </td>
                    <td className="p-3">{display === 'cname' ? 'www' : '@'}</td>
                    <td className="p-3">
                      {display === 'cname' ? cname : apex}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card.Body>
          <Card.Footer>
            <span />
            <div className="flex flex-row space-x-3">
              <Button
                className="text-gray-400 border border-gray-400 hover:border-gray-600 hover:text-gray-600"
                onClick={refresh}
              >
                Refresh
              </Button>
              <Button
                className="text-white bg-red-600 hover:bg-red-500"
                onClick={remove}
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
};

export default DomainCard;
