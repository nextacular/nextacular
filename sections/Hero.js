import Link from 'next/link';

const Hero = () => {
  return (
    <div className="w-full py-5">
      <div className="relative flex flex-col w-3/4 mx-auto space-y-5">
        <header className="flex flex-row items-center justify-between space-x-3">
          <div>
            <a className="text-2xl font-bold" href="#!">
              Nextacular
            </a>
          </div>
          <nav className="flex flex-row space-x-3">
            <a className="px-5 py-2 rounded hover:bg-gray-100" href="#!">
              Guides
            </a>
            <a className="px-5 py-2 rounded hover:bg-gray-100" href="#!">
              Pricing
            </a>
            <a className="px-5 py-2 rounded hover:bg-gray-100" href="#!">
              Blog
            </a>
          </nav>
          <div className="flex flex-row space-x-3">
            <Link href="/auth/login">
              <a className="px-5 py-2 text-white bg-blue-600 rounded shadow hover:bg-blue-500">
                Login
              </a>
            </Link>
          </div>
        </header>
        <div className="flex flex-col items-center justify-center w-3/5 pt-10 pb-5 mx-auto">
          <h1 className="text-6xl font-bold text-center">
            <span className="block">Build SaaS platforms</span>
            <span className="block text-blue-600">like never before</span>
          </h1>
          <p className="mt-5 text-center text-gray-600">
            Quickly build landing pages that will help you get results fast
          </p>
        </div>
        <div className="flex flex-row items-center justify-center space-x-5">
          <a
            className="px-10 py-3 text-white bg-blue-600 rounded shadow hover:bg-blue-500"
            href="#!"
          >
            Get Started
          </a>
          <a
            className="px-10 py-3 text-blue-600 rounded shadow hover:bg-blue-50"
            href="#!"
          >
            Live Demo
          </a>
        </div>
      </div>
    </div>
  );
};

export default Hero;
