import Head from 'next/head';

const Meta = ({ description, title }) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
    </Head>
  );
};

export default Meta;
