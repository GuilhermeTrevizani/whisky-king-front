import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import RoutesApp from './routes';
import { NotificationContextProvider } from './contexts/NotificationContext';
import { ConfigProvider, theme } from 'antd';

function App() {
  return (
    <div className="app">
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm
        }}
      >
        <NotificationContextProvider>
          <AuthProvider>
            <BrowserRouter>
              <RoutesApp />
            </BrowserRouter>
          </AuthProvider>
        </NotificationContextProvider>
      </ConfigProvider>
    </div>
  );
}

export default App;