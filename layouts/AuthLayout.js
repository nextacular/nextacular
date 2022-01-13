const AuthLayout = ({ children }) => {
  return (
    <main className="relative flex flex-col items-center justify-center h-screen space-y-10">
      {children}
    </main>
  );
};

export default AuthLayout;
