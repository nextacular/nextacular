import { useEffect } from 'react';
import { useTheme } from 'next-themes';

const LandingLayout = ({ children }) => {
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme('light');
  }, [setTheme]);

  return (
    <main className="relative flex flex-col text-gray-800">{children}</main>
  );
};

export default LandingLayout;
