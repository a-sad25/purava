import React, { useEffect, useState } from 'react';
import { getPilots, validatePilot } from '../api';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, CheckCircle, FileText, ArrowRight, Activity } from 'lucide-react';
import LifecycleIndicator from '../components/LifecycleIndicator';

const Validation = () => {
  const navigate = useNavigate();
  const [pilots, setPilots] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getPilots().then(data => {
      setPilots((data || []).filter((p: any) => p.status === 'ACTIVE' || p.status === 'VALIDATION' || p.status === 'COMPLETED'));
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setError(true);
      setLoading(false);
    });
  }, []);

  const handleValidate = async (id: number) => {
    try {
      await validatePilot(id);
      setPilots(pilots.map(p => p.id === id ? { ...p, validation: { status: 'VALIDATED' } } : p));
    } catch (e) {
      console.error(e);
      alert("Failed to submit validation");
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">Failed to load validation data.</div>;

  return (
    <div className="max-w-7xl mx-auto">
      <LifecycleIndicator currentStep="VALIDATION" />
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Independent Validation</h1>
          <p className="text-slate-500 mt-1">Review evidence and validate pilot KPI achievements</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {pilots.filter(p => p.validation?.status === 'PENDING' || !p.validation).map(p => (
          <div key={p.id} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
             <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
               <div>
                 <h2 className="text-xl font-bold text-slate-800">{p.application?.startup?.name}</h2>
                 <p className="text-sm font-medium text-blue-600">{p.application?.challenge?.title}</p>
               </div>
               <div className="bg-purple-100 text-purple-800 font-bold px-3 py-1 rounded text-xs uppercase tracking-wider flex items-center gap-1">
                 <ShieldCheck size={14}/> Validation Pending
               </div>
             </div>
             
             <div className="p-6">
               <h3 className="font-bold text-slate-700 mb-4 uppercase text-xs tracking-wider border-b pb-2">Evidence Submitted</h3>
               <div className="space-y-3 mb-6">
                 <div className="flex items-center justify-between text-sm p-3 bg-slate-50 border rounded text-slate-700">
                   <div className="flex items-center gap-2"><FileText size={16} className="text-blue-500"/> KPI Measurement Dataset (.csv)</div>
                   <CheckCircle size={16} className="text-emerald-500"/>
                 </div>
                 <div className="flex items-center justify-between text-sm p-3 bg-slate-50 border rounded text-slate-700">
                   <div className="flex items-center gap-2"><FileText size={16} className="text-blue-500"/> Hospital Deployment Logs (.pdf)</div>
                   <CheckCircle size={16} className="text-emerald-500"/>
                 </div>
                 <div className="flex items-center justify-between text-sm p-3 bg-slate-50 border rounded text-slate-700">
                   <div className="flex items-center gap-2"><FileText size={16} className="text-blue-500"/> Evaluator Field Observations (.pdf)</div>
                   <CheckCircle size={16} className="text-emerald-500"/>
                 </div>
               </div>

               <h3 className="font-bold text-slate-700 mb-4 uppercase text-xs tracking-wider border-b pb-2">Validation Checklist</h3>
               <div className="space-y-2 mb-8">
                 <label className="flex items-center gap-3 text-sm text-slate-700 cursor-pointer">
                   <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-slate-300" defaultChecked/>
                   Evidence completeness verified
                 </label>
                 <label className="flex items-center gap-3 text-sm text-slate-700 cursor-pointer">
                   <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-slate-300" defaultChecked/>
                   Data consistency audit passed
                 </label>
                 <label className="flex items-center gap-3 text-sm text-slate-700 cursor-pointer">
                   <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-slate-300" defaultChecked/>
                   Target achievement confirmed
                 </label>
                 <label className="flex items-center gap-3 text-sm text-slate-700 cursor-pointer">
                   <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-slate-300" defaultChecked/>
                   Pilot integrity & risk compliance confirmed
                 </label>
               </div>

               <button onClick={() => handleValidate(p.id)} className="w-full py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition flex items-center justify-center gap-2">
                 Submit Final Validation <ArrowRight size={18}/>
               </button>
             </div>
          </div>
        ))}

        {pilots.filter(p => p.validation?.status === 'VALIDATED').map(p => (
          <div key={p.id} className="bg-white rounded-lg shadow-sm border border-emerald-500 overflow-hidden opacity-80">
            <div className="p-6 flex justify-between items-center bg-emerald-50">
               <div>
                 <h2 className="text-xl font-bold text-slate-800">{p.application?.startup?.name}</h2>
                 <p className="text-sm font-medium text-emerald-700">Validated Successfully</p>
               </div>
               <div className="bg-emerald-500 text-white font-bold px-3 py-1 rounded flex items-center gap-1 text-xs uppercase tracking-wider">
                 <CheckCircle size={14}/> Completed
               </div>
            </div>
            <div className="p-4 bg-white text-center">
               <button onClick={() => navigate('/scale')} className="text-blue-600 font-bold flex items-center justify-center gap-2 w-full">
                 Proceed to Scale Assessment <ArrowRight size={16}/>
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Validation;
