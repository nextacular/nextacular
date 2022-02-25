const Guides = () => {
  return (
    <div className="w-full py-10">
      <div className="relative flex flex-col px-5 mx-auto space-y-5 md:w-3/4">
        <div className="flex flex-col items-center">
          <h6 className="font-bold text-center text-blue-600 uppercase">
            Guides
          </h6>
          <h2 className="text-4xl font-bold text-center">
            <span className="block">Supercharge your website</span>
          </h2>
          <p className="text-center text-gray-600">
            Lorem ipsum dolor sit amet
          </p>
        </div>
        <div className="grid grid-cols-1 gap-10 py-10 md:grid-cols-3">
          <div className="p-5 space-y-5 transition rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-2">
            <div className="w-full h-40 bg-gray-400 rounded-lg animate-pulse" />
            <div>
              <h3 className="text-lg font-bold text-gray-400">
                Getting Started
              </h3>
              <h2 className="text-2xl font-bold">
                Using Notion to build your site
              </h2>
            </div>
          </div>
          <div className="p-5 space-y-5 transition rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-2">
            <div className="w-full h-40 bg-gray-400 rounded-lg animate-pulse" />
            <div>
              <h3 className="text-lg font-bold text-gray-400">SEO</h3>
              <h2 className="text-2xl font-bold">
                Improve SEO and discoverability of your site
              </h2>
            </div>
          </div>
          <div className="p-5 space-y-5 transition rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-2">
            <div className="w-full h-40 bg-gray-400 rounded-lg animate-pulse" />
            <div>
              <h3 className="text-lg font-bold text-gray-400">Themes</h3>
              <h2 className="text-2xl font-bold">Customize your site</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Guides;
