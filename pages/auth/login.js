import Link from 'next/link';
import { useRouter } from 'next/router';
import Meta from '../../components/Meta';
import { AuthLayout } from '../../layouts';

const Login = () => {
  const router = useRouter();

  const navigate = () => router.push('/account');

  return (
    <AuthLayout>
      <Meta
        title="NextJS SaaS Boilerplate | Login"
        description="A boilerplate for your NextJS SaaS projects."
      />
      <div className="flex flex-col items-center justify-center w-1/3 p-10 m-auto space-y-5 border rounded shadow-lg">
        <div>
          <Link href="/">
            <a className="text-4xl font-bold">Nextacular</a>
          </Link>
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold">Sign in with your email</h1>
          <h2 className="text-gray-600">
            We&apos;ll send a magic link to your inbox to confirm your email
            address and sign you in.
          </h2>
        </div>
        <div className="flex flex-col w-full space-y-3">
          <input
            className="px-3 py-2 border rounded"
            placeholder="name@email.com"
            type="text"
          />
          <button
            className="py-2 text-white bg-blue-600 rounded hover:bg-blue-500"
            onClick={navigate}
          >
            Continue
          </button>
        </div>
        <span className="text-sm text-gray-400">or sign in with</span>
        <div className="flex flex-col w-full space-y-3">
          <button className="py-2 bg-gray-100 border rounded hover:bg-gray-50">
            Google
          </button>
          <button className="py-2 bg-gray-100 border rounded hover:bg-gray-50">
            Facebook
          </button>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;
