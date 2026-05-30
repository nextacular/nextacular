export const dynamic = 'force-dynamic';

const HealthPage = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-8">
      <div className="rounded border bg-white p-6 text-center text-gray-800 shadow">
        <h1 className="text-xl font-bold">Nextacular</h1>
        <p className="mt-2 text-sm text-gray-600">
          App Router is alive. {new Date().toISOString()}
        </p>
      </div>
    </main>
  );
};

export default HealthPage;
