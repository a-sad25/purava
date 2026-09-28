import React, { useState } from 'react';
import { structureChallenge } from '../api';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Save, LayoutTemplate } from 'lucide-react';

const CreateChallenge = () => {
  const navigate = useNavigate();
  const [rawText, setRawText] = useState('');
  const [loading, setLoading] = useState(false);
  const [structured, setStructured] = useState<any>(null);

  const handleStructure = async () => {
    if (!rawText.trim()) return;
    setLoading(true);
    try {
      const res = await structureChallenge(rawText);
      setStructured(res);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col h-full">
      <div className="flex justify-between items-end mb-6 shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Create Innovation Challenge</h1>
          <p className="text-slate-500 mt-1">Transform a raw problem statement into a structured procurement challenge.</p>
        </div>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        {/* Left Side: Raw Input */}
        <div className="w-1/2 flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
           <div className="bg-slate-50 p-4 border-b border-slate-200">
             <h2 className="font-bold text-slate-700 flex items-center gap-2">1. Raw Problem Statement</h2>
           </div>
           <div className="p-6 flex-1 flex flex-col">
             <textarea 
               className="w-full flex-1 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
               placeholder="E.g., Hospitals have long queues and patients wait too much. We need a solution."
               value={rawText}
               onChange={e => setRawText(e.target.value)}
             />
             <div className="mt-4 flex justify-end">
               <button 
                 onClick={handleStructure} 
                 disabled={loading || !rawText.trim()}
                 className="px-6 py-3 bg-[#0a192f] text-white font-bold rounded-lg hover:bg-slate-800 transition flex items-center gap-2 disabled:opacity-50"
               >
                 {loading ? 'Structuring with AI...' : <><Sparkles size={18} className="text-orange-400"/> Generate Structured Challenge</>}
               </button>
             </div>
           </div>
        </div>

        {/* Right Side: Structured Output */}
        <div className="w-1/2 flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative">
           {loading && (
             <div className="absolute inset-0 bg-white/80 z-10 flex flex-col items-center justify-center">
               <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
               <p className="text-blue-900 font-bold">Structuring Pilot Requirements...</p>
             </div>
           )}
           <div className="bg-blue-50 p-4 border-b border-blue-100 flex justify-between items-center">
             <h2 className="font-bold text-blue-900 flex items-center gap-2"><LayoutTemplate size={18}/> 2. Structured Challenge</h2>
             {structured && <span className="text-xs bg-green-200 text-green-800 font-bold px-2 py-1 rounded">AI Generated</span>}
           </div>
           
           <div className="p-6 flex-1 overflow-y-auto bg-slate-50">
             {!structured ? (
               <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center p-8">
                 <ArrowRight size={48} className="mb-4 opacity-20"/>
                 <p>Enter your raw problem statement and click Generate to see the structured procurement format.</p>
               </div>
             ) : (
               <div className="space-y-6">
                 <div>
                   <label className="text-xs font-bold text-slate-500 uppercase">Problem Statement</label>
                   <div className="mt-1 p-3 bg-white border rounded text-sm text-slate-800">{structured.problem_statement}</div>
                 </div>
                 <div>
                   <label className="text-xs font-bold text-slate-500 uppercase">Desired Outcome</label>
                   <div className="mt-1 p-3 bg-white border rounded text-sm text-slate-800 font-semibold">{structured.desired_outcome}</div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="text-xs font-bold text-slate-500 uppercase">Primary KPI</label>
                     <div className="mt-1 p-2 bg-white border rounded text-sm">{structured.kpi}</div>
                   </div>
                   <div>
                     <label className="text-xs font-bold text-slate-500 uppercase">Pilot Duration</label>
                     <div className="mt-1 p-2 bg-white border rounded text-sm">{structured.pilot_duration} days</div>
                   </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                   <div className="bg-white border rounded p-3 border-orange-200">
                     <label className="text-xs font-bold text-orange-800 uppercase mb-2 block">Risk Considerations</label>
                     <ul className="list-disc pl-4 text-sm text-slate-700 space-y-1">
                       {structured.risks?.map((r: string, i: number) => <li key={i}>{r}</li>)}
                     </ul>
                   </div>
                   <div className="bg-white border rounded p-3 border-blue-200">
                     <label className="text-xs font-bold text-blue-800 uppercase mb-2 block">Evaluation Criteria</label>
                     <ul className="list-disc pl-4 text-sm text-slate-700 space-y-1">
                       {structured.evaluation_criteria?.map((r: string, i: number) => <li key={i}>{r}</li>)}
                     </ul>
                   </div>
                 </div>
               </div>
             )}
           </div>
           
           {structured && (
             <div className="p-4 bg-white border-t border-slate-200 flex justify-end gap-3">
               <button className="px-6 py-2 border border-slate-300 rounded font-medium hover:bg-slate-50">Save Draft</button>
               <button onClick={() => navigate('/challenges')} className="px-6 py-2 bg-green-600 text-white rounded font-bold hover:bg-green-700 flex items-center gap-2">
                 <Save size={18}/> Publish Challenge
               </button>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default CreateChallenge;
