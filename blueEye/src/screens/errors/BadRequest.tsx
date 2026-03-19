import ErrorStatusPage from "../../components/errorStatusPage/ErrorStatusPage";

const BadRequest: React.FC = () => (
  <ErrorStatusPage
    code="400"
    title="We are sorry..."
    description="The request could not be processed. Verify the submitted data and try again."
    actionLabel="Go Back"
  />
);

export default BadRequest;
