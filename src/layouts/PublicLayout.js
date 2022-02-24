import { Toaster } from 'react-hot-toast';

const PublicLayout = ({ children }) => {
  return (
    <main className="relative flex flex-col items-center justify-center h-screen space-y-10 text-gray-800 bg-gray-50">
      <Toaster position="bottom-center" toastOptions={{ duration: 10000 }} />
      {children}
    </main>
  );
};

export default PublicLayout;
