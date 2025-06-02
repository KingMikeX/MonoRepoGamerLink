// 3. /components/TournamentCreation/Step1BasicInfo.jsx - Schritt 1: Grundinfo
import React, { useEffect, useState } from 'react';

// Hilfsfunktion
const getNowAsDatetimeLocal = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset()); // damit lokale Zeit korrekt ist
  return now.toISOString().slice(0, 16); // Format für datetime-local
};


const Step1BasicInfo = ({ formData, updateFormData, onNext }) => {
  const [gameSearchQuery, setGameSearchQuery] = useState('');

useEffect(() => {
  if (!formData.registrationStart || !formData.registrationEnd) {
    const today = new Date().toISOString().split('T')[0]; // Nur das Datum
    updateFormData({
      ...formData,
      registrationStart: today,
      registrationEnd: today,
    });
  }
}, []);
  
  const teamSizeOptions = [
    { id: '1v1', label: '1v1' , size: 1},
    { id: '2v2', label: '2v2' , size: 2},
    { id: '5v5', label: '5v5' , size: 5},
    { id: 'custom', label: 'CUSTOM' },
  ];
  
  const handleTeamSizeChange = (id) => {
    let size = 0;
    for (let option of teamSizeOptions) {
      if (option.id === id) {
        size = option.size;
        break;
      }
    }

    updateFormData({ 
      ...formData, 
      teamSize: size 
    });
  };
  
  return (
    <div className="bg-[#121428] mx-auto p-6 rounded-lg max-w-3xl">
      <h2 className="mb-6 text-[#FF4EF1] font-semibold border-b border-[#2E314A] text-xl uppercase">Turnierformat</h2>

      {/* Tournament Title */}
      <div className="mb-6">
        <label className="block text-xs text-white mb-2 uppercase">Turniername</label>
        <input
          type="text"
          placeholder="Tuniertitel eingeben"
          className="w-full bg-[#252641] px-3 py-2 rounded-md text-white placeholder-white"
          value={formData.title || ''}
          onChange={(e) =>
            updateFormData({ ...formData, title: e.target.value })
          }
        />
      </div>

      
      {/* Game Selection */}
      <div className="mb-6">
        <div className="flex items-center mb-2">
      <input
        type="text"
        placeholder="Spiel eingeben"
        className="w-full bg-[#252641] px-3 py-2 rounded-md text-white placeholder-white"
        value={formData.game || ""}
        onChange={(e) =>
          updateFormData({
            ...formData,
            game: e.target.value,
          })
        }
      />
        </div>

      </div>
      
      {/* Team Size */}
      <div className="grid grid-cols-2 gap-4 mt-4">
    <div>
      <label className="block text-xs text-white mb-2 uppercase">Spieler pro Team</label>
      <input
        type="number"
        min={1}
        className="w-full bg-[#252641] px-3 py-2 rounded-md text-white"
        value={formData.playersPerTeam || ''}
        onChange={(e) => {
          const size = parseInt(e.target.value) || 0;
          updateFormData({ 
            ...formData, 
            playersPerTeam: size,
            teamSize: `${size}v${size}` // z. B. "5v5"
          });
        }}

      />
    </div>
    <div>
      <label className="block text-xs text-white mb-2 uppercase">Anzahl Teams</label>
    <input
      type="number"
      min={2}
      className="w-full bg-[#252641] px-3 py-2 rounded-md text-white"
      value={formData.maxTeams || ''}
      onChange={(e) =>
        updateFormData({ ...formData, maxTeams: parseInt(e.target.value) || 0 })
      }
    />
    </div>
  </div>
 
      
      {/* Tournament Rules */}
      <div className="mb-6">
        <h2 className="mb-6 text-[#FF4EF1] font-semibold border-b border-[#2E314A] text-xl uppercase pt-6">Turnierregeln</h2>
        <div className="bg-[#252641] px-6 py-4 rounded-lg text-sm">
          <textarea
            className="p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 w-full h-32 bg-[#252641] text-white placeholder-white"
            placeholder="Gib hier deine Regeln ein ..."
            value={formData.rules || ""}
            onChange={(e) =>
              updateFormData({ ...formData, rules: e.target.value })
            }
          />
        </div>
      </div>

      
      {/* Participation Requirements */}
      <div className="mb-6">
        <h2 className="mb-6 text-[#FF4EF1] font-semibold border-b border-[#2E314A] text-xl uppercase">Teilnahmebedingungen</h2>
        
        <div className="gap-6 grid grid-cols-2 mb-6">
          {/* Registration Start */}
          <div>
            <h3 className="mb-2 font-semibold text-white text-xs uppercase">Anmeldung Start</h3>
            <div className="flex items-center">
              <input
                type="date"
                className="flex-1 bg-[#252641] p-3 rounded-lg text-white w-full"
                value={formData.registrationStart || ''}
                onChange={(e) => updateFormData({
                  ...formData,
                  registrationStart: e.target.value,
                })}
              />
            </div>
          </div>

          {/* Registration End */}
          <div>
            <h3 className="mb-2 font-semibold text-white text-xs uppercase">Anmeldung Ende</h3>
            <div className="flex items-center">
              <input
                type="date"
                className="flex-1 bg-[#252641] p-3 rounded-lg text-white w-full"
                value={formData.registrationEnd || ''}
                onChange={(e) => updateFormData({
                  ...formData,
                  registrationEnd: e.target.value,
                })}
              />
            </div>
          </div>
        </div>

        {/* Entry Fee */}
        <div className="mb-6">
          <h3 className="mb-2 font-semibold text-white text-xs uppercase">Teilnahmegebühr</h3>
          <div className="flex items-center">
            <input
              type="number"
              min={0}
              className="bg-[#252641] p-3 rounded-lg text-white w-full"
              value={formData.entryFee ?? ''}
              onChange={(e) =>
                updateFormData({
                  ...formData,
                  entryFee: e.target.value === '' ? '' : parseFloat(e.target.value),
                })
              }
            />
          </div>
        </div>
      </div>

        
        {/* Participation Options */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center">
            <input 
              type="checkbox" 
              id="publicTournament" 
              className="hidden" 
              checked={formData.isPublic}
              onChange={() => updateFormData({ 
                ...formData, 
                isPublic: !formData.isPublic 
              })}
            />
            <label htmlFor="publicTournament" className="flex items-center cursor-pointer">
              <div className={`w-10 h-5 flex items-center rounded-full p-1 ${formData.isPublic ? 'bg-[#dd17c9]' : 'bg-gray-700'}`}>
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${formData.isPublic ? 'translate-x-5' : ''}`}></div>
              </div>
              <span className="ml-3 text-sm">ÖFFENTLICHES TURNIER (jeder kann teilnehmen)</span>
            </label>
          </div>
          
          <div className="flex items-center">
            <input 
              type="checkbox" 
              id="inviteOnly" 
              className="hidden" 
              checked={formData.inviteOnly}
              onChange={() => updateFormData({ 
                ...formData, 
                inviteOnly: !formData.inviteOnly 
              })}
            />
            <label htmlFor="inviteOnly" className="flex items-center cursor-pointer">
              <div className="flex justify-center items-center mr-3 border border-gray-400 rounded-full w-5 h-5">
                {formData.inviteOnly && <div className="bg-white rounded-full w-3 h-3"></div>}
              </div>
              <span className="text-sm">AUF EINLADUNG (nur eingeladene Spieler können teilnehmen)</span>
            </label>
          </div>
          
          <div className="flex items-center">
            <input 
              type="checkbox" 
              id="checkInRequired" 
              className="hidden" 
              checked={formData.checkInRequired}
              onChange={() => updateFormData({ 
                ...formData, 
                checkInRequired: !formData.checkInRequired 
              })}
            />
            <label htmlFor="checkInRequired" className="flex items-center cursor-pointer">
              <div className={`w-10 h-5 flex items-center rounded-full p-1 ${formData.checkInRequired ? 'bg-[#dd17c9]' : 'bg-gray-700'}`}>
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${formData.checkInRequired ? 'translate-x-5' : ''}`}></div>
              </div>
              <span className="ml-3 text-sm">CHECK-IN ERFORDERLICH (Spieler müssen vor dem Turnier einchecken)</span>
            </label>
          </div>
        </div>
    

      
      {/* Navigation */}
      <div className="flex justify-end">
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


export default Step1BasicInfo;