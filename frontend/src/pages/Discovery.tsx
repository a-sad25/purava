import React, { useEffect, useState } from 'react';
import { getStartups } from '../api';
import { ShieldCheck, ArrowRight, Building, Users, Activity, CheckCircle2, X, Filter, Target, Zap, Info, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Discovery = () => {
  const [startups, setStartups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [filters, setFilters] = useState({ pilotReady: false, govtExperience: false });
  const [eligibilityModalId, setEligibilityModalId] = useState<number | null>(null);
  const [matchModalId, setMatchModalId] = useState<number | null>(null);

  useEffect(() => {
    getStartups().then(data => {
      setStartups(data || []);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="flex justify-center items-center h-full">Loading Startup Directory...</div>;

  const displayedStartups = startups.filter(s => {
    if (filters.pilotReady && !s.pilot_ready) return false;
    if (filters.govtExperience && !s.has_experience) return false;
    return true;
  });

  return (
    <div className="flex flex-col h-full max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-end shrink-0">
        <div>
          <h1 className="text-[26px] font-bold text-slate-800">Startup Discovery Engine</h1>
          <p className="text-slate-500 mt-1 text-[14px]">Screened deep-tech startups matched to departmental problem statements</p>
        </div>
        <div className="flex gap-4">
           <div className="relative">
             <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
             <input type="text" placeholder="Search technologies..." className="pl-10 pr-4 py-2 border rounded-lg w-64 text-sm" />
           </div>
           <button className="px-4 py-2 border rounded-lg flex items-center gap-2 text-slate-600 bg-white hover:bg-slate-50">
             <Filter size={18}/> Filters
           </button>
        </div>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        <div className="w-1/4 bg-white border border-slate-200 rounded-lg shadow-sm p-5 overflow-y-auto hidden lg:block">
          <h3 className="font-bold text-slate-800 mb-4 uppercase tracking-wider text-xs">Filter By Challenge</h3>
          <div className="space-y-2 mb-6">
            <label className="flex items-center gap-2 text-[14px] text-slate-700 cursor-pointer"><input type="radio" name="ch" defaultChecked className="text-blue-600"/> All Startups</label>
            <label className="flex items-center gap-2 text-[14px] text-slate-700 cursor-pointer"><input type="radio" name="ch" className="text-blue-600"/> Hospital Queue Optimization</label>
            <label className="flex items-center gap-2 text-[14px] text-slate-700 cursor-pointer"><input type="radio" name="ch" className="text-blue-600"/> Agricultural Water Management</label>
          </div>
          
          <h3 className="font-bold text-slate-800 mb-4 uppercase tracking-wider text-xs border-t pt-4">Startup Status</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[14px] text-slate-700 cursor-pointer"><input type="checkbox" checked={filters.pilotReady} onChange={e => setFilters({...filters, pilotReady: e.target.checked})} className="rounded text-blue-600"/> Pilot Ready</label>
            <label className="flex items-center gap-2 text-[14px] text-slate-700 cursor-pointer"><input type="checkbox" checked={filters.govtExperience} onChange={e => setFilters({...filters, govtExperience: e.target.checked})} className="rounded text-blue-600"/> Government Experience</label>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 overflow-y-auto pb-8 pr-2">
          {displayedStartups.map(s => (
            <div key={s.id} className="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col">
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-3">
                  <div className="bg-slate-100 text-slate-700 text-[12px] font-semibold px-2 py-0.5 rounded border border-slate-200 uppercase tracking-wider">{s.sector}</div>
                  {s.pilot_ready && <div className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[12px] font-semibold uppercase tracking-wider flex items-center gap-1"><ShieldCheck size={14}/> Pilot Ready</div>}
                </div>
                <h3 className="text-[18px] font-semibold text-slate-800 mb-1">{s.name}</h3>
                <p className="text-[14px] text-slate-600 line-clamp-1 mb-4">{s.description}</p>
                
                <div className="space-y-2 mt-auto pt-4 border-t border-slate-100">
                   <button onClick={() => setEligibilityModalId(s.id)} className="flex items-center justify-between w-full text-[13px] text-slate-700 hover:bg-slate-50 px-2 py-1 -mx-2 rounded transition">
                     <span className="flex items-center gap-2 font-medium">
                       <CheckCircle2 size={16} className="text-emerald-500"/> Eligibility Checked
                     </span>
                     <span className="text-blue-600 hover:underline">View</span>
                   </button>
                   <div className={`flex items-center gap-2 text-[13px] px-2 py-1 -mx-2 ${s.has_experience ? 'text-slate-700' : 'text-slate-400'}`}>
                     <CheckCircle2 size={16} className={s.has_experience ? 'text-emerald-500' : 'text-slate-300'}/> <span className="font-medium">Relevant Govt Experience</span>
                   </div>
                </div>
              </div>
              <div className="p-4 border-t border-slate-200 bg-slate-50 flex gap-3">
                <button onClick={() => navigate(`/startup/${s.id}`)} className="flex-1 py-2 text-[13px] bg-[#1F3A5F] text-white rounded-md font-medium hover:bg-slate-800 transition">
                  View Profile
                </button>
                <button onClick={() => setMatchModalId(s.id)} className="flex-1 py-2 text-[13px] bg-white border border-slate-300 text-slate-700 rounded-md font-medium hover:bg-slate-50 transition">
                  Why Matched?
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Eligibility Modal */}
      {eligibilityModalId && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full flex flex-col">
            <div className="flex justify-between items-center p-5 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2"><ShieldCheck className="text-emerald-500"/> ELIGIBILITY SCREENING VERIFICATION</h2>
              <button onClick={() => setEligibilityModalId(null)} className="text-slate-400 hover:text-slate-700"><X size={20}/></button>
            </div>
            <div className="p-5 space-y-4 text-[14px]">
              <div className="flex justify-between items-center p-3 bg-slate-50 border rounded-lg">
                <span className="font-medium text-slate-700">Startup Entity Status</span>
                <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded text-[12px] flex items-center gap-1"><CheckCircle2 size={14}/> Active / Registered</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 border rounded-lg">
                <span className="font-medium text-slate-700">DPIIT Recognition</span>
                <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded text-[12px] flex items-center gap-1"><CheckCircle2 size={14}/> Profile evidence available</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 border rounded-lg">
                <span className="font-medium text-slate-700">Domain Relevance</span>
                <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded text-[12px] flex items-center gap-1"><CheckCircle2 size={14}/> Healthcare / Workflow Automation</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 border rounded-lg">
                <span className="font-medium text-slate-700">Pilot Deployment Readiness</span>
                <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded text-[12px] flex items-center gap-1"><CheckCircle2 size={14}/> Functional prototype demonstrated</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 border border-blue-100 rounded-lg">
                <span className="font-medium text-blue-900 flex items-center gap-1"><Info size={14}/> Prior Experience Requirement</span>
                <span className="text-blue-700 font-medium text-[12px]">Potential relaxation under applicable rules*</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 border border-blue-100 rounded-lg">
                <span className="font-medium text-blue-900 flex items-center gap-1"><Info size={14}/> Prior Turnover Requirement</span>
                <span className="text-blue-700 font-medium text-[12px]">Potential relaxation under applicable rules*</span>
              </div>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 rounded-b-xl">
              <p className="text-[12px] text-slate-500 leading-tight text-justify">
                *Any startup-related relaxation is subject to the applicable procurement framework, tender conditions, technical/quality requirements, and formal verification by the Competent Authority.
                <br/><br/>
                PURAVA is displaying screening evidence, not issuing a legal eligibility certificate.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Match Modal */}
      {matchModalId && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full flex flex-col">
            <div className="flex justify-between items-center p-5 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Zap className="text-[#1F3A5F]"/> Deterministic "Why Matched?"</h2>
              <button onClick={() => setMatchModalId(null)} className="text-slate-400 hover:text-slate-700"><X size={20}/></button>
            </div>
            <div className="p-5 overflow-auto max-h-[70vh]">
               <table className="w-full text-left text-[14px]">
                 <thead className="bg-slate-50 border-y border-slate-200 text-[12px] uppercase text-slate-500">
                   <tr>
                     <th className="px-4 py-3 font-semibold w-1/4">Criterion</th>
                     <th className="px-4 py-3 font-semibold w-1/3">Challenge Requirement</th>
                     <th className="px-4 py-3 font-semibold w-1/3">Startup Demonstration</th>
                     <th className="px-4 py-3 font-semibold w-1/12 text-center">Match Basis</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100 text-slate-700">
                   <tr>
                     <td className="px-4 py-3 font-medium text-slate-800">Domain Scope</td>
                     <td className="px-4 py-3">Hospital OPD wait time reduction</td>
                     <td className="px-4 py-3">Queue optimization & workflow mapping</td>
                     <td className="px-4 py-3 text-center"><CheckCircle2 size={16} className="text-emerald-500 mx-auto"/></td>
                   </tr>
                   <tr>
                     <td className="px-4 py-3 font-medium text-slate-800">Target Outcome</td>
                     <td className="px-4 py-3">=30% wait time reduction</td>
                     <td className="px-4 py-3">37.8% demonstrated in prior deployments</td>
                     <td className="px-4 py-3 text-center"><CheckCircle2 size={16} className="text-emerald-500 mx-auto"/></td>
                   </tr>
                   <tr>
                     <td className="px-4 py-3 font-medium text-slate-800">Deployment Scope</td>
                     <td className="px-4 py-3">No major infrastructure changes</td>
                     <td className="px-4 py-3">Software-only, uses existing CCTV & SMS</td>
                     <td className="px-4 py-3 text-center"><CheckCircle2 size={16} className="text-emerald-500 mx-auto"/></td>
                   </tr>
                   <tr>
                     <td className="px-4 py-3 font-medium text-slate-800">KPI Compatibility</td>
                     <td className="px-4 py-3">Patient waiting time, Staff workload</td>
                     <td className="px-4 py-3">Tracks patient wait times and staff load</td>
                     <td className="px-4 py-3 text-center"><CheckCircle2 size={16} className="text-emerald-500 mx-auto"/></td>
                   </tr>
                   <tr>
                     <td className="px-4 py-3 font-medium text-slate-800">Evaluation History</td>
                     <td className="px-4 py-3">Requires prior verified performance</td>
                     <td className="px-4 py-3">Validated deployment history available</td>
                     <td className="px-4 py-3 text-center"><CheckCircle2 size={16} className="text-emerald-500 mx-auto"/></td>
                   </tr>
                 </tbody>
               </table>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 rounded-b-xl flex justify-between items-center">
              <span className="text-[12px] font-medium text-slate-500">Match generated from deterministic capability-to-challenge mapping.</span>
              <button onClick={() => navigate(`/startup/${matchModalId}`)} className="px-6 py-2 bg-[#1F3A5F] text-white rounded-md font-medium text-[13px] hover:bg-slate-800 transition">
                Proceed to Startup Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Discovery;
