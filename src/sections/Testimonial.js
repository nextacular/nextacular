const Testimonial = () => {
  return (
    <div className="w-full py-10 bg-gray-200">
      <div className="relative flex flex-col w-3/4 mx-auto space-y-5">
        <div className="flex flex-col items-center justify-center w-3/5 pt-10 pb-5 mx-auto">
          <h3 className="text-2xl leading-10 text-center">
            &quot;Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
            do eiusmod tempor incididunt ut labore et dolore magna aliqua.&quot;
          </h3>
          <div className="flex flex-row items-center justify-center py-5 space-x-5">
            <h4 className="font-bold">Adam Warlock</h4>
            <span className="text-2xl font-bold text-blue-600">/</span>
            <h4>CEO at ABC Inc.</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
