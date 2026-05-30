'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import Button from '@/components/Button/index';
import Card from '@/components/Card/index';
import apiFetch from '@/lib/common/api';

type Invitation = {
  id: string;
  name: string;
  workspaceCode: string;
  slug: string;
};

type InviteClientProps = {
  workspace: Invitation | null;
};

type JoinResponse = {
  status: number;
  errors?: Record<string, { msg: string }>;
};

const InviteClient = ({ workspace }: InviteClientProps) => {
  const { data } = useSession();
  const router = useRouter();
  const [isSubmitting, setSubmittingState] = useState(false);

  if (!workspace) {
    return (
      <main className="relative flex flex-col items-center justify-center h-screen space-y-10">
        <Toaster position="bottom-center" toastOptions={{ duration: 10000 }} />
        <h1 className="text-2xl font-bold">Invitation not found</h1>
      </main>
    );
  }

  const join = () => {
    setSubmittingState(true);
    apiFetch<JoinResponse>('/api/workspace/team/join', {
      body: { workspaceCode: workspace.workspaceCode },
      method: 'POST',
    }).then((response) => {
      setSubmittingState(false);

      if (response.errors) {
        if (response.status === 422) {
          router.replace('/account');
        }

        Object.keys(response.errors).forEach((error) =>
          toast.error(response.errors?.[error]?.msg ?? 'Unknown error')
        );
      } else {
        toast.success('Accepted invitation!');
      }
    });
  };

  return (
    <main className="relative flex flex-col items-center justify-center h-screen space-y-10">
      <Toaster position="bottom-center" toastOptions={{ duration: 10000 }} />
      <div className="w-full py-5">
        <div className="relative flex flex-col mx-auto space-y-5">
          <div className="flex flex-col items-center justify-center mx-auto">
            <Card>
              <Card.Body
                title={workspace.name}
                subtitle="You are invited to join this workspace."
              />
              <Card.Footer>
                {data ? (
                  <Button
                    className="text-white bg-blue-600 hover:bg-blue-500"
                    disabled={isSubmitting}
                    onClick={join}
                  >
                    Join Workspace
                  </Button>
                ) : (
                  <Link
                    href="/auth/login"
                    className="flex items-center justify-center px-5 py-2 space-x-3 text-white bg-blue-600 rounded hover:bg-blue-500"
                  >
                    Create an account
                  </Link>
                )}
              </Card.Footer>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
};

export default InviteClient;
