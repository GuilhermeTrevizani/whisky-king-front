import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import RoutesApp from './routes';

function App() {
  return (
    <div className="app">
      <AuthProvider>
        <BrowserRouter>
          <RoutesApp />
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;