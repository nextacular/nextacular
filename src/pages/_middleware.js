import { NextResponse } from 'next/server';

const middleware = (req) => {
  const url = req.nextUrl.clone();
  const { pathname } = req.nextUrl;
  const hostname = req.headers.get('host');
  const currentHost = hostname.replace(
    `.${process.env.NEXT_PUBLIC_ROOT_URL}`,
    ''
  );

  if (pathname.startsWith(`/_sites`)) {
    return new Response(null, { status: 404 });
  }

  if (!pathname.includes('.') && !pathname.startsWith('/api')) {
    if (hostname === process.env.NEXT_PUBLIC_ROOT_URL) {
      url.pathname = `${pathname}`;
    } else {
      url.pathname = `/_sites/${currentHost}${pathname}`;
    }

    return NextResponse.rewrite(url);
  }
};

export default middleware;
