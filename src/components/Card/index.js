const Card = ({ children, danger }) => {
  return danger ? (
    <div className="flex flex-col justify-between border-2 border-red-600 rounded">
      {children}
    </div>
  ) : (
    <div className="flex flex-col justify-between border rounded dark:border-gray-600">
      {children}
    </div>
  );
};

Card.Body = ({ children, subtitle, title }) => {
  return (
    <div className="flex flex-col p-5 space-y-3 overflow-auto">
      {title ? (
        <h2 className="text-2xl font-bold">{title}</h2>
      ) : (
        <div className="w-full h-8 bg-gray-400 rounded animate-pulse" />
      )}
      {subtitle && <h3 className="text-gray-400">{subtitle}</h3>}
      <div className="flex flex-col">{children}</div>
    </div>
  );
};

Card.Empty = ({ children }) => {
  return (
    <div>
      <div className="flex items-center justify-center p-5 bg-gray-100 border-4 border-dashed rounded dark:bg-transparent dark:border-gray-600">
        <p>{children}</p>
      </div>
    </div>
  );
};

Card.Footer = ({ children }) => {
  return (
    <div className="flex flex-row items-center justify-between px-5 py-3 space-x-5 bg-gray-100 border-t rounded-b dark:border-t-gray-600 dark:bg-gray-900">
      {children}
    </div>
  );
};

Card.Body.displayName = 'Body';
Card.Empty.displayName = 'Empty';
Card.Footer.displayName = 'Footer';

export default Card;
