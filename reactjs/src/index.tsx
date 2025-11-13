import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { legacy_createStore as createStore } from 'redux';
import { composeWithDevTools } from '@redux-devtools/extension';
import App from './App';
import motocartReducer from './storeReducers/motocartReducer';
import './css/main.css';

const motoshopStore = createStore(motocartReducer, composeWithDevTools());

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = createRoot(rootElement);
  
  root.render(
    <StrictMode>
      <Provider store={motoshopStore}>
        <App />
      </Provider>
    </StrictMode>
  );
}