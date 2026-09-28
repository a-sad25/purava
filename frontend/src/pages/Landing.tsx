import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket, ArrowRight, FileCheck, Search, Database, Scale } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#090e17] text-white flex flex-col font-sans">
      <header className="p-6 flex justify-between items-center border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-orange-500"><Rocket size={28}/></span>
          <h1 className="text-2xl font-black tracking-wider">PURAVA</h1>
        </div>
        <div className="flex gap-4">
          <button className="px-4 py-2 text-sm text-blue-200 hover:text-white">Startup Portal</button>
          <button onClick={() => navigate('/dashboard')} className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold transition">Officer Login</button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-8 max-w-5xl mx-auto text-center">
        <div className="mb-6 inline-block bg-slate-800/90 border border-slate-700 text-slate-300 text-xs px-3.5 py-1 rounded-full shadow-none font-semibold tracking-wide">
          Government of Maharashtra Innovation Sandbox
        </div>
        
        <h1 className="text-6xl font-extrabold mb-6 leading-tight text-white">
          From Pilot to Proof <br/><span className="text-slate-300">to Procurement.</span>
        </h1>
        
        <p className="text-xl text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto mb-12">
          PURAVA creates a structured pathway for government departments to discover, test, validate and scale startup innovation through evidence-based pilot procurement.
        </p>

        <button onClick={() => navigate('/dashboard')} className="group flex items-center justify-center gap-3 px-8 py-4 bg-orange-600 text-white rounded-lg font-bold text-lg border border-orange-500/40 shadow-sm shadow-orange-950/50 hover:bg-orange-500 hover:border-orange-400 active:scale-[0.99] transition-all duration-150">
          ▶ RUN FULL PILOT JOURNEY <ArrowRight className="group-hover:translate-x-1 transition-transform" />
        </button>

        <div className="mt-20 w-full">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-8">The Innovation Procurement Lifecycle</h3>
          <div className="flex items-center justify-between gap-4 text-slate-300">
             <div className="flex flex-col items-center gap-3 p-4 bg-slate-900/70 border border-slate-800 rounded-xl text-slate-300 hover:border-slate-700/80 hover:bg-slate-900/90 transition-colors w-full">
               <FileCheck size={24} className="text-blue-400" />
               <span className="text-xs font-bold uppercase text-center leading-tight">1. Challenge</span>
             </div>
             <div className="h-0.5 w-4 bg-slate-700 shrink-0"></div>
             <div className="flex flex-col items-center gap-3 p-4 bg-slate-900/70 border border-slate-800 rounded-xl text-slate-300 hover:border-slate-700/80 hover:bg-slate-900/90 transition-colors w-full">
               <Search size={24} className="text-emerald-400" />
               <span className="text-xs font-bold uppercase text-center leading-tight">2. Discovery</span>
             </div>
             <div className="h-0.5 w-4 bg-slate-700 shrink-0"></div>
             <div className="flex flex-col items-center gap-3 p-4 bg-slate-900/70 border border-slate-800 rounded-xl text-slate-300 hover:border-slate-700/80 hover:bg-slate-900/90 transition-colors w-full">
               <FileCheck size={24} className="text-teal-400" />
               <span className="text-xs font-bold uppercase text-center leading-tight">3. Evaluation</span>
             </div>
             <div className="h-0.5 w-4 bg-slate-700 shrink-0"></div>
             <div className="flex flex-col items-center gap-3 p-4 bg-slate-900/70 border border-slate-800 rounded-xl text-slate-300 hover:border-slate-700/80 hover:bg-slate-900/90 transition-colors w-full">
               <Rocket size={24} className="text-orange-400" />
               <span className="text-xs font-bold uppercase text-center leading-tight">4. Pilot</span>
             </div>
             <div className="h-0.5 w-4 bg-slate-700 shrink-0"></div>
             <div className="flex flex-col items-center gap-3 p-4 bg-slate-900/70 border border-slate-800 rounded-xl text-slate-300 hover:border-slate-700/80 hover:bg-slate-900/90 transition-colors w-full">
               <Database size={24} className="text-purple-400" />
               <span className="text-xs font-bold uppercase text-center leading-tight">5. Validation</span>
             </div>
             <div className="h-0.5 w-4 bg-slate-700 shrink-0"></div>
             <div className="flex flex-col items-center gap-3 p-4 bg-slate-900/70 border border-slate-800 rounded-xl text-slate-300 hover:border-slate-700/80 hover:bg-slate-900/90 transition-colors w-full">
               <Scale size={24} className="text-indigo-400" />
               <span className="text-xs font-bold uppercase text-center leading-tight">6. Scale</span>
             </div>
          </div>
        </div>
      </main>
      
      <footer className="p-6 text-center text-slate-500 text-sm border-t border-slate-800">
        PURAVA is a Smart India Hackathon prototype demonstrating a structured innovation-procurement workflow. Data shown in the demonstration environment is simulated.
      </footer>
    </div>
  );
};

export default Landing;
