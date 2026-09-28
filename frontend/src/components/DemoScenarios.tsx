import React from 'react';
import { useNavigate } from 'react-router-dom';

const DemoScenarios = ({ setContext }: any) => {
  const navigate = useNavigate();

  const scenarios = [
    {
      label: 'Dairy Entrepreneur',
      data: { name: 'Ramesh Kumar', state: 'Haryana', district: 'Sonipat', income: 250000, margin: 50000, purpose: 'Dairy Farm setup', category: 'dairy', projectCost: 500000 }
    },
    {
      label: 'Retail Business (Micro)',
      data: { name: 'Sunita Devi', state: 'Delhi', district: 'New Delhi', income: 150000, margin: 10000, purpose: 'Kirana Store', category: 'retail', projectCost: 100000 }
    },
    {
      label: 'Education Loan',
      data: { name: 'Amit Singh', state: 'Delhi', district: 'South Delhi', income: 300000, margin: 150000, purpose: 'B.Tech Tuition', category: 'education', projectCost: 1500000 }
    },
    {
      label: 'Income > 5L (Ineligible)',
      data: { name: 'Rajesh Gupta', state: 'UP', district: 'Noida', income: 600000, margin: 200000, purpose: 'Manufacturing unit', category: 'manufacturing', projectCost: 2000000 }
    }
  ];

  const loadScenario = (data: any) => {
    setContext({ applicant: data, assessmentResult: null, selectedPartner: null, applicationId: null });
    navigate('/profile');
  };

  return (
    <div className="relative group">
      <button className="text-sm bg-yellow-400 text-yellow-900 px-3 py-1 rounded font-bold hover:bg-yellow-500">
        Demo Scenarios
      </button>
      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl border border-gray-200 hidden group-hover:block z-50">
        <ul className="py-1">
          {scenarios.map((s, idx) => (
            <li key={idx}>
              <button 
                onClick={() => loadScenario(s.data)}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-primary transition-colors"
              >
                {s.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DemoScenarios;
