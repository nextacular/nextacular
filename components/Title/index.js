const Title = ({ subtitle, title }) => {
  return (
    <div>
      <h1 className="text-4xl font-bold">{title}</h1>
      <h3 className="text-gray-400">{subtitle}</h3>
    </div>
  );
};

export default Title;
