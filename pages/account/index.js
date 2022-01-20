import Content from '../../components/Content';
import { AccountLayout } from '../../layouts';

const Welcome = () => {
  return (
    <AccountLayout>
      <Content.Title
        title="Welcome to Nextacular!"
        subtitle="Start building SaaS platforms within a day"
      />
    </AccountLayout>
  );
};

export default Welcome;
