import Title from '../../components/Title';
import { AccountLayout } from '../../layouts';

const Dashboard = () => {
  return (
    <AccountLayout>
      <Title
        title="Account Settings"
        subtitle="Manage your profile, preferences, and account settings"
      />
      <hr className="border" />
      <div className="flex flex-col space-y-5">
        <div className="flex flex-col border rounded">
          <div className="flex flex-col p-5 space-y-3">
            <h2 className="text-2xl font-bold">Your Name</h2>
            <h3 className="text-gray-400">
              Please enter your full name, or a display name you are comfortable
              with
            </h3>
            <input className="w-1/2 px-3 py-2 border rounded" type="text" />
          </div>
          <div className="flex flex-row items-center justify-between px-5 py-3 bg-gray-100 border-t">
            <p className="text-sm">Please use 32 characters at maximum</p>
            <button className="flex flex-row items-center justify-center px-5 py-2 space-x-3 text-white bg-blue-600 rounded hover:bg-blue-500">
              Save
            </button>
          </div>
        </div>
        <div className="flex flex-col border rounded">
          <div className="flex flex-col p-5 space-y-3">
            <h2 className="text-2xl font-bold">Email Address</h2>
            <h3 className="text-gray-400">
              Please enter the email address you want to use to log in with
              Nextacular
            </h3>
            <input className="w-1/2 px-3 py-2 border rounded" type="email" />
          </div>
          <div className="flex flex-row items-center justify-between px-5 py-3 bg-gray-100 border-t">
            <p className="text-sm">We will email you to verify the change</p>
            <button className="flex flex-row items-center justify-center px-5 py-2 space-x-3 text-white bg-blue-600 rounded hover:bg-blue-500">
              Save
            </button>
          </div>
        </div>
        <div className="flex flex-col border-2 border-red-600 rounded">
          <div className="flex flex-col p-5 space-y-3">
            <h2 className="text-2xl font-bold">Danger Zone</h2>
            <h3 className="text-gray-400">
              Permanently remove your Personal Account and all of its contents
              from Nextacular platform
            </h3>
          </div>
          <div className="flex flex-row items-center justify-between px-5 py-3 bg-gray-100 border-t">
            <p className="text-sm">
              This action is not reversible, so please continue with caution
            </p>
            <button className="flex flex-row items-center justify-center px-5 py-2 space-x-3 text-white bg-red-600 rounded hover:bg-red-500">
              Delete Personal Account
            </button>
          </div>
        </div>
      </div>
    </AccountLayout>
  );
};

export default Dashboard;
