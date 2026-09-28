import React, { useEffect, useState } from 'react';
import { getStats, getPilots } from '../api';
import { Lightbulb, Rocket, Users, ShieldCheck, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [pilots, setPilots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sData, pData] = await Promise.all([getStats(), getPilots()]);
        setStats(sData);
        setPilots(pData);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-full">Loading Innovation Platform...</div>;
  if (!stats) return <div className="p-8 text-red-600">Failed to load dashboard data. <button onClick={() => window.location.reload()} className="underline ml-2">Retry</button></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-[26px] font-bold text-slate-800">Innovation Dashboard</h1>
          <p className="text-slate-500 mt-1 text-[14px]">Maharashtra State Innovation Society Procurement Workflow</p>
        </div>
        <button onClick={() => navigate('/challenges/new')} className="px-5 py-2 bg-[#1F3A5F] text-white font-medium text-sm rounded-md hover:bg-slate-800 transition flex items-center gap-2">
          <Lightbulb size={16} /> Publish New Challenge
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Challenges</div>
              <div className="text-[28px] font-bold text-slate-800 mt-2">{stats?.challenges}</div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500 border border-slate-200"><Lightbulb size={20} /></div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Innovation Funnel</div>
              <div className="text-[28px] font-bold text-slate-800 mt-2">{stats?.innovation_funnel}</div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500 border border-slate-200"><Users size={20} /></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Pilots</div>
              <div className="text-[28px] font-bold text-slate-800 mt-2">{stats?.active_pilots}</div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500 border border-slate-200"><Rocket size={20} /></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Awaiting Validation</div>
              <div className="text-[28px] font-bold text-slate-800 mt-2">{stats?.validation_pilots}</div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500 border border-slate-200"><ShieldCheck size={20} /></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-[18px] font-semibold text-slate-800">Current Pilots</h2>
            <button onClick={() => navigate('/pilots')} className="text-[14px] font-medium text-[#1F3A5F] flex items-center gap-1 hover:underline">View All <ArrowRight size={16}/></button>
          </div>
          <div className="divide-y divide-slate-100">
            {pilots.map((pilot: any) => (
              <div key={pilot.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between hover:bg-slate-50 transition gap-4">
                <div>
                  <h3 className="font-semibold text-slate-800 text-[16px] mb-1">{pilot.application?.startup?.name}</h3>
                  <div className="text-[14px] text-slate-600 mb-2">{pilot.application?.challenge?.title}</div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 text-[12px] uppercase font-semibold border rounded ${
                      pilot.status === 'ACTIVE' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' 
                      : pilot.status === 'COMPLETED' ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                      : pilot.status === 'VALIDATION' ? 'border-amber-200 bg-amber-50 text-amber-800'
                      : 'border-slate-200 bg-slate-50 text-slate-700'
                    }`}>
                      {pilot.status}
                    </span>
                    <span className="text-[13px] text-slate-500">Duration: <span className="font-mono font-semibold text-slate-800">{pilot.duration_days}</span> days</span>
                  </div>
                </div>
                <button onClick={() => navigate(`/pilots/${pilot.id}`)} className="px-4 py-2 text-[14px] bg-white border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 font-medium transition shrink-0">
                  Monitor Pilot
                </button>
              </div>
            ))}
            {pilots.length === 0 && <div className="p-8 text-center text-slate-500 text-[14px]">No active pilots yet.</div>}
          </div>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden text-slate-800">
           <div className="p-6">
             <h3 className="text-[18px] font-semibold mb-2">Innovation Funnel</h3>
             <p className="text-slate-500 text-[14px] mb-6">End-to-end pipeline visibility</p>
             
             <div className="space-y-5">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[14px] text-slate-600">Challenges Published</span>
                    <span className="font-mono font-semibold text-slate-800">{stats?.challenges}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5"><div className="bg-slate-400 h-1.5 rounded-full w-[100%]"></div></div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[14px] text-slate-600">Eligible Startups</span>
                    <span className="font-mono font-semibold text-slate-800">{stats?.startups}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5"><div className="bg-[#1F3A5F] h-1.5 rounded-full w-[60%]"></div></div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[14px] text-slate-600">Pilots Selected</span>
                    <span className="font-mono font-semibold text-slate-800">{stats?.pilots}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5"><div className="bg-[#1F3A5F] h-1.5 rounded-full w-[30%]"></div></div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[14px] text-slate-600">Successful Pilots</span>
                    <span className="font-mono font-semibold text-slate-800">{stats?.successful_pilots}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5"><div className="bg-emerald-500 h-1.5 rounded-full w-[0%]"></div></div>
                </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
