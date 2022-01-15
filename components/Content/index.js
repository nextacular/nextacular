const Content = ({ children }) => {
  return (
    <div className="flex flex-col w-3/4 h-full p-10 space-y-5 overflow-y-auto">
      {children}
    </div>
  );
};

export default Content;
