const Features = () => {
  return (
    <div className="w-full py-10">
      <div className="relative flex flex-col w-3/4 mx-auto space-y-5">
        <div className="flex flex-col items-center">
          <h6 className="font-bold text-center text-blue-600 uppercase">
            Features
          </h6>
          <h2 className="text-4xl font-bold text-center">
            <span className="block">A better way to build your SaaS</span>
          </h2>
          <p className="text-center text-gray-600">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit
          </p>
        </div>
        <div className="flex flex-col py-10 space-x-0 space-y-10 md:space-y-0 md:space-x-5 md:flex-row">
          <div className="flex flex-col items-center justify-start px-5 space-y-3 md:w-1/3">
            <div className="flex items-center justify-center w-16 h-16 bg-gray-600 rounded-full" />
            <h3 className="text-lg font-bold">Excellent Services</h3>
            <p className="text-center text-gray-400">
              Some quick example text to build on the card title and make up the
              bulk of the card&apos;s content.
            </p>
          </div>
          <div className="flex flex-col items-center justify-start px-5 space-y-3 md:w-1/3">
            <div className="flex items-center justify-center w-16 h-16 bg-gray-600 rounded-full" />
            <h3 className="text-lg font-bold">Grow Your Market</h3>
            <p className="text-center text-gray-400">
              Some quick example text to build on the card title and make up the
              bulk of the card&apos;s content.
            </p>
          </div>
          <div className="flex flex-col items-center justify-start px-5 space-y-3 md:w-1/3">
            <div className="flex items-center justify-center w-16 h-16 bg-gray-600 rounded-full" />
            <h3 className="text-lg font-bold">Launch Time</h3>
            <p className="text-center text-gray-400">
              Some quick example text to build on the card title and make up the
              bulk of the card&apos;s content.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
