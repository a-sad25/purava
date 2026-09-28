import React, { useEffect, useState } from 'react';
import { getChallenges } from '../api';
import { Calendar, Building, Plus, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Challenges = () => {
  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getChallenges().then(data => {
      setChallenges(data || []);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="flex justify-center items-center h-full">Loading Challenges...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-[26px] font-bold text-slate-800">Innovation Challenges</h1>
          <p className="text-slate-500 mt-1 text-[14px]">Problem statements published by government departments</p>
        </div>
        <button onClick={() => navigate('/challenges/new')} className="px-5 py-2 bg-[#1F3A5F] text-white font-medium text-sm rounded-md hover:bg-slate-800 transition flex items-center gap-2 shadow-sm">
          <Plus size={16} /> New Challenge
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {challenges.map((c, idx) => {
          const budgetInLakhs = c?.indicative_budget != null ? (c.indicative_budget / 100000).toFixed(1) : 'N/A';
          return (
          <div key={c?.id || idx} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition flex flex-col">
            <div className="p-6 flex-1">
              <div className="flex justify-between items-start mb-4">
                <div className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider">{c?.sector || 'Unknown'}</div>
                <div className={`text-[12px] font-semibold px-2 py-0.5 rounded border uppercase tracking-wider ${
                  c?.status === 'PUBLISHED' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-amber-200 bg-amber-50 text-amber-800'
                }`}>
                  {c?.status || 'UNKNOWN'}
                </div>
              </div>
              <div className="text-xs font-mono font-semibold text-slate-400 mb-2">MH-CHL-{String((c?.id || idx) + 1).padStart(3, '0')}</div>
              <h2 className="text-[18px] font-semibold text-slate-800 mb-2 leading-snug">{c?.title || 'Untitled'}</h2>
              <p className="text-slate-600 text-[14px] line-clamp-3 mb-6">{c?.problem_description || c?.description || 'No description provided.'}</p>
              
              <div className="space-y-3 mt-auto">
                <div className="flex items-center text-[13px] text-slate-500 gap-2">
                  <Building size={14} className="text-slate-400 shrink-0"/>
                  <span className="truncate">{c?.department?.name || 'Unknown Department'}</span>
                </div>
                <div className="flex items-center text-[13px] text-slate-500 gap-2">
                  <Calendar size={14} className="text-slate-400 shrink-0"/>
                  <span>Duration: <span className="font-mono font-semibold text-slate-800">{c?.pilot_duration_days != null ? c.pilot_duration_days : 'N/A'}</span> Days</span>
                </div>
                <div className="bg-slate-50 p-3 rounded border border-slate-100">
                  <div className="text-[13px] text-slate-700 font-medium">Indicative Pilot Budget: <span className="font-mono font-semibold text-slate-800">?{budgetInLakhs} Lakhs</span></div>
                  <div className="text-[11px] text-slate-500 mt-1 leading-tight">Final value and procurement pathway subject to applicable rules and competent authority.</div>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-between items-center shrink-0">
              <span className="text-[13px] font-medium text-slate-600"><span className="font-mono font-semibold text-slate-800">{c?.applications_count || 0}</span> Applications</span>
              <button className="text-[#1F3A5F] font-medium text-[14px] hover:underline">Manage</button>
            </div>
          </div>
        )})}
      </div>
    </div>
  );
};

export default Challenges;
