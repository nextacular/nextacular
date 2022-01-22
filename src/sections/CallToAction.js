const CallToAction = () => {
  return (
    <div className="w-full py-10 text-white bg-blue-600">
      <div className="relative flex flex-col w-3/4 mx-auto space-y-5">
        <div className="flex flex-col">
          <h2 className="text-4xl font-extrabold text-center">
            <span className="block">Build SaaS platforms like a PRO</span>
          </h2>
          <h2 className="text-4xl font-extrabold text-center">
            <span className="block">Start your free trial today</span>
          </h2>
        </div>
        <div className="flex flex-row items-center justify-center space-x-5">
          <a
            className="px-10 py-3 text-blue-600 bg-white rounded shadow hover:bg-blue-50"
            href="#!"
          >
            Subscribe Now
          </a>
        </div>
      </div>
    </div>
  );
};

export default CallToAction;
