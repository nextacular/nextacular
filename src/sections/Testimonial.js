const Testimonial = () => {
  return (
    <div className="w-full py-10 bg-gray-200">
      <div className="relative flex flex-col px-5 mx-auto space-y-5 md:w-3/4">
        <div className="flex flex-col items-center justify-center mx-auto space-y-5 md:w-3/5">
          <h3 className="text-2xl leading-10 text-center text-gray-600">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </h3>
          <div className="flex flex-row items-center justify-center space-x-5">
            <h4 className="font-bold">Adam Warlock</h4>
            <span className="text-2xl font-extrabold text-blue-600">/</span>
            <h4>CEO at ABC Inc.</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
