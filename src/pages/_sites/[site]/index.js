import { ExternalLinkIcon } from '@heroicons/react/outline';
import DefaultErrorPage from 'next/error';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

import prisma from '@/prisma/index';

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
  const [workspaces, domains] = await Promise.all([
    prisma.workspace.findMany({
      select: { slug: true },
      where: { deletedAt: null },
    }),
    prisma.domain.findMany({
      select: { name: true },
      where: { deletedAt: null },
    }),
  ]);

  const paths = [
    ...workspaces.map((workspace) => ({
      params: { site: workspace.slug },
    })),
    ...domains.map((domain) => ({
      params: { site: domain.name },
    })),
  ];

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps = async ({ params }) => {
  const { site } = params;
  const customDomain = site.includes('.') ? true : false;
  const workspace = await prisma.workspace.findFirst({
    select: {
      id: true,
      name: true,
      slug: true,
      domains: { select: { name: true } },
    },
    where: {
      OR: [
        { slug: site },
        customDomain
          ? {
              domains: {
                some: {
                  name: site,
                  deletedAt: null,
                },
              },
            }
          : undefined,
      ],
      AND: { deletedAt: null },
    },
  });
  return {
    props: { workspace },
    revalidate: 10,
  };
};

export default Site;
