'use client';

import Link from 'next/link';
import { getProviders, signIn, useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useEffect, useState, type ChangeEvent, type MouseEvent } from 'react';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import isEmail from 'validator/lib/isEmail';

type SocialProvider = {
  id: string;
  name: string;
};

const LoginClient = () => {
  const { status } = useSession();
  const [email, setEmail] = useState('');
  const t = useTranslations();
  const [isSubmitting, setSubmittingState] = useState(false);
  const [socialProviders, setSocialProviders] = useState<SocialProvider[]>([]);
  const validate = isEmail(email);

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) =>
    setEmail(event.target.value);

  const signInWithEmail = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setSubmittingState(true);
    const response = await signIn('email', { email, redirect: false });

    if (response?.error === null) {
      toast.success(`Please check your email (${email}) for the login link.`, {
        duration: 5000,
      });
      setEmail('');
    }

    setSubmittingState(false);
  };

  const signInWithSocial = (socialId: string) => {
    signIn(socialId);
  };

  useEffect(() => {
    (async () => {
      const next: SocialProvider[] = [];
      const providers = await getProviders();

      if (!providers) {
        return;
      }

      for (const key in providers) {
        if (key === 'email') continue;
        const provider = providers[key];
        if (provider) {
          next.push({ id: provider.id, name: provider.name });
        }
      }

      setSocialProviders(next);
    })();
  }, []);

  return (
    <main className="relative flex flex-col items-center justify-center h-screen p-10 space-y-10">
      <Toaster position="bottom-center" toastOptions={{ duration: 10000 }} />
      <div className="flex flex-col items-center justify-center p-5 m-auto space-y-5 rounded shadow-lg md:p-10 md:w-1/3">
        <div>
          <Link href="/" className="text-4xl font-bold">
            Nextacular
          </Link>
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold">{t('login.label')}</h1>
          <h2 className="text-gray-600">{t('login.message.magiclink')}</h2>
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
              ? t('login.message.checking.session')
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
    </main>
  );
};

export default LoginClient;
