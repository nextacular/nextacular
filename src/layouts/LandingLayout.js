import { useEffect } from 'react';
import { useTheme } from 'next-themes';

const LandingLayout = ({ children }) => {
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme('light');
  }, []);

  return (
    <main className="relative flex flex-col space-y-10 text-gray-800">
      {children}
    </main>
  );
};

export default LandingLayout;
