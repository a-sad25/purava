import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getStartups, getChallenges } from '../api';
import { ShieldCheck, FileCheck, BrainCircuit, Activity, ArrowLeft, ArrowRight } from 'lucide-react';
import LifecycleIndicator from '../components/LifecycleIndicator';

const StartupProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [startup, setStartup] = useState<any>(null);
  
  // Dummy evaluation state for demo
  const [evalScore, setEvalScore] = useState({ p: 20, t: 18, i: 15, s: 18, r: 15 });
  const [error, setError] = useState(false);

  useEffect(() => {
    getStartups().then(data => {
      setStartup((data || []).find((s: any) => s.id === Number(id)));
    }).catch(err => {
      console.error(err);
      setError(true);
    });
  }, [id]);

  if (error) return <div className="p-8 text-red-600">Failed to load profile.</div>;
  if (!startup) return <div className="p-8">Loading profile...</div>;

  const totalScore = evalScore.p + evalScore.t + evalScore.i + evalScore.s + evalScore.r;

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <LifecycleIndicator currentStep="EVALUATION" />
      <button onClick={() => navigate('/discovery')} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 font-medium">
        <ArrowLeft size={18}/> Back to Discovery
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
        <div className="p-8 border-b border-slate-100 flex justify-between items-start">
           <div>
             <div className="flex items-center gap-3 mb-2">
               <h1 className="text-3xl font-black text-slate-900">{startup.name}</h1>
               {startup.pilot_ready && <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1"><ShieldCheck size={14}/> PILOT READY</span>}
             </div>
             <p className="text-lg text-blue-600 font-medium">{startup.technology} &bull; {startup.sector}</p>
           </div>
           <div className="text-right">
             <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Stage</div>
             <div className="text-xl font-bold text-slate-800">{startup.stage}</div>
           </div>
        </div>
        <div className="p-8 bg-slate-50">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Solution Overview</h3>
          <p className="text-slate-700 text-lg leading-relaxed">{startup.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Eligibility Checklist */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
           <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-6 border-b pb-4"><FileCheck className="text-blue-600"/> Deterministic Eligibility</h2>
           
           <div className="space-y-4">
             <div className="flex justify-between items-center p-3 bg-green-50 rounded border border-green-100 text-green-900">
               <span className="font-medium">Startup Registration Status</span>
               <span className="font-bold">PASS</span>
             </div>
             <div className="flex justify-between items-center p-3 bg-green-50 rounded border border-green-100 text-green-900">
               <span className="font-medium">Mandatory Documentation</span>
               <span className="font-bold">PASS</span>
             </div>
             <div className="flex justify-between items-center p-3 bg-green-50 rounded border border-green-100 text-green-900">
               <span className="font-medium">Financial Turnover Rules</span>
               <span className="font-bold">PASS</span>
             </div>
             <div className="flex justify-between items-center p-3 bg-amber-50 rounded border border-amber-100 text-amber-900">
               <span className="font-medium">Data Privacy Attestation</span>
               <span className="font-bold">REVIEW REQUIRED</span>
             </div>
           </div>
           
           <div className="mt-8 pt-4 border-t text-center">
             <div className="inline-block bg-blue-100 text-blue-800 font-black px-6 py-2 rounded-full tracking-wide">
               ELIGIBLE FOR EXPERT EVALUATION
             </div>
           </div>
        </div>

        {/* Expert Evaluation */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
           <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-6 border-b pb-4"><BrainCircuit className="text-orange-500"/> Expert Evaluation</h2>
           
           <div className="space-y-4">
             <div className="flex justify-between items-center">
               <span className="text-sm font-medium text-slate-700">Problem Relevance (25%)</span>
               <input type="range" min="0" max="25" value={evalScore.p} onChange={e=>setEvalScore({...evalScore, p: Number(e.target.value)})} className="w-1/2"/>
               <span className="font-bold w-8 text-right">{evalScore.p}</span>
             </div>
             <div className="flex justify-between items-center">
               <span className="text-sm font-medium text-slate-700">Tech Feasibility (20%)</span>
               <input type="range" min="0" max="20" value={evalScore.t} onChange={e=>setEvalScore({...evalScore, t: Number(e.target.value)})} className="w-1/2"/>
               <span className="font-bold w-8 text-right">{evalScore.t}</span>
             </div>
             <div className="flex justify-between items-center">
               <span className="text-sm font-medium text-slate-700">Innovation (20%)</span>
               <input type="range" min="0" max="20" value={evalScore.i} onChange={e=>setEvalScore({...evalScore, i: Number(e.target.value)})} className="w-1/2"/>
               <span className="font-bold w-8 text-right">{evalScore.i}</span>
             </div>
             <div className="flex justify-between items-center">
               <span className="text-sm font-medium text-slate-700">Scalability (20%)</span>
               <input type="range" min="0" max="20" value={evalScore.s} onChange={e=>setEvalScore({...evalScore, s: Number(e.target.value)})} className="w-1/2"/>
               <span className="font-bold w-8 text-right">{evalScore.s}</span>
             </div>
             <div className="flex justify-between items-center">
               <span className="text-sm font-medium text-slate-700">Pilot Readiness (15%)</span>
               <input type="range" min="0" max="15" value={evalScore.r} onChange={e=>setEvalScore({...evalScore, r: Number(e.target.value)})} className="w-1/2"/>
               <span className="font-bold w-8 text-right">{evalScore.r}</span>
             </div>
           </div>

           <div className="mt-8 pt-4 border-t flex justify-between items-center bg-slate-50 -mx-6 -mb-6 p-6">
             <div>
               <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Total Weighted Score</div>
               <div className="text-4xl font-black text-slate-900">{totalScore} / 100</div>
             </div>
             <button onClick={() => navigate('/pilots')} className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow flex items-center gap-2 transition">
               Select for Pilot <ArrowRight size={18}/>
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default StartupProfile;
