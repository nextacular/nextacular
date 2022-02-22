import DefaultErrorPage from 'next/error';
import Head from 'next/head';
import { useRouter } from 'next/router';

import prisma from '../../../../prisma';

const Site = ({ workspace }) => {
  const router = useRouter();

  if (router.isFallback) {
    return <h1>Loading...</h1>;
  }

  return workspace ? (
    <div className="flex flex-col items-center justify-center p-10 space-y-5 text-center">
      <h1 className="text-4xl font-bold">
        Welcome to your workspace's subdomain!
      </h1>
      <h2 className="text-2xl">
        This is the workspace of <strong>{workspace.name}.</strong>
      </h2>
    </div>
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
  const workspaces = await prisma.workspace.findMany({
    select: {
      slug: true,
    },
    where: {
      deletedAt: null,
    },
  });
  const domains = await prisma.domain.findMany({
    select: {
      name: true,
    },
    where: {
      deletedAt: null,
    },
  });

  const paths = [
    ...workspaces.map((workspace) => ({
      params: {
        site: workspace.slug,
      },
    })),
    ...domains.map((domain) => ({
      params: {
        site: domain.name,
      },
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
    },
    where: {
      OR: [
        {
          slug: site,
        },
        customDomain
          ? {
              domains: {
                some: {
                  name: customDomain,
                  deletedAt: null,
                },
              },
            }
          : undefined,
      ],
      AND: [
        {
          deletedAt: null,
        },
      ],
    },
  });

  return {
    props: {
      workspace,
    },
    revalidate: 10,
  };
};

export default Site;
