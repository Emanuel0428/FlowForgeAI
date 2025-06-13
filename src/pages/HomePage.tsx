import React from 'react';
import AppContainer from '../containers/AppContainer';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <AppContainer />
    </div>
  );
};

export default HomePage;