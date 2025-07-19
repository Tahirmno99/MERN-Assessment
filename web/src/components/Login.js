import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/LoginForm';

const Login = () => {
  const { token } = useAuth();
  if (token) return <Navigate to="/feed" />;

  return (
    <div className="container">
        <LoginForm />
    </div>
  );
};

export default Login;
