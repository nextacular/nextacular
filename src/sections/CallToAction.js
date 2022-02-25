const CallToAction = () => {
  return (
    <div className="flex items-center justify-center w-full h-screen bg-blue-600">
      <div className="relative flex flex-col px-5 mx-auto space-y-5 md:w-3/4">
        <div className="flex flex-col space-y-3 text-white">
          <h2 className="text-4xl font-extrabold text-center md:text-6xl">
            <span className="block">Build SaaS platforms like a PRO</span>
          </h2>
          <h2 className="text-2xl font-bold text-center md:text-4xl">
            <span className="block">Start your free trial today</span>
          </h2>
        </div>
        <div className="flex items-center justify-center">
          <a className="px-10 py-3 text-xl text-center text-blue-600 bg-white rounded shadow hover:bg-blue-50">
            Subscribe Now
          </a>
        </div>
      </div>
    </div>
  );
};

export default CallToAction;
