import React, { useEffect, useState } from 'react';
import { getPilots } from '../api';
import { ArrowRight, Wand2, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PilotDesigner = () => {
  const [pilots, setPilots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showGovernance, setShowGovernance] = useState<Record<number, boolean>>({});
  const navigate = useNavigate();

  useEffect(() => {
    getPilots().then(data => {
      setPilots(data || []);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-[26px] font-bold text-slate-800">Pilot Designer & Contracting</h1>
          <p className="text-slate-500 mt-1 text-[14px]">Design controlled sandbox pilots with milestones and KPIs</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 pb-12">
        {pilots.map((p, idx) => (
          <div key={p.id} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden flex flex-col lg:flex-row">
             <div className="p-6 lg:w-[30%] bg-slate-50 border-r border-slate-200 flex flex-col justify-between shrink-0">
               <div>
                 <div className="text-[12px] font-semibold px-2 py-0.5 rounded border uppercase tracking-wider border-amber-200 bg-amber-50 text-amber-800 inline-block mb-4">{p.status}</div>
                 <div className="text-xs font-mono font-semibold text-slate-400 mb-1">MH-PLT-{String(idx + 1).padStart(3, '0')}</div>
                 <h2 className="text-[20px] font-semibold text-slate-800 mb-1">{p.application?.startup?.name}</h2>
                 <p className="text-[14px] font-medium text-[#1F3A5F] mb-6">{p.application?.challenge?.title}</p>
                 
                 <table className="w-full text-[13px] text-slate-600 mb-6">
                   <tbody className="divide-y divide-slate-200">
                     <tr>
                       <td className="py-2 font-semibold">Pilot Duration</td>
                       <td className="py-2 font-mono text-right">{p.duration_days} Days</td>
                     </tr>
                     <tr>
                       <td className="py-2 font-semibold">Target Start</td>
                       <td className="py-2 font-mono text-right">{new Date(p.start_date).toLocaleDateString()}</td>
                     </tr>
                   </tbody>
                 </table>
               </div>
               
               <button onClick={() => navigate(`/pilots/${p.id}`)} className="mt-8 w-full py-2.5 bg-[#1F3A5F] text-white rounded-md font-medium text-[14px] hover:bg-slate-800 transition flex justify-center items-center gap-2">
                 Launch Pilot Dashboard <ArrowRight size={16}/>
               </button>
             </div>
             
             <div className="p-6 lg:w-[70%] grid grid-cols-1 gap-6">
               <div className="border border-slate-200 rounded-lg overflow-hidden">
                 <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
                   <h3 className="font-semibold text-slate-800 text-[14px]">Core KPIs</h3>
                   <button className="text-[12px] font-medium text-[#1F3A5F] hover:underline">+ Add KPI</button>
                 </div>
                 <table className="w-full text-left text-[13px]">
                   <thead className="bg-slate-50 border-b border-slate-200 text-[12px] uppercase text-slate-500">
                     <tr>
                       <th className="px-4 py-2 font-semibold">KPI Name</th>
                       <th className="px-4 py-2 font-semibold text-right">Baseline</th>
                       <th className="px-4 py-2 font-semibold text-right">Target</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100 text-slate-700">
                     {p.kpis.map((k: any) => (
                       <tr key={k.id}>
                         <td className="px-4 py-3 font-medium">{k.name}</td>
                         <td className="px-4 py-3 font-mono text-right">{k.baseline} {k.unit}</td>
                         <td className="px-4 py-3 font-mono font-semibold text-[#1F3A5F] text-right">{k.name === 'System Availability' ? '>=' : '<='}{k.target} {k.unit}</td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
               
               <div className="border border-slate-200 rounded-lg overflow-hidden">
                 <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
                   <h3 className="font-semibold text-slate-800 text-[14px]">Milestones & Payments</h3>
                   <button className="text-[12px] font-medium text-[#1F3A5F] hover:underline">+ Add Milestone</button>
                 </div>
                 <table className="w-full text-left text-[13px]">
                   <thead className="bg-slate-50 border-b border-slate-200 text-[12px] uppercase text-slate-500">
                     <tr>
                       <th className="px-4 py-2 font-semibold">Milestone</th>
                       <th className="px-4 py-2 font-semibold text-right">Payout %</th>
                       <th className="px-4 py-2 font-semibold">Status</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100 text-slate-700">
                     {p.milestones.map((m: any) => (
                       <tr key={m.id}>
                         <td className="px-4 py-3 font-medium">{m.title}</td>
                         <td className="px-4 py-3 font-mono font-semibold text-[#1F3A5F] text-right">{m.percentage}%</td>
                         <td className="px-4 py-3">
                           <span className={`text-[12px] font-semibold px-2 py-0.5 rounded border uppercase tracking-wider ${
                             m?.status === 'COMPLETED' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-slate-200 bg-slate-50 text-slate-600'
                           }`}>{m?.status || 'PENDING'}</span>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
               
               <div className="border border-slate-200 rounded-lg overflow-hidden">
                 <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
                   <h3 className="font-semibold text-slate-800 text-[14px]">Risk Register</h3>
                 </div>
                 <table className="w-full text-left text-[13px]">
                   <thead className="bg-slate-50 border-b border-slate-200 text-[12px] uppercase text-slate-500">
                     <tr>
                       <th className="px-4 py-2 font-semibold w-1/4">Severity</th>
                       <th className="px-4 py-2 font-semibold w-1/2">Risk & Mitigation</th>
                       <th className="px-4 py-2 font-semibold">Status</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100 text-slate-700">
                     {p.risks.map((r: any) => (
                       <tr key={r.id}>
                         <td className="px-4 py-3">
                           <span className={`text-[12px] font-semibold px-2 py-0.5 rounded border uppercase tracking-wider ${
                             r.severity === 'CRITICAL' ? 'border-red-200 bg-red-50 text-red-800' 
                             : r.severity === 'HIGH' ? 'border-orange-200 bg-orange-50 text-orange-800' 
                             : 'border-amber-200 bg-amber-50 text-amber-800'
                           }`}>
                             {r.severity}
                           </span>
                         </td>
                         <td className="px-4 py-3">
                           <div className="font-medium text-slate-800 mb-0.5">{r.description}</div>
                           <div className="text-slate-500">Mitigation: {r.mitigation}</div>
                         </td>
                         <td className="px-4 py-3">
                           <span className={`text-[12px] font-semibold px-2 py-0.5 rounded border uppercase tracking-wider ${
                             r?.status === 'MITIGATED' || r?.status === 'RESOLVED' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-slate-200 bg-slate-50 text-slate-600'
                           }`}>{r?.severity || 'UNKNOWN'} / {r?.status || 'ACTIVE'}</span>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>

               <div className="border border-slate-200 rounded-lg overflow-hidden">
                 <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
                   <h3 className="font-semibold text-slate-800 text-[14px]">Pilot Governance Controls</h3>
                   {(!p.governance_controls || p.governance_controls.length === 0) && !showGovernance[p.id] && (
                     <button onClick={() => setShowGovernance({ ...showGovernance, [p.id]: true })} className="text-[12px] flex items-center gap-1 font-medium text-[#1F3A5F] hover:underline">
                       <Wand2 size={14}/> AI Suggestions
                     </button>
                   )}
                 </div>
                 
                 {(p.governance_controls && p.governance_controls.length > 0) || showGovernance[p.id] ? (
                   <div>
                     {(!p.governance_controls || p.governance_controls.length === 0) && showGovernance[p.id] && (
                         <div className="bg-white px-4 py-2 border-b border-slate-100">
                           <p className="text-[13px] text-slate-600 font-medium flex items-center gap-1">
                             <Wand2 size={14} className="text-slate-400"/> AI-assisted suggestions - subject to departmental and legal approval.
                           </p>
                         </div>
                     )}
                     
                     <table className="w-full text-left text-[13px]">
                       <thead className="bg-slate-50 border-b border-slate-200 text-[12px] uppercase text-slate-500">
                         <tr>
                           <th className="px-4 py-2 font-semibold w-1/4">Domain</th>
                           <th className="px-4 py-2 font-semibold">Control Description</th>
                         </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100 text-slate-700 bg-white">
                         {p.governance_controls && p.governance_controls.length > 0 ? p.governance_controls.map((g: any) => (
                           <tr key={g.id}>
                             <td className="px-4 py-3 font-semibold text-slate-600 uppercase tracking-wider text-[12px]">{g.category}</td>
                             <td className="px-4 py-3 text-slate-800">{g.description}</td>
                           </tr>
                         )) : (
                           <>
                             <tr>
                               <td className="px-4 py-3 font-semibold text-slate-600 uppercase tracking-wider text-[12px]">DATA</td>
                               <td className="px-4 py-3 text-slate-800">Operational queue timestamps only; no patient clinical records or PII processed.</td>
                             </tr>
                             <tr>
                               <td className="px-4 py-3 font-semibold text-slate-600 uppercase tracking-wider text-[12px]">IP RIGHTS</td>
                               <td className="px-4 py-3 text-slate-800">Background IP retained by startup; pilot-specific government usage rights defined through approved contractual terms.</td>
                             </tr>
                             <tr>
                               <td className="px-4 py-3 font-semibold text-slate-600 uppercase tracking-wider text-[12px]">CYBERSECURITY</td>
                               <td className="px-4 py-3 text-slate-800">Role-based access; preliminary deployment vulnerability check passed.</td>
                             </tr>
                             <tr>
                               <td className="px-4 py-3 font-semibold text-slate-600 uppercase tracking-wider text-[12px]">RISK</td>
                               <td className="px-4 py-3 text-slate-800">Supervised hospital deployment with staff orientation sessions.</td>
                             </tr>
                           </>
                         )}
                       </tbody>
                     </table>
                   </div>
                 ) : (
                   <div className="text-[14px] text-slate-500 text-center py-6 bg-white">
                     No governance controls defined. Click AI suggestions to draft.
                   </div>
                 )}
               </div>

             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PilotDesigner;
