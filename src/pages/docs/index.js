import Content from '../../components/Content';
import { DocumentationLayout } from '../../layouts';

const Overview = () => {
  return (
    <DocumentationLayout>
      <Content.Title
        title="Welcome to Nextacular!"
        subtitle="Start building SaaS platforms within a day"
      />
    </DocumentationLayout>
  );
};

export default Overview;
