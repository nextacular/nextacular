import Title from '../../components/Title';
import { AccountLayout } from '../../layouts';

const Dashboard = () => {
  return (
    <AccountLayout>
      <Title title="Billing" subtitle="Manage your billing and preferences" />
      <hr className="border" />
      <div className="flex flex-col space-y-5">
        <div className="flex flex-col border rounded">
          <div className="flex flex-col p-5 space-y-3">
            <h2 className="text-2xl font-bold">Upgrade Plan</h2>
            <h3 className="text-gray-400">
              You are currently under the&nbsp;
              <span className="px-3 py-1 mx-1 font-mono text-xs font-bold text-blue-600 border rounded-full">
                FREE
              </span>
              &nbsp;plan
            </h3>
            <p className="p-3 text-sm border rounded">
              Personal accounts cannot be upgraded and will remain free forever.
              In order to use the platform for professional purposes or work
              with a team, get started by creating a team or contacting sales.
            </p>
          </div>
          <div className="flex flex-row items-center justify-between px-5 py-3 bg-gray-100 border-t">
            <p className="text-sm">
              You will be redirected to the payment page
            </p>
            <button className="flex flex-row items-center justify-center px-5 py-2 space-x-3 text-white bg-blue-600 rounded hover:bg-blue-500">
              Upgrade
            </button>
          </div>
        </div>
      </div>
      <hr className="border-2" />
      <div>
        <h1 className="text-4xl font-bold">Invoices</h1>
        <h3 className="text-gray-400">
          View and download invoices you may need
        </h3>
      </div>
      <hr className="border" />
      <div>
        <div className="flex items-center justify-center p-5 bg-gray-100 border-4 border-dashed rounded">
          <p>
            Once you&apos;ve paid for something on Nextacular, invoices will
            show up here
          </p>
        </div>
      </div>
    </AccountLayout>
  );
};

export default Dashboard;
