
import React from 'react';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { useApp } from './context/AppContext';
import { useRouter } from './hooks/useRouter';
import HomePage from './pages/HomePage';
import PricingPage from './pages/PricingPage';
import DashboardPage from './pages/DashboardPage';
import DocsPage from './pages/DocsPage';

// ─── Nav Link ───
const NavLink: React.FC<{
  label: string;
  route: string;
  isActive: boolean;
  navigate: (r: string) => void;
}> = ({ label, route, isActive, navigate }) => (
  <button
    onClick={() => navigate(route)}
    className={`text-sm font-medium transition-colors px-4 py-2 rounded-lg ${
      isActive
        ? 'text-ink-900 bg-ink-100/50'
        : 'text-ink-500 hover:text-ink-900'
    }`}
  >
    {label}
  </button>
);

// ─── Main App Shell ───
const App: React.FC = () => {
  const { route, navigate, isActive } = useRouter();
  const { state } = useApp();

  // Route → Page component
  const renderPage = () => {
    switch (route) {
      case '/pricing':
        return <PricingPage />;
      case '/dashboard':
        return <DashboardPage />;
      case '/docs':
        return <DocsPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen ambient-bg selection:bg-sage-100 selection:text-sage-900">

      {/* ─── Navigation ─── */}
      <nav className="w-full px-6 md:px-10 py-6 flex justify-between items-center max-w-7xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-3 cursor-pointer"
        >
          <div className="w-9 h-9 bg-ink-900 rounded-xl flex items-center justify-center">
            <Sparkles size={16} className="text-white" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-ink-900">MarketerAI</span>
        </button>

        <div className="flex items-center gap-1">
          <NavLink label="Home" route="/" isActive={isActive('/')} navigate={navigate} />
          <NavLink label="Pricing" route="/pricing" isActive={isActive('/pricing')} navigate={navigate} />
          <NavLink label="Dashboard" route="/dashboard" isActive={isActive('/dashboard')} navigate={navigate} />
          <NavLink label="Docs" route="/docs" isActive={isActive('/docs')} navigate={navigate} />

          {state.history.length > 0 && (
            <span className="ml-1 w-5 h-5 rounded-full bg-sage-500 text-white text-[10px] font-bold flex items-center justify-center">
              {state.history.length}
            </span>
          )}

          <button
            onClick={() => navigate('/')}
            className="pill bg-ink-900 text-white font-medium text-sm hover:bg-ink-800 transition-colors cursor-pointer ml-3"
          >
            Book a Demo
            <ArrowUpRight size={14} />
          </button>
        </div>
      </nav>

      {/* ─── Page Content ─── */}
      <main className="w-full flex flex-col items-center">
        {renderPage()}
      </main>

      {/* ─── Footer ─── */}
      <footer className="w-full py-10 px-6 md:px-10">
        <div className="divider mb-10" />
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <div className="w-7 h-7 bg-ink-900 rounded-lg flex items-center justify-center">
              <Sparkles size={12} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-ink-900">MarketerAI</span>
          </button>
          <p className="text-ink-300 text-xs tracking-wide">
            &copy; 2026 MarketerAI. All rights reserved. Powered by Gemini.
          </p>
          <div className="flex gap-6">
            {[
              { label: 'Pricing', route: '/pricing' },
              { label: 'Dashboard', route: '/dashboard' },
              { label: 'Docs', route: '/docs' },
              { label: 'GitHub', route: '#' },
            ].map(link => (
              <a
                key={link.label}
                href={link.route.startsWith('#') ? link.route : undefined}
                onClick={link.route.startsWith('/') ? (e) => { e.preventDefault(); navigate(link.route); } : undefined}
                className="text-xs font-medium text-ink-400 hover:text-ink-900 transition-colors cursor-pointer"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
