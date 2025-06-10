import { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import './css/globals.css';
import App from './App.tsx';
import Spinner from './views/spinner/Spinner.tsx';
import { store } from './Store/Store.tsx';
import { Provider } from 'react-redux';

createRoot(document.getElementById('root')!).render(
  <Suspense fallback={<Spinner />}>
    <Provider store={store}>
      <App />
    </Provider>
  </Suspense>,
);
