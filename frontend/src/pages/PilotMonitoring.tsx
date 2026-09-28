import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPilots } from '../api';
import { Lock, ArrowLeft, Activity, Download, FileText, CheckCircle2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import LifecycleIndicator from '../components/LifecycleIndicator';

const PilotMonitoring = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pilot, setPilot] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getPilots().then(data => {
      setPilot((data || []).find((p: any) => p.id === Number(id)));
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setError(true);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="p-8">Loading pilot data...</div>;
  if (error || !pilot) return <div className="p-8 text-red-600">Failed to load pilot.</div>;

  const kpi = pilot.kpis[0];
  
  const chartData = [
    { day: 'Day 1', value: kpi.baseline },
    { day: 'Day 15', value: 68 },
    { day: 'Day 30', value: 62 },
    { day: 'Day 45', value: 54 },
    { day: 'Day 60', value: 49 },
    { day: 'Day 90', value: kpi.current },
  ];

  const criticalRisksCount = pilot.risks.filter((r: any) => r.severity === 'CRITICAL' && r.status !== 'RESOLVED' && r.status !== 'MITIGATED').length;
  const highRisksCount = pilot.risks.filter((r: any) => r.severity === 'HIGH' && r.status !== 'RESOLVED' && r.status !== 'MITIGATED').length;
  const unresolvedRisksCount = pilot.risks.filter((r: any) => r.status !== 'RESOLVED' && r.status !== 'MITIGATED').length;

  let riskColor = 'emerald';
  let riskText = 'GREEN';
  if (criticalRisksCount > 0) {
    riskColor = 'red'; riskText = 'RED';
  } else if (unresolvedRisksCount > 0) {
    riskColor = 'amber'; riskText = 'AMBER';
  }

  const handleDemoSimulate = async (action: string) => {
     await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8001/api'}/pilots/${pilot.id}/demo-simulate`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({action})
     });
     window.location.reload();
  };

  const achievementPct = ((kpi.baseline - kpi.current) / kpi.baseline * 100).toFixed(1);

  return (
    <div className="pb-12">
      <LifecycleIndicator currentStep="PILOT" />
      <div className="flex justify-between items-end mb-8">
        <div>
          <button onClick={() => navigate('/pilots')} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-4 font-medium text-[14px]">
            <ArrowLeft size={16}/> Back to Pilots
          </button>
          <h1 className="text-[28px] font-semibold text-slate-800">{pilot.application?.startup?.name} Pilot</h1>
          <p className="text-[15px] text-slate-600 font-medium mt-1">{pilot.application?.challenge?.department?.name}</p>
        </div>
        <div className="flex gap-3">
           <button className="px-4 py-2 bg-white border border-slate-300 text-slate-700 font-medium text-[14px] rounded-md hover:bg-slate-50 flex items-center gap-2 transition">
             <FileText size={16}/> Upload Evidence
           </button>
           <button onClick={() => navigate('/validation')} className="px-6 py-2 bg-[#1F3A5F] text-white rounded-md font-medium text-[14px] hover:bg-slate-800 transition">
             Request Validation
           </button>
        </div>
      </div>

      {/* PILOT EXPERIMENT DESIGN */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-6 overflow-hidden">
         <div className="flex items-center px-6 py-4 border-b border-slate-200">
           <h2 className="text-[16px] font-semibold text-slate-800 flex items-center gap-2">
             Pilot Experiment Design
           </h2>
           {pilot.charter_locked_at && (
             <span className="text-[12px] font-medium text-slate-500 flex items-center gap-1 ml-4 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded" title={pilot.charter_hash}>
               <Lock size={12}/> Charter locked on {new Date(pilot.charter_locked_at).toLocaleDateString()}
             </span>
           )}
           <div className="text-[13px] text-slate-500 ml-auto">
             Demonstration Configuration
           </div>
         </div>
         
         <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-200">
           {/* Left Column: Hypothesis & KPIs */}
           <div className="p-6 md:w-3/5 space-y-6">
             <div>
               <h3 className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Hypothesis</h3>
               <p className="text-[14px] font-medium text-slate-800">
                 "Deploying QueueAI in selected hospital OPDs will reduce average patient waiting time without materially increasing staff workload or compromising operational safety."
               </p>
             </div>
             
             <div>
               <h3 className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Key Performance Indicators</h3>
               <table className="w-full text-left text-[13px]">
                 <thead className="bg-slate-50 border-y border-slate-200 text-[12px] uppercase text-slate-500">
                   <tr>
                     <th className="px-3 py-2 font-semibold">KPI</th>
                     <th className="px-3 py-2 font-semibold text-right">Baseline</th>
                     <th className="px-3 py-2 font-semibold text-right">Target</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100 text-slate-700">
                   {pilot.kpis.map((k: any, i: number) => (
                       <tr key={k.id}>
                         <td className="px-3 py-2 font-medium flex items-center gap-2">
                            {i === 0 ? <span className="w-2 h-2 rounded-full bg-blue-500"></span> : <span className="w-2 h-2 rounded-full bg-slate-300"></span>}
                            {k.name}
                         </td>
                         <td className="px-3 py-2 font-mono text-right">{k.baseline} {k.unit}</td>
                         <td className="px-3 py-2 font-mono font-semibold text-[#1F3A5F] text-right">{k.name === 'System Availability' ? '>=' : '<='}{k.target} {k.unit}</td>
                       </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           </div>
           
           {/* Right Column: Criteria */}
           <div className="p-6 md:w-2/5 flex flex-col justify-center">
             <h3 className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-3">Evaluation Criteria</h3>
             <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden">
               <div className="p-4 bg-white border-l-4 border-l-emerald-500">
                 <h4 className="text-[13px] font-bold text-slate-800 mb-1">Success Criteria</h4>
                 <p className="text-[13px] text-slate-600">
                   Primary KPI achieves &lt;=52 minutes AND no secondary KPI breaches its defined safety/operational threshold.
                 </p>
               </div>
               <div className="p-4 bg-white border-l-4 border-l-amber-500">
                 <h4 className="text-[13px] font-bold text-slate-800 mb-1">Partial / Inconclusive</h4>
                 <p className="text-[13px] text-slate-600">
                   Primary KPI improves but does not meet the success target, while no critical safety or operational threshold is breached.
                 </p>
               </div>
               <div className="p-4 bg-white border-l-4 border-l-red-500">
                 <h4 className="text-[13px] font-bold text-slate-800 mb-1">Failure Criteria</h4>
                 <p className="text-[13px] text-slate-600">
                   Primary KPI remains above 65 minutes OR a critical operational/safety threshold is breached.
                 </p>
               </div>
             </div>
           </div>
         </div>
      </div>

            {/* Health Score & Status Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6 flex justify-between items-center">
         <div className="flex items-center gap-6">
           <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${pilot.status === 'COMPLETED' ? 'bg-emerald-50 border-emerald-200' : 'bg-blue-50 border-blue-200'}`}>
             <Activity size={24} className={pilot.status === 'COMPLETED' ? 'text-emerald-600' : 'text-blue-600'} />
           </div>
           <div>
             <div className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Overall Health</div>
             <div className={`text-[20px] font-bold ${pilot.status === 'COMPLETED' ? 'text-emerald-600' : 'text-blue-600'}`}>{pilot.status}</div>
           </div>
         </div>
         
         <div className="flex gap-10 text-[14px]">
           <div>
             <div className="text-slate-500 font-medium mb-1">KPI Performance</div>
             <div className={`font-semibold flex items-center gap-1.5 ${kpi.current <= kpi.target ? 'text-emerald-600' : kpi.current > (kpi.failure_threshold || 65) ? 'text-red-600' : 'text-amber-600'}`}>
               <CheckCircle2 size={16}/> {kpi.current <= kpi.target ? 'GREEN' : kpi.current > (kpi.failure_threshold || 65) ? 'RED' : 'AMBER'}
             </div>
           </div>
           <div>
             <div className="text-slate-500 font-medium mb-1">Milestones</div>
             <div className={`font-semibold flex items-center gap-1.5 ${pilot.milestones.every((m:any) => m.status === 'COMPLETED') ? 'text-emerald-600' : 'text-blue-600'}`}>
               {pilot.milestones.every((m:any) => m.status === 'COMPLETED') ? <CheckCircle2 size={16}/> : null} 
               {pilot.milestones.every((m:any) => m.status === 'COMPLETED') ? 'COMPLETED' : 'IN PROGRESS'}
             </div>
           </div>
           <div>
             <div className="text-slate-500 font-medium mb-1">Risks</div>
             <div className={`font-semibold text-${riskColor}-600 flex items-center gap-1.5`}>
                {riskText === 'GREEN' ? <CheckCircle2 size={16}/> : null} {riskText}
             </div>
           </div>
         </div>
         
         <div className="text-right border-l border-slate-200 pl-6">
           <div className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Pilot Progress</div>
           <div className="text-[20px] font-bold text-slate-800">Day {pilot.status === 'COMPLETED' ? pilot.duration_days : 45} <span className="text-[14px] font-medium text-slate-500">/ {pilot.duration_days}</span></div>
         </div>
      </div>

      {/* DEMO CONTROLS */}
      <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg mb-6 flex items-center justify-between">
         <div className="text-[14px] font-semibold text-slate-700 flex items-center gap-2">
           <span>Demo controls (simulation)</span>
         </div>
         <div className="flex gap-2">
            <button onClick={() => handleDemoSimulate('46')} className="px-3 py-1.5 bg-white border border-slate-300 rounded text-[13px] font-medium text-slate-700 hover:bg-slate-100">46 min (Success)</button>
            <button onClick={() => handleDemoSimulate('60')} className="px-3 py-1.5 bg-white border border-slate-300 rounded text-[13px] font-medium text-slate-700 hover:bg-slate-100">60 min (Partial)</button>
            <button onClick={() => handleDemoSimulate('66')} className="px-3 py-1.5 bg-white border border-slate-300 rounded text-[13px] font-medium text-slate-700 hover:bg-slate-100">66 min (Failed)</button>
            <button onClick={() => handleDemoSimulate('60_critical')} className="px-3 py-1.5 bg-white border border-slate-300 rounded text-[13px] font-medium text-slate-700 hover:bg-slate-100">60 min + Critical Risk</button>
            <button onClick={() => handleDemoSimulate('reset')} className="px-3 py-1.5 bg-slate-800 text-white rounded text-[13px] font-medium hover:bg-slate-900 ml-4">Reset</button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center justify-between">
              Primary KPI Telemetry
              <div className="flex items-center gap-4 text-sm font-normal">
                <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#1F3A5F]"></div> Actual</span>
                <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500"></div> Target</span>
              </div>
            </h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0"/>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 13}} dy={10}/>
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 13}} domain={[40, 80]}/>
                  <Tooltip 
                    contentStyle={{borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)'}}
                    formatter={(value: any) => [`${value} min`, 'Waiting Time']}
                  />
                  <ReferenceLine y={kpi.target} stroke="#10b981" strokeDasharray="5 5" label={{position: 'insideBottomRight', value: `Target ${kpi.target}`, fill: '#10b981', fontSize: 12}} />
                  {kpi.failure_threshold && <ReferenceLine y={kpi.failure_threshold} stroke="#ef4444" strokeDasharray="5 5" label={{position: 'insideTopRight', value: `Failure threshold ${kpi.failure_threshold}`, fill: '#ef4444', fontSize: 12}} />}
                  <Line type="monotone" dataKey="value" stroke="#1F3A5F" strokeWidth={3} dot={{r: 4, fill: '#1F3A5F', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden mt-6">
            <h2 className="text-lg font-bold text-slate-800 p-6 border-b border-slate-100">Deployment & Milestones</h2>
            <table className="w-full text-left text-[14px]">
               <thead className="bg-slate-50 border-b border-slate-200 text-[12px] uppercase text-slate-500">
                 <tr>
                   <th className="px-6 py-3 font-semibold">Milestone</th>
                   <th className="px-6 py-3 font-semibold">State</th>
                   <th className="px-6 py-3 font-semibold text-right">Payment</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 text-slate-700">
                 {pilot.milestones.map((m: any) => (
                   <tr key={m.id}>
                     <td className="px-6 py-4 font-medium">{m.title}</td>
                     <td className="px-6 py-4">
                        <span className={`text-[12px] font-semibold px-2 py-0.5 rounded border uppercase tracking-wider ${
                           m.status === 'COMPLETED' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-slate-200 bg-slate-50 text-slate-600'
                         }`}>{m.status}</span>
                     </td>
                     <td className="px-6 py-4 text-right">
                        <span className={`text-[12px] font-semibold px-2 py-0.5 rounded border uppercase tracking-wider ${
                           m.payment_status === 'RELEASED' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 
                           m.payment_status === 'PENDING' ? 'border-amber-200 bg-amber-50 text-amber-800' : 'border-slate-200 bg-slate-50 text-slate-600'
                         }`}>{m.payment_status || 'LOCKED'}</span>
                     </td>
                   </tr>
                 ))}
               </tbody>
            </table>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden mt-6">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800">Data Quality Audit</h2>
              <span className="text-emerald-700 bg-emerald-50 px-3 py-1 rounded text-[12px] font-bold border border-emerald-200 flex items-center gap-1"><CheckCircle2 size={14}/> PASSED</span>
            </div>
            <div className="p-6 text-[14px] text-slate-700 flex flex-col gap-3">
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="font-medium">Continuous Telemetry Uptime</span>
                <span className="font-mono">99.98%</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="font-medium">Data Consistency Checks</span>
                <span className="font-mono text-emerald-600">0 anomalies</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="font-medium">Charter Integrity Check</span>
                <span className="font-mono text-emerald-600">HASH MATCHED</span>
              </div>
            </div>
          </div>

        </div>
        
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <h2 className="text-lg font-bold text-slate-800 p-6 border-b border-slate-100">Live Risk Register</h2>
            <div className="divide-y divide-slate-100">
              {pilot.risks.map((r: any) => (
                <div key={r.id} className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[12px] font-semibold px-2 py-0.5 rounded border uppercase tracking-wider ${
                      r.status === 'MITIGATED' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' :
                      r.status === 'RESOLVED' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' :
                      r.severity === 'CRITICAL' ? 'border-red-200 bg-red-50 text-red-800' :
                      r.severity === 'HIGH' ? 'border-orange-200 bg-orange-50 text-orange-800' :
                      'border-amber-200 bg-amber-50 text-amber-800'
                    }`}>
                      {r.severity} - {r.status}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm mb-1">{r.description}</h3>
                  <p className="text-slate-500 text-xs line-clamp-2">Mitigation: {r.mitigation}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden mt-6">
            <h2 className="text-lg font-bold text-slate-800 p-6 border-b border-slate-100">Deployment Sites</h2>
            <div className="p-6 flex flex-col gap-4">
               <div className="flex justify-between items-center">
                 <div>
                   <div className="font-semibold text-slate-800 text-[14px]">Pune General Hospital</div>
                   <div className="text-[13px] text-slate-500">Node A (OPD Triage)</div>
                 </div>
                 <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm border border-emerald-200"></span>
               </div>
               <div className="flex justify-between items-center">
                 <div>
                   <div className="font-semibold text-slate-800 text-[14px]">Nagpur District Hospital</div>
                   <div className="text-[13px] text-slate-500">Node B (OPD Triage)</div>
                 </div>
                 <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm border border-emerald-200"></span>
               </div>
               <div className="flex justify-between items-center">
                 <div>
                   <div className="font-semibold text-slate-800 text-[14px]">Nashik Civil Hospital</div>
                   <div className="text-[13px] text-slate-500">Node C (OPD Triage)</div>
                 </div>
                 <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm border border-emerald-200"></span>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PilotMonitoring;
