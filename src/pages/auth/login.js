import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getProviders, signIn, useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import isEmail from 'validator/lib/isEmail';

import Meta from '@/components/Meta/index';
import { AuthLayout } from '@/layouts/index';
import { useTranslation } from "react-i18next";

const Login = () => {
  const { status } = useSession();
  const [email, setEmail] = useState('');
  const { t } = useTranslation();
  const [isSubmitting, setSubmittingState] = useState(false);
  const [socialProviders, setSocialProviders] = useState([]);
  const validate = isEmail(email);

  const handleEmailChange = (event) => setEmail(event.target.value);

  const signInWithEmail = async (event) => {
    event.preventDefault();
    setSubmittingState(true);
    const response = await signIn('email', { email, redirect: false });

    if (response.error === null) {
      toast.success(`Please check your email (${email}) for the login link.`, {
        duration: 5000,
      });
      setEmail('');
    }

    setSubmittingState(false);
  };

  const signInWithSocial = (socialId) => {
    signIn(socialId);
  };

  useEffect(() => {
    (async () => {
      const socialProviders = [];
      const { email, ...providers } = await getProviders();

      for (const provider in providers) {
        socialProviders.push(providers[provider]);
      }

      setSocialProviders([...socialProviders]);
    })();
  }, []);

  return (
    <AuthLayout>
      <Meta
        title="NextJS SaaS Boilerplate | Login"
        description="A boilerplate for your NextJS SaaS projects."
      />
      <div className="flex flex-col items-center justify-center p-5 m-auto space-y-5 rounded shadow-lg md:p-10 md:w-1/3">
        <div>
          <Link href="/" className="text-4xl font-bold">
            Nextacular
          </Link>
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold">{t('login.label')}</h1>
          <h2 className="text-gray-600">
            {t('login.message.magiclink')}
          </h2>
        </div>
        <form className="flex flex-col w-full space-y-3">
          <input
            className="px-3 py-2 border rounded"
            onChange={handleEmailChange}
            placeholder="user@email.com"
            type="email"
            value={email}
          />
          <button
            className="py-2 text-white bg-blue-600 rounded hover:bg-blue-500 disabled:opacity-75"
            disabled={status === 'loading' || !validate || isSubmitting}
            onClick={signInWithEmail}
          >
            {status === 'loading'
              ? t("login.message.checking.session")
              : isSubmitting
                ? t('login.message.sendinglink')
                : t('login.message.magiclink')}
          </button>
        </form>
        {socialProviders.length > 0 && (
          <>
            <span className="text-sm text-gray-400">or sign in with</span>
            <div className="flex flex-col w-full space-y-3">
              {socialProviders.map((provider, index) => (
                <button
                  key={index}
                  className="py-2 bg-gray-100 border rounded hover:bg-gray-50 disabled:opacity-75"
                  disabled={status === 'loading'}
                  onClick={() => signInWithSocial(provider.id)}
                >
                  {provider.name}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </AuthLayout>
  );
};

export default Login;
