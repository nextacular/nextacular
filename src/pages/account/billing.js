import { useState } from 'react';
import formatDistance from 'date-fns/formatDistance';
import Link from 'next/link';
import { getSession } from 'next-auth/react';
import toast from 'react-hot-toast';

import Button from '@/components/Button/index';
import Card from '@/components/Card/index';
import Content from '@/components/Content/index';
import Modal from '@/components/Modal/index';
import { AccountLayout } from '@/layouts/index';
import api from '@/lib/common/api';
import { redirectToCheckout } from '@/lib/client/stripe';
import { getInvoices, getProducts } from '@/lib/server/stripe';
import prisma from '@/prisma/index';

const Billing = ({ invoices, products }) => {
  const [isSubmitting, setSubmittingState] = useState(false);
  const [showModal, setModalVisibility] = useState(false);

  const subscribe = (priceId) => {
    setSubmittingState(true);
    api(`/api/payments/subscription/${priceId}`, {
      method: 'POST',
    }).then((response) => {
      setSubmittingState(false);

      if (response.errors) {
        Object.keys(response.errors).forEach((error) =>
          toast.error(response.errors[error].msg)
        );
      } else {
        (async () => redirectToCheckout(response.data.sessionId))();
      }
    });
  };

  const toggleModal = () => setModalVisibility(!showModal);

  return (
    <AccountLayout>
      <Content.Title
        title="Billing"
        subtitle="Manage your billing and preferences"
      />
      <Content.Divider />
      <Content.Container>
        <Card>
          <Card.Body
            title="Upgrade Plan"
            subtitle="You are currently under the&nbsp; FREE plan"
          >
            <p className="p-3 text-sm border rounded">
              Personal accounts cannot be upgraded and will remain free forever.
              In order to use the platform for professional purposes or work
              with a team, get started by creating a team or contacting sales.
            </p>
          </Card.Body>
          <Card.Footer>
            <small>You will be redirected to the payment page</small>
            <Button
              className="text-white bg-blue-600 hover:bg-blue-500"
              disabled={isSubmitting}
              onClick={toggleModal}
            >
              Upgrade
            </Button>
          </Card.Footer>
        </Card>
        <Modal
          show={showModal}
          title="Upgrade Subscription"
          toggle={toggleModal}
        >
          <div className="space-y-0 text-sm text-gray-600">
            <p>You are currently under the FREE plan</p>
          </div>
          <div className="flex space-x-5">
            {products.map((product, index) => (
              <Card key={index}>
                <Card.Body title={product.name} subtitle={product.description}>
                  <h3 className="text-4xl font-bold">
                    ${Number(product.prices.unit_amount / 100).toFixed(2)}
                  </h3>
                </Card.Body>
                <Card.Footer>
                  <Button
                    className="w-full text-white bg-blue-600 hover:bg-blue-500"
                    disabled={isSubmitting}
                    onClick={() => subscribe(product.prices.id)}
                  >
                    {isSubmitting
                      ? 'Redirecting...'
                      : `Upgrade to ${product.name}`}
                  </Button>
                </Card.Footer>
              </Card>
            ))}
          </div>
        </Modal>
      </Content.Container>
      <Content.Divider thick />
      <Content.Title
        title="Invoices"
        subtitle="View and download invoices you may need"
      />
      <Content.Divider />
      {invoices.length > 0 ? (
        <Content.Container>
          <table className="table-auto">
            <thead>
              <tr className="text-left">
                <th>Invoice Number</th>
                <th>Created</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice, index) => (
                <tr key={index} className="text-sm hover:bg-gray-100">
                  <td className="px-3 py-5">
                    <Link href={invoice.hosted_invoice_url}>
                      <a className="text-blue-600" target="_blank">
                        {invoice.number}
                      </a>
                    </Link>
                  </td>
                  <td className="py-5">
                    {formatDistance(
                      new Date(invoice.created * 1000),
                      new Date(),
                      {
                        addSuffix: true,
                      }
                    )}
                  </td>
                  <td className="py-5">{invoice.status}</td>
                  <td className="py-5">
                    <Link href={invoice.hosted_invoice_url}>
                      <a className="text-blue-600" target="_blank">
                        &rarr;
                      </a>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Content.Container>
      ) : (
        <Content.Empty>
          Once you&apos;ve paid for something on Nextacular, invoices will show
          up here
        </Content.Empty>
      )}
    </AccountLayout>
  );
};

export const getServerSideProps = async (context) => {
  const session = await getSession(context);
  const customerPayment = await prisma.customerPayment.findUnique({
    where: { email: session.user?.email },
  });
  const [invoices, products] = await Promise.all([
    getInvoices(customerPayment?.paymentId),
    getProducts(),
  ]);
  return {
    props: {
      invoices,
      products,
    },
  };
};

export default Billing;
