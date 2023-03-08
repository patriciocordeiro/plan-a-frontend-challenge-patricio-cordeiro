import './App.css';

import AppRoutes from './app/shared/routes/AppRoutes';

function App() {
  return (
    <div className='App'>
      <div data-testid={'app-routes'}>
        <AppRoutes />
      </div>
    </div>
  );
}

export default App;
