import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import RoutesConfig from './routes';
import useAuthState from './hooks/useAuthState';
import AuthPage from './pages/auth';
import { BottomNav } from 'common/src/components/layout/bottom-nav';

const App = () => {
  const { session, loading } = useAuthState();

  if (loading) return null;

  if (!session) return <AuthPage />;

  return (
    <div
      className="min-h-screen"
      style={{
        background: 'linear-gradient(135deg, #FEFAF5 15%, #FFFAFF 50%, #FAFBFF 85%)',
      }}
    >
      <main>
        <RoutesConfig />
      </main>
      <BottomNav />
    </div>
  );
};

export default App;
