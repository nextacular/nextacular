import { useState } from 'react';

import Button from '../../components/Button';
import Card from '../../components/Card';
import Content from '../../components/Content';
import { AccountLayout } from '../../layouts';
import { getProducts } from '../../../payments/stripe';
import Modal from '../../components/Modal';

const Billing = ({ products }) => {
  const [showModal, setModalVisibility] = useState(false);

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
        </Modal>
      </Content.Container>
      <Content.Divider thick />
      <Content.Title
        title="Invoices"
        subtitle="View and download invoices you may need"
      />
      <Content.Divider />
      <Content.Empty>
        Once you&apos;ve paid for something on Nextacular, invoices will show up
        here
      </Content.Empty>
    </AccountLayout>
  );
};

export const getServerSideProps = async () => {
  const products = await getProducts();

  return {
    props: {
      products,
    },
  };
};

export default Billing;
