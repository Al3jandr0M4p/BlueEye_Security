import ErrorStatusPage from "../../components/errorStatusPage/ErrorStatusPage";

const Forbidden: React.FC = () => (
  <ErrorStatusPage
    code="403"
    title="We are sorry..."
    description="The page you are trying to access has restricted access. Please contact your administrator."
    actionLabel="Go Back"
  />
);

export default Forbidden;
