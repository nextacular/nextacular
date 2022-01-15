const Footer = () => {
  return (
    <div className="w-full py-5">
      <div className="relative flex flex-col w-3/4 mx-auto space-y-5">
        <footer className="flex flex-row items-center justify-center space-x-3">
          <a className="px-5 py-2 rounded hover:underline" href="#!">
            About
          </a>
          <a className="px-5 py-2 rounded hover:underline" href="#!">
            Showcase
          </a>
          <a className="px-5 py-2 rounded hover:underline" href="#!">
            Themes
          </a>
          <a className="px-5 py-2 rounded hover:underline" href="#!">
            Community
          </a>
          <a className="px-5 py-2 rounded hover:underline" href="#!">
            Privacy
          </a>
          <a className="px-5 py-2 rounded hover:underline" href="#!">
            Terms
          </a>
        </footer>
        <hr />
        <p className="text-center text-gray-400">
          &copy; Nextacular. All rights reserved {new Date().getFullYear()}.
        </p>
      </div>
    </div>
  );
};

export default Footer;
