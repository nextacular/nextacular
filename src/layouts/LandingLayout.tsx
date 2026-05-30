import { useTheme } from 'next-themes';
import { useEffect, type ReactNode } from 'react';

type LandingLayoutProps = {
  children: ReactNode;
};

const LandingLayout = ({ children }: LandingLayoutProps) => {
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme('light');
  }, [setTheme]);

  return (
    <main className="relative flex flex-col text-gray-800">{children}</main>
  );
};

export default LandingLayout;
