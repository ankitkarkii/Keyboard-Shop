import { BrowserRouter, useLocation } from 'react-router-dom';
import RouterComponent from './RouterComponent';
import Navbar from './Components/Navbar/Navbar';
import { AuthProvider } from './Context/AuthContext';

const App = () => {
  const location = useLocation();

  return (
    <div>
      {location.pathname !== "/" && <Navbar />}
      <RouterComponent />
    </div>
  );
};

const AppWrapper = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppWrapper;
