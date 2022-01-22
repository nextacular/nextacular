import Head from 'next/head';

const Meta = ({ author, description, keyword, title }) => {
  return (
    <Head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content={description} />
      <meta name="keywords" content={keyword} />
      <meta name="author" content={author} />
      <title>{title}</title>
    </Head>
  );
};

export default Meta;
