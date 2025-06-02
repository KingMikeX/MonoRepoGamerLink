// 2. /components/TournamentCreation/ProgressBar.jsx - Fortschrittsbalken für die Schritte

import React from 'react';

const ProgressBar = ({ currentStep }) => {
  const steps = [
    { id: 1, name: 'GRUNDINFO' },
    { id: 2, name: 'ZEITPLAN' },
    { id: 3, name: 'PREISE' },
    { id: 4, name: 'BESTÄTIGEN' },
  ];
  
  return (
    <div className="mx-auto mb-6 w-full max-w-3xl">
      <div className="flex justify-between z-0">
        {steps.map((step) => (
          <div 
            key={step.id} 
            className={`flex-1 text-center relative z-10 ${
              step.id < currentStep ? 'text-gray-300' : 
              step.id === currentStep ? 'text-white' : 
              'text-gray-500'
            }`}
          >
            <div className="flex flex-col items-center z-10">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 z-10 ${
                step.id < currentStep ? 'bg-[#dd17c9] text-white' : 
                step.id === currentStep ? 'bg-[#dd17c9] text-white' : 
                'bg-gray-700 text-gray-400'
              }`}>
                {step.id}
              </div>
              <div className="font-medium text-xs">{step.name}</div>
            </div>
            
            {/* Progress line */}
            {step.id < steps.length && (
              <div className="top-4 left-0 absolute w-full h-0.5 left-1/2 -translate-x-0 transform z-0">
                <div 
                  className={`w-full h-full ${
                    step.id < currentStep ? 'bg-[#dd17c9]' : 'bg-gray-700'
                  }`} 
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;