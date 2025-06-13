import React from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import AppContainer from './containers/AppContainer';
import './index.css';

function App() {
  return (
    <ErrorBoundary>
      <AppContainer />
    </ErrorBoundary>
  );
}

export default App;