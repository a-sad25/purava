import React, { useState, Component } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, Lightbulb, Users, FileCheck, Rocket, LayoutDashboard, BrainCircuit, Activity, Scaling, FileText, Settings, ShieldCheck, Sparkles } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Challenges from './pages/Challenges';
import CreateChallenge from './pages/CreateChallenge';
import Discovery from './pages/Discovery';
import StartupProfile from './pages/StartupProfile';
import PilotDesigner from './pages/PilotDesigner';
import PilotMonitoring from './pages/PilotMonitoring';
import Validation from './pages/Validation';
import ScaleDecision from './pages/ScaleDecision';
import Landing from './pages/Landing';
import SettingsPage from './pages/Settings';

import AIAssistant from './components/AIAssistant';


class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: any}> {
  constructor(props: any) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error: any) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-red-600 bg-red-50 min-h-screen">
          <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
          <pre className="text-sm bg-white p-4 border border-red-200 rounded overflow-auto">{String(this.state.error)}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [aiOpen, setAiOpen] = useState(false);
  const isLanding = location.pathname === '/';

  if (isLanding) return <>{children}</>;

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Challenges', path: '/challenges', icon: Lightbulb },
    { name: 'Startup Discovery', path: '/discovery', icon: Users },
    { name: 'Pilots', path: '/pilots', icon: Rocket },
    { name: 'Validation', path: '/validation', icon: ShieldCheck },
    { name: 'Scale Assessment', path: '/scale', icon: Activity },
  ];

  return (
    <div className="flex h-screen bg-slate-100/70 font-sans">
      <aside className="w-64 bg-[#0f172a] border-r border-slate-800 flex flex-col z-20">
        <div className="p-6">
          <h1 className="text-xl font-semibold text-white mb-1 border-b-2 border-slate-700 inline-block pb-1 tracking-wide">
            PURAVA
          </h1>
        </div>
        <nav className="flex-1 mt-4 space-y-1 px-3">
          {menuItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`flex items-center gap-3 px-4 py-2.5 rounded-md text-[14px] font-medium transition-colors border-l-4 ${
                location.pathname.startsWith(item.path) 
                  ? 'bg-slate-800/80 text-white border-blue-500 shadow-sm' 
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border-transparent'
              }`}
            >
              <item.icon size={18} />
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800">
           <Link to="/settings" className="flex items-center gap-3 px-4 py-2.5 text-[14px] font-medium text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 rounded-md border-l-4 border-transparent">
             <Settings size={18} /> Settings / Prototype
           </Link>
        </div>
      </aside>
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <div className="w-full h-[3px] bg-[#E8891D]"></div>
        <div className="bg-slate-950 text-slate-300 text-xs px-6 py-1.5 flex justify-between items-center tracking-wide uppercase font-medium shrink-0">
          <div>Smart India Hackathon 2026 &bull; Prototype &bull; Simulated data</div>
          <div>PS SIH26136 &bull; Maharashtra State Innovation Society</div>
        </div>
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 shrink-0 z-10">
           <div className="font-semibold text-slate-800 tracking-wide">
             Maharashtra Innovation Procurement Workflow
           </div>
           <div className="flex items-center gap-4">
             <button onClick={() => setAiOpen(true)} className="flex items-center gap-2 text-sm font-medium bg-white border border-slate-300 text-slate-700 px-3 py-1.5 rounded-md hover:bg-slate-50">
               <Sparkles size={14} className="text-blue-500" /> AI Assistance
             </button>
             <div className="text-slate-500 text-sm font-medium">Demo Officer</div>
             <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm border border-slate-200">O</div>
           </div>
        </header>
        <div className="flex-1 overflow-auto p-8 relative">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
        <AIAssistant isOpen={aiOpen} setIsOpen={setAiOpen} />
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppLayout>
        <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/challenges/new" element={<CreateChallenge />} />
          <Route path="/discovery" element={<Discovery />} />
          <Route path="/startup/:id" element={<StartupProfile />} />
          <Route path="/pilots" element={<PilotDesigner />} />
          <Route path="/pilots/:id" element={<PilotMonitoring />} />
          <Route path="/validation" element={<Validation />} />
          <Route path="/scale" element={<ScaleDecision />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
        </ErrorBoundary>
      </AppLayout>
    </Router>
  );
}

export default App;
