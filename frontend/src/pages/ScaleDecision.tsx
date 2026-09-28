import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPilots } from '../api';
import { Scale, ShieldAlert, Lock, ArrowLeft, Download, CheckCircle2, Activity, BrainCircuit, ArrowRight } from 'lucide-react';
import LifecycleIndicator from '../components/LifecycleIndicator';

const ScaleDecision = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pilot, setPilot] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPilots().then(data => {
      const pilots = data || [];
      let found = null;
      if (id) {
        found = pilots.find((p: any) => p.id === Number(id));
      } else {
        found = pilots.find((p: any) => p.status === 'VALIDATION' || p.status === 'COMPLETED') || pilots[0];
      }
      setPilot(found);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="p-8">Loading verification data...</div>;
  if (!pilot) return <div className="p-8 text-red-600">Pilot not found.</div>;

  return (
    <div className="pb-12">
      <LifecycleIndicator currentStep="SCALE" />
      <div className="flex justify-between items-end mb-8">
        <div>
          <button onClick={() => navigate('/pilots')} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-4 font-medium text-[14px]">
            <ArrowLeft size={16}/> Back to Pilots
          </button>
          <h1 className="text-[28px] font-semibold text-slate-800">Final Scale Assessment</h1>
          <p className="text-[15px] text-slate-600 font-medium mt-1">Assess pilot evidence and prepare the case for competent-authority review.</p>
        </div>
      </div>

      <div className="space-y-8">
        {[pilot].map(p => {
          const kpi = p.kpis[0];
          const achievementPct = ((kpi.baseline - kpi.current) / kpi.baseline * 100).toFixed(1);
          
          const criticalRisksCount = p.risks ? p.risks.filter((r: any) => r.severity === 'CRITICAL' && r.status !== 'RESOLVED' && r.status !== 'MITIGATED').length : 0;
          const hasCriticalRisk = criticalRisksCount > 0;
          
          let verdict = 'INCONCLUSIVE';
          let verdictColor = 'slate';
          let verdictBg = 'bg-slate-50';
          let verdictBorder = 'border-slate-100';
          let textMsg = '';
          let textVal = `${achievementPct}% Reduction`;

          const threshold = kpi.failure_threshold ?? 65;
          let secondaryPassed = true;
          if (p.kpis && p.kpis.length > 1) {
              p.kpis.slice(1).forEach((skpi: any) => {
                 if (skpi.name === 'System Availability' && skpi.current < skpi.target) secondaryPassed = false;
                 else if (skpi.name !== 'System Availability' && skpi.current > skpi.target) secondaryPassed = false;
              });
          }

          const charterIntact = !p.charter_hash || p.charter_hash === p.current_charter_hash;

          if (!charterIntact) {
            verdict = 'CHARTER MODIFIED AFTER LOCK';
            verdictColor = 'red';
            verdictBg = 'bg-red-50';
            verdictBorder = 'border-red-100';
            textMsg = 'The pilot charter fields were improperly modified after the initial lock. Verification aborted.';
            textVal = 'INTEGRITY FAILURE';
          } else if (hasCriticalRisk || kpi.current > threshold) {
            verdict = 'FAILED';
            verdictColor = 'red';
            verdictBg = 'bg-red-50';
            verdictBorder = 'border-red-100';
            textMsg = 'Pilot did not meet the predefined success conditions or breached a critical risk condition; the pilot should be archived and lessons recorded.';
          } else if (kpi.current <= kpi.target && secondaryPassed) {
            verdict = 'SUCCESS';
            verdictColor = 'emerald';
            verdictBg = 'bg-emerald-50';
            verdictBorder = 'border-emerald-100';
            textMsg = 'Pilot achieved the predefined target under the validated demonstration conditions.';
          } else if (kpi.current < kpi.baseline) {
            verdict = 'PARTIAL';
            verdictColor = 'amber';
            verdictBg = 'bg-amber-50';
            verdictBorder = 'border-amber-100';
            textMsg = 'Pilot improved performance but did not reach the predefined target; the pilot could be extended or redesigned.';
          } else {
            verdict = 'FAILED';
            verdictColor = 'red';
            verdictBg = 'bg-red-50';
            verdictBorder = 'border-red-100';
            textMsg = 'Pilot did not meet the predefined success conditions or breached a critical risk condition; the pilot should be archived and lessons recorded.';
            textVal = '0% Reduction';
          }

          return (
          <div key={p.id} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden flex flex-col">
            
            <div className="bg-[#1F3A5F] p-6 text-white flex flex-col md:flex-row md:justify-between md:items-start gap-4">
               <div>
                 <div className="text-[12px] font-semibold text-slate-300 uppercase tracking-widest mb-1">Final Scale Decision Panel</div>
                 <h2 className="text-[24px] font-bold mb-1">{p.application?.startup?.name}</h2>
                 <p className="text-slate-300 text-[14px]">{p.application?.challenge?.title}</p>
               </div>
               <div className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold px-3 py-1.5 rounded-md flex items-center gap-2 text-[12px] uppercase tracking-wider shrink-0">
                 <CheckCircle2 size={14}/> Validation Completed
               </div>
            </div>

            {/* AUTOMATED PILOT VERDICT BANNER */}
            <div className={`${verdictBg} border-l-4 ${verdictBorder.replace('border-','border-l-')} p-8 flex flex-col md:flex-row items-start md:items-center justify-between border-y border-r border-slate-200`}>
              <div>
                 <div className={`text-[13px] font-semibold text-${verdictColor}-700 uppercase tracking-wider mb-2 flex items-center gap-1.5`}>
                   <BrainCircuit size={16} /> System-Generated Pilot Verdict
                 </div>
                 <div className="flex items-baseline gap-4 mb-2">
                   <div className={`text-[34px] font-bold text-slate-800`}>
                     {verdict}
                   </div>
                   {textVal !== 'INTEGRITY FAILURE' && (
                     <div className="text-[22px] font-mono font-semibold text-slate-600">
                       {textVal}
                     </div>
                   )}
                 </div>
                 <p className="text-[14px] font-medium text-slate-700">
                   {textMsg}
                 </p>
                 {charterIntact && p.charter_locked_at && (
                     <p className="text-[13px] text-slate-500 mt-3 flex items-center gap-1.5">
                         <Lock size={14}/> Verdict computed against the charter locked on {new Date(p.charter_locked_at).toLocaleDateString()} (hash {p.charter_hash?.substring(0,8)})
                     </p>
                 )}
              </div>
              <div className="mt-6 md:mt-0 flex flex-col items-start md:items-end shrink-0">
                 <span className="text-[12px] text-slate-500 uppercase font-semibold tracking-wider mb-2">Verdict Basis</span>
                 <div className="flex gap-2">
                   <span className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-[13px] font-medium rounded-md shadow-sm">Rule-Based KPI Math</span>
                   <span className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-[13px] font-medium rounded-md shadow-sm">Independent Validation</span>
                 </div>
              </div>
            </div>

            <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column: Evidence Summary Table */}
              <div>
                <h3 className="font-semibold text-slate-800 border-b border-slate-200 pb-3 mb-4 flex items-center gap-2"><Activity size={18} className="text-[#1F3A5F]"/> Evidence Summary</h3>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-[14px]">
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      <tr>
                        <td className="px-4 py-3 font-medium">Performance Achievement</td>
                        <td className="px-4 py-3 text-right">
                          <span className={`font-semibold px-2.5 py-1 rounded-md text-[12px] ${verdictColor === 'emerald' ? 'text-emerald-700 bg-emerald-100' : verdictColor === 'amber' ? 'text-amber-700 bg-amber-100' : 'text-red-700 bg-red-100'}`}>
                            {verdict === 'SUCCESS' ? 'Target Exceeded' : verdict === 'PARTIAL' ? 'Target Missed' : 'Failed'} ({achievementPct}%)
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-medium">Technical Evaluation<br/><span className="text-[11px] font-normal text-slate-500">Evaluation against predefined departmental criteria</span></td>
                        <td className="px-4 py-3 text-right font-semibold">Completed</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-medium">Pilot Status</td>
                        <td className="px-4 py-3 text-right">
                          <span className={`font-semibold px-2.5 py-1 rounded-md text-[12px] ${verdictColor === 'emerald' ? 'text-emerald-700 bg-emerald-100' : verdictColor === 'amber' ? 'text-amber-700 bg-amber-100' : 'text-red-700 bg-red-100'}`}>
                            {verdict === 'SUCCESS' ? 'VALIDATED' : verdict === 'PARTIAL' ? 'MEDIUM' : 'LOW'}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Right Column: Procurement Pathway */}
              <div>
                <h3 className="font-semibold text-slate-800 border-b border-slate-200 pb-3 mb-4 flex items-center gap-2"><Scale size={18} className="text-[#1F3A5F]"/> Recommended Procurement Pathway</h3>
                <div className="bg-slate-50 border border-slate-300 rounded-lg p-5">
                  <div className="space-y-4 relative before:absolute before:inset-0 before:ml-3 before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-200">
                     <div className="relative flex items-center justify-between group is-active">
                       <div className="flex items-center justify-center w-6 h-6 rounded-full border border-white bg-[#1F3A5F] text-white shadow shrink-0 z-10">
                         <CheckCircle2 size={14}/>
                       </div>
                       <div className="w-[calc(100%-2.5rem)] p-3 rounded border border-slate-200 bg-white shadow-sm text-[13px] font-medium text-slate-700">Validated Pilot</div>
                     </div>
                     <div className="relative flex items-center justify-between group is-active">
                       <div className="flex items-center justify-center w-6 h-6 rounded-full border border-white bg-[#1F3A5F] text-white shadow shrink-0 z-10">
                         <CheckCircle2 size={14}/>
                       </div>
                       <div className="w-[calc(100%-2.5rem)] p-3 rounded border border-slate-200 bg-white shadow-sm text-[13px] font-medium text-slate-700">Evidence Dossier</div>
                     </div>
                     <div className="relative flex items-center justify-between group is-active">
                       <div className="flex items-center justify-center w-6 h-6 rounded-full border border-slate-200 bg-white text-slate-300 shadow shrink-0 z-10"></div>
                       <div className="w-[calc(100%-2.5rem)] p-3 rounded border border-slate-200 bg-white shadow-sm text-[13px] font-medium text-slate-700">Technical Specification</div>
                     </div>
                     <div className="relative flex items-center justify-between group is-active">
                       <div className="flex items-center justify-center w-6 h-6 rounded-full border border-slate-200 bg-white text-slate-300 shadow shrink-0 z-10"></div>
                       <div className="w-[calc(100%-2.5rem)] p-3 rounded border border-slate-200 bg-white shadow-sm text-[13px] font-medium text-slate-700">Competent Authority Review</div>
                     </div>
                     <div className="relative flex items-center justify-between group is-active">
                       <div className="flex items-center justify-center w-6 h-6 rounded-full border border-amber-200 bg-amber-50 text-amber-500 shadow shrink-0 z-10"></div>
                       <div className="w-[calc(100%-2.5rem)] p-3 rounded border border-amber-200 bg-amber-50 shadow-sm text-[12px] font-semibold text-amber-800">Decided by Competent Authority, not automated</div>
                     </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-200 flex flex-col md:flex-row gap-4 justify-between items-center">
                {verdict === 'SUCCESS' ? (
                  <button onClick={() => window.open(`${import.meta.env.VITE_API_URL || 'http://localhost:8001/api'}/dossier/pdf/${p.id}`, '_blank')} className="w-full md:w-auto px-6 py-2.5 bg-[#1F3A5F] text-white rounded-md font-medium hover:bg-slate-800 transition flex items-center justify-center gap-2 text-[14px]">
                    <Download size={16}/> Generate Procurement & Evidence Brief (PDF)
                  </button>
                ) : verdict === 'PARTIAL' ? (
                  <button className="w-full md:w-auto px-6 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-md font-medium hover:bg-slate-50 transition flex items-center justify-center gap-2 text-[14px]">
                    <ArrowRight size={16}/> Request Extended Pilot
                  </button>
                ) : (
                  <button className="w-full md:w-auto px-6 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-md font-medium hover:bg-slate-50 transition flex items-center justify-center gap-2 text-[14px]">
                    <ShieldAlert size={16}/> Close / Archive Pilot
                  </button>
                )}
                
                <p className="text-[12px] text-slate-500 font-medium tracking-wide uppercase">
                  <Lock size={12} className="inline mr-1 -mt-0.5"/> Charter hash verified
                </p>
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
};

export default ScaleDecision;
