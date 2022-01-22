const Content = ({ children }) => {
  return (
    <div className="flex flex-col w-3/4 h-full p-10 space-y-5 overflow-y-auto">
      {children}
    </div>
  );
};

Content.Container = ({ children }) => {
  return <div className="flex flex-col space-y-5">{children}</div>;
};

Content.Divider = ({ thick }) => {
  return thick ? <hr className="border-2" /> : <hr className="border" />;
};

Content.Empty = ({ children }) => {
  return (
    <div>
      <div className="flex items-center justify-center p-5 bg-gray-100 border-4 border-dashed rounded">
        <p>{children}</p>
      </div>
    </div>
  );
};

Content.Title = ({ subtitle, title }) => {
  return (
    <div>
      <h1 className="text-4xl font-bold">{title}</h1>
      <h3 className="text-gray-400">{subtitle}</h3>
    </div>
  );
};

Content.Container.displayName = 'Container';
Content.Divider.displayName = 'Divider';
Content.Empty.displayName = 'Empty';
Content.Title.displayName = 'Title';

export default Content;
