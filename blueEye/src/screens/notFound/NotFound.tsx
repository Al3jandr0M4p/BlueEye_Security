import ErrorStatusPage from "../../components/errorStatusPage/ErrorStatusPage";

const NotFound: React.FC = () => (
  <ErrorStatusPage
    code="404"
    title="We are sorry..."
    description="The page you are trying to access was not found. Check the URL or return to the homepage."
    actionLabel="Go Home"
    actionType="home"
  />
);

export default NotFound;
