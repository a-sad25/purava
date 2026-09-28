import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

const Settings = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Settings / Prototype Info</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8">
         <div className="flex items-start gap-4">
           <div className="p-3 bg-blue-100 text-blue-600 rounded-full shrink-0">
             <ShieldCheck size={32} />
           </div>
           <div>
             <h2 className="text-xl font-bold text-slate-800 mb-2">Prototype Disclosure</h2>
             <p className="text-slate-600 leading-relaxed">
               <strong>PURAVA</strong> is a Smart India Hackathon prototype demonstrating a structured innovation-procurement workflow. Data shown in the demonstration environment may be simulated. The platform does not constitute legal advice, procurement authorization, certification, or a live government procurement system.
             </p>
           </div>
         </div>
      </div>
      
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-8">
         <div className="flex items-center gap-3 mb-4">
           <AlertTriangle className="text-orange-600" size={24}/>
           <h2 className="text-xl font-bold text-orange-900">Demonstration Mode</h2>
         </div>
         <p className="text-orange-800 mb-4">
           This system is running with the "Featured Maharashtra Health Pilot" loaded. The QueueAI scenario is completely fictional and is used solely to demonstrate the end-to-end functionality of the platform.
         </p>
         <button className="px-6 py-2 bg-white border border-orange-300 text-orange-700 font-bold rounded shadow-sm hover:bg-orange-100">
           Reset Demo Database
         </button>
      </div>
    </div>
  );
};

export default Settings;
