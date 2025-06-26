import ErrorBoundary from './components/ErrorBoundary';
import AppContainer from './containers/AppContainer';
import { LanguageProvider } from './config/language';
import './index.css';

function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <AppContainer />
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;