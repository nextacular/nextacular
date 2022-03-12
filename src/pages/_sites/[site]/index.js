import { ExternalLinkIcon } from '@heroicons/react/outline';
import DefaultErrorPage from 'next/error';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

import {
  getSiteWorkspace,
  getWorkspacePaths,
} from '@/prisma/services/workspace';

const Site = ({ workspace }) => {
  const router = useRouter();

  if (router.isFallback) {
    return <h1>Loading...</h1>;
  }

  return workspace ? (
    <main className="relative flex flex-col items-center justify-center h-screen space-y-10 text-gray-800 bg-gray-50">
      <div className="flex flex-col items-center justify-center p-10 space-y-5 text-center ">
        <h1 className="text-4xl font-bold">
          Welcome to your workspace's subdomain!
        </h1>
        <h2 className="text-2xl">
          This is the workspace of <strong>{workspace.name}.</strong>
        </h2>
        <p>You can also visit these links:</p>
        <Link
          href={`https://${workspace.slug}.${process.env.NEXT_PUBLIC_ROOT_URL}`}
        >
          <a
            className="flex space-x-3 text-blue-600 hover:underline"
            target="_blank"
          >
            <span>{`${workspace.slug}.${process.env.NEXT_PUBLIC_ROOT_URL}`}</span>
            <ExternalLinkIcon className="w-5 h-5" />
          </a>
        </Link>
        {workspace.domains.map((domain, index) => (
          <Link key={index} href={`https://${domain.name}`}>
            <a
              className="flex space-x-3 text-blue-600 hover:underline"
              target="_blank"
            >
              <span>{domain.name}</span>
              <ExternalLinkIcon className="w-5 h-5" />
            </a>
          </Link>
        ))}
      </div>
    </main>
  ) : (
    <>
      <Head>
        <meta name="robots" content="noindex" />
      </Head>
      <DefaultErrorPage statusCode={404} />
    </>
  );
};

export const getStaticPaths = async () => {
  const paths = await getWorkspacePaths();
  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps = async ({ params }) => {
  const { site } = params;
  const workspace = await getSiteWorkspace(site, site.includes('.'));
  return {
    props: { workspace },
    revalidate: 10,
  };
};

export default Site;
