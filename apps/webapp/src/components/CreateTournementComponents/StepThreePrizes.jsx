// 5. /components/TournamentCreation/Step3Prizes.jsx - Schritt 3: Preise
import React, { useState, useEffect } from 'react';

const Step3Prizes = ({ formData, updateFormData, onBack, onNext }) => {
  const [prizeType, setPrizeType] = useState(formData.prizeType || 'none');

useEffect(() => {
  if (prizeType === 'none') {
    updateFormData({ ...formData, prizeType, prizes: [] }); // Preise leeren
  } else {
    updateFormData({ ...formData, prizeType });
  }
}, [prizeType]);


  const handleAddPrize = () => {
    const newPrize = {
      id: Date.now(),
      place: (formData.prizes?.length || 0) + 1,
      name: '',
      description: ''
    };
    updateFormData({
      ...formData,
      prizes: [...(formData.prizes || []), newPrize]
    });
  };

  const handlePrizeChange = (index, key, value) => {
    const updatedPrizes = [...formData.prizes];
    updatedPrizes[index][key] = value;
    updateFormData({ ...formData, prizes: updatedPrizes });
  };

  const handleRemovePrize = (index) => {
    const updatedPrizes = [...formData.prizes];
    updatedPrizes.splice(index, 1);
    updateFormData({ ...formData, prizes: updatedPrizes });
  };

  return (
    <div className="bg-[#121428] mx-auto p-6 rounded-lg max-w-3xl">
      <h2 className="mb-6 text-[#FF4EF1] font-semibold border-b border-[#2E314A] text-xl uppercase">Turnierpreise</h2>

      {/* Prize Type Selection */}
      <div className="flex space-x-6 mb-6">
        {['physical', 'money', 'none'].map(type => (
          <div 
            key={type}
            className={`cursor-pointer pb-3 flex-1 text-center ${prizeType === type ? 'text-[#FF4EF1] border-b-2 border-[#FF4EF1]' : 'text-white'}`}
            onClick={() => {
              if (type !== prizeType) {
                // Wenn sich der Typ ändert, Preise leeren
                updateFormData({ ...formData, prizeType: type, prizes: [] });
                setPrizeType(type);
              }
            }}
          >
            <div className="font-semibold uppercase">
              {type === 'physical' ? 'Sachpreise' : type === 'money' ? 'Geldpreise' : 'Keine Preise'}
            </div>
            <div className="mt-1 text-xs">
              {type === 'physical' && 'Gegenstände als Preise'}
              {type === 'money' && 'Bargeld oder Gutscheine'}
              {type === 'none' && 'Nur für den Spaß'}
            </div>
          </div>
        ))}
      </div>

      {/* Prize List */}
      {prizeType !== 'none' && (
        <>
          <h3 className="mb-4 font-semibold text-sm uppercase">Preise</h3>
          <div className="space-y-4 mb-6">
            {(formData.prizes || []).map((prize, index) => (
              <div key={prize.id} className="bg-[#252641] p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <span className="mr-3 font-bold text-[#FF4EF1] text-xl">{index + 1}.</span>
                  <input
                    type="text"
                    className="flex-1 bg-transparent outline-none text-white placeholder-white"
                    placeholder={`Platz ${index + 1} – Titel`}
                    value={prize.name}
                    onChange={(e) => handlePrizeChange(index, 'name', e.target.value)}
                  />
                  <button
                    className="ml-4 text-sm text-red-400 hover:underline"
                    onClick={() => handleRemovePrize(index)}
                  >
                    Entfernen
                  </button>
                </div>
                <div className="pl-7">
                  <input
                    type="text"
                    className="bg-transparent outline-none w-full text-white text-sm placeholder-white"
                    placeholder="Beschreibung (optional)"
                    value={prize.description}
                    onChange={(e) => handlePrizeChange(index, 'description', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>

          <button 
            className="bg-[#dd17c9] hover:bg-[#aa0d9d] mb-6 py-3 rounded-lg w-full font-semibold text-white"
            onClick={handleAddPrize}
          >
            + WEITERE PREISE HINZUFÜGEN
          </button>
        </>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-lg font-semibold text-white"
        >
          ZURÜCK
        </button>
        <button
          onClick={onNext}
          className="bg-[#dd17c9] hover:bg-[#aa0d9d] px-6 py-2 rounded-lg font-semibold text-white"
        >
          WEITER
        </button>
      </div>
    </div>
  );
};

export default Step3Prizes;
