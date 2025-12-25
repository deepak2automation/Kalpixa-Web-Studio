import React, { useState, useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import Layout from './components/Layout';
import SeoAnalyzer from './components/SeoAnalyzer';
import SeoHead from './components/SeoHead';

// Page Imports
import Home from './pages/Home';
import ServicesPage from './pages/Services';
import ContactPage from './pages/Contact';
import ThankYouPage from './pages/ThankYou';

const App: React.FC = () => {
  // Safe path initialization handling both production and sandboxed/blob environments
  const getInitialPath = () => {
    if (typeof window === 'undefined') return '/';
    try {
      const path = window.location.pathname;
      // Handle standard paths, index.html, or empty paths
      if (!path || path === '' || path.endsWith('index.html') || path.startsWith('blob:')) return '/';
      return path;
    } catch {
      return '/';
    }
  };

  const [currentPath, setCurrentPath] = useState<string>(getInitialPath());

  useEffect(() => {
    const onPopState = () => {
      // Fallback to '/' if location access fails or returns unexpected values
      const p = window.location.pathname;
      setCurrentPath((!p || p.endsWith('index.html')) ? '/' : p);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = (path: string) => {
    try {
      // Try to update URL, but fail gracefully in sandboxed environments (like blobs/iframes)
      window.history.pushState({}, '', path);
    } catch (e) {
      console.warn("Navigation history update skipped (environment restriction):", e);
    }
    setCurrentPath(path);
    window.scrollTo(0, 0);
  };

  const renderContent = () => {
    switch (currentPath) {
      case '/':
        return <Home navigate={navigate} />;
      case '/services':
        return <ServicesPage />;
      case '/seo-tools':
        return (
          <>
            <SeoHead
              title="Free SEO Analyzer Tool"
              description="Analyze your website SEO score instantly. Identify technical issues, speed problems, and meta tag errors."
              path="/seo-tools"
            />
            <SeoAnalyzer />
          </>
        );
      case '/contact':
        return <ContactPage navigate={navigate} />;
      case '/thank-you':
        return <ThankYouPage navigate={navigate} />;
      default:
        return <Home navigate={navigate} />;
    }
  };

  return (
    <HelmetProvider>
      <Layout activePath={currentPath} onNavigate={navigate}>
        {renderContent()}
      </Layout>
    </HelmetProvider>
  );
};

export default App;
