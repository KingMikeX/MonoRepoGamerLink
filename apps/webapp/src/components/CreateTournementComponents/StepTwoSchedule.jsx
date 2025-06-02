// 4. /components/TournamentCreation/Step2Schedule.jsx - Schritt 2: Zeitplan
import React, { useState, useEffect } from 'react';

const Step2Schedule = ({ formData, updateFormData, onBack, onNext }) => {
  const [showAddRound, setShowAddRound] = useState(false);
  const [rounds, setRounds] = useState([]);

useEffect(() => {
  if (
    formData.autoRounds &&
    formData.startDate &&
    formData.startTime &&
    formData.matchDuration &&
    formData.breakDuration &&
    formData.maxTeams &&
    formData.tournamentMode
  ) {
    const totalTeams = parseInt(formData.maxTeams);
    const matchDuration = parseInt(formData.matchDuration);
    const breakDuration = parseInt(formData.breakDuration);
    const mode = formData.tournamentMode;

    let roundsList = [];
    let currentTime = new Date(`${formData.startDate}T${formData.startTime}`);

    if (mode === 'singleElimination') {
      const totalRounds = Math.ceil(Math.log2(totalTeams));
      for (let i = 0; i < totalRounds; i++) {
        const roundName = `Runde ${i + 1}`;
        const matches = Math.ceil(totalTeams / Math.pow(2, i + 1));
        const format = i < totalRounds - 1 ? 'Best-of-1' : 'Best-of-3';
        const time = currentTime.toTimeString().slice(0, 5);

        roundsList.push({ name: roundName, time, matches, format });
        currentTime.setMinutes(currentTime.getMinutes() + matchDuration + breakDuration);
      }
    }

    else if (mode === 'roundRobin') {
      const totalRounds = totalTeams - 1;
      const matchesPerRound = Math.floor(totalTeams / 2);

      for (let i = 0; i < totalRounds; i++) {
        const roundName = `Spieltag ${i + 1}`;
        const time = currentTime.toTimeString().slice(0, 5);
        roundsList.push({
          name: roundName,
          time,
          matches: matchesPerRound,
          format: 'Best-of-1',
        });
        currentTime.setMinutes(currentTime.getMinutes() + matchDuration + breakDuration);
      }
    }

    else if (mode === 'groupPhase') {
      const teamsPerGroup = 4;
      const numberOfGroups = Math.ceil(totalTeams / teamsPerGroup);

      for (let group = 0; group < numberOfGroups; group++) {
        const matchesPerGroup = 6; // Jeder gegen jeden in 4er-Gruppe = 6 Spiele
        const roundName = `Gruppe ${String.fromCharCode(65 + group)}`;
        const time = currentTime.toTimeString().slice(0, 5);

        roundsList.push({
          name: roundName,
          time,
          matches: matchesPerGroup,
          format: 'Best-of-1',
        });

        currentTime.setMinutes(currentTime.getMinutes() + matchDuration + breakDuration);
      }

      // Optional: Finalrunde hinzufügen
      roundsList.push({
        name: 'Finalrunde',
        time: currentTime.toTimeString().slice(0, 5),
        matches: numberOfGroups,
        format: 'Best-of-3',
      });
    }

    setRounds(roundsList);
  }
}, [formData]);



  
  return (
    <div className="bg-[#121428] mx-auto p-6 rounded-lg max-w-3xl">
      <h2 className="mb-6 text-[#FF4EF1] font-semibold border-b border-[#2E314A] text-xl uppercase">Zeitplan</h2>

      {/* Ligasystem Auswahl */}
      <div className="mb-6">
        <h4 className="mb-2 font-semibold text-white text-xs uppercase">Ligasystem</h4>
        <select
          className="w-full bg-[#252641] text-white p-3 rounded-lg"
          value={formData.tournamentMode || ''}
          onChange={(e) =>
            updateFormData({ ...formData, tournamentMode: e.target.value })
          }
        >
          <option value="">Bitte wählen…</option>
          <option value="singleElimination">K.O.-System</option>
          <option value="roundRobin">Jeder gegen Jeden</option>
        </select>
      </div>
      
      {/* Main Tournament */}
      <div className="mb-8">
        
        <div className="gap-6 grid grid-cols-2 mb-6">
      {/* Start Date */}
      <div>
        <h4 className="mb-2 font-semibold text-white text-xs uppercase">Startdatum</h4>
        <div className="flex items-center">
          <div className="flex-1">
            <input
              type="date"
              className="w-full bg-[#252641] text-white p-3 rounded-lg" // <<< appearance-none entfernt
              value={formData.startDate || ''}
              onChange={(e) => updateFormData({ ...formData, startDate: e.target.value })}
            />
          </div>
        </div>
      </div>


                
      {/* Start Time */}
      <div>
        <h4 className="mb-2 font-semibold text-white text-xs uppercase">Startzeit</h4>
        <div className="flex items-center">
          <div className="flex-1 relative">
            <input
              type="time"
              className="w-full bg-[#252641] text-white p-3 pr-10 rounded-lg appearance-none"
              value={formData.startTime || ''}
              onChange={(e) => updateFormData({ ...formData, startTime: e.target.value })}
            />
            <span className="absolute right-3 top-3.5 text-white pointer-events-none">🕒</span>
          </div>
        </div>
      </div>

        
      {/* Time Zone */}
      <div className="mb-6">
        <h4 className="mb-2 font-semibold text-white text-xs uppercase">Zeitzone</h4>
        <div className="flex items-center">
          <select
            className="flex-1 bg-[#252641] text-white p-3 rounded-lg"
            value={formData.timezone || 'CET'}
            onChange={(e) => updateFormData({ ...formData, timezone: e.target.value })}
          >
            <option value="CET">Mitteleuropäische Zeit (CET)</option>
            <option value="CEST">Mitteleuropäische Sommerzeit (CEST)</option>
            <option value="UTC">Koordinierte Weltzeit (UTC)</option>
            <option value="PST">Pacific Standard Time (PST)</option>
            <option value="EST">Eastern Standard Time (EST)</option>
          </select>
        </div>
      </div>
      </div>
        
      {/* Auto Round Creation */}
      <div className="mb-6">
        <div className="flex items-center">
          <input 
            type="checkbox" 
            id="autoRounds" 
            className="hidden" 
            checked={formData.autoRounds}
            onChange={() => updateFormData({
              ...formData,
              autoRounds: !formData.autoRounds
            })}
          />
          <label htmlFor="autoRounds" className="flex items-center cursor-pointer">
            <div className={`w-10 h-5 flex items-center rounded-full p-1 ${formData.autoRounds ? 'bg-[#dd17c9]' : 'bg-gray-700'}`}>
              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${formData.autoRounds ? 'translate-x-5' : ''}`}></div>
            </div>
            <span className="ml-3 text-sm">AUTOMATISCHE RUNDENERSTELLUNG</span>
          </label>
        </div>
      </div>

      {/* Match Duration */}
      <div className="mb-6">
        <h4 className="mb-2 font-semibold text-white text-xs uppercase">Match-Dauer (Minuten)</h4>
        <input
          type="number"
          min={1}
          className="w-full bg-[#252641] text-white p-3 rounded-lg"
          placeholder="30"
          value={formData.matchDuration || ''}
          onChange={(e) => updateFormData({ ...formData, matchDuration: parseInt(e.target.value) || '' })}
        />
      </div>

      {/* Break Between Rounds */}
      <div className="mb-6">
        <h4 className="mb-2 font-semibold text-white text-xs uppercase">Pause zwischen Runden (Minuten)</h4>
        <input
          type="number"
          min={0}
          className="w-full bg-[#252641] text-white p-3 rounded-lg"
          placeholder="15"
          value={formData.breakDuration || ''}
          onChange={(e) => updateFormData({ ...formData, breakDuration: parseInt(e.target.value) || '' })}
        />
      </div>
    </div>
      
      {/* Round Schedule */}
      <div className="mb-8">
        <h3 className="mb-6 text-[#FF4EF1] font-semibold border-b border-[#2E314A] text-xl uppercase">Runden-Zeitplan</h3>
        
      {/* Dynamische Rundenanzeige */}
      <div className="space-y-6">
      {rounds.map((round, index) => (
        <div key={index} className="bg-[#252641] rounded-lg overflow-hidden text-sm">
          <div className="flex justify-between items-center bg-[#dd17c9] px-4 py-3">
            <h4 className="font-semibold uppercase">{round.name}</h4>
            <div className="font-semibold">{formData.startDate}, {round.time}</div>
          </div>

          <div className="font-semibold flex justify-between items-center px-4 py-3">
            <div>Matches: {round.matches}</div>
            <div>Format: {round.format}</div>
          </div>
        </div>

      ))}
      </div>
      </div>





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

export default Step2Schedule;