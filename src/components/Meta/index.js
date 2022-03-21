import { useEffect, useState } from 'react';
import Head from 'next/head';

const Meta = ({ author, description, keywords, noIndex, title }) => {
  const [url, setUrl] = useState('');

  useEffect(() => {
    setUrl(window.location.origin);
  }, []);

  return (
    <Head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />

      <title>{title}</title>

      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${url}/images/seo-cover.png`} />

      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={`${url}/images/seo-cover.png`} />

      {noIndex && <meta name="robots" content="noindex" />}
    </Head>
  );
};

Meta.defaultProps = {
  author: '',
  description: '',
  keywords: '',
  noIndex: false,
};

export default Meta;
