// 6. /components/TournamentCreation/Step4Confirmation.jsx - Schritt 4: Bestätigung
import React from 'react';

const Step4Confirmation = ({ formData, onBack, onSubmit }) => {

  const Info = ({ label, value }) => (
  <div className="flex flex-col">
    <label className="text-white text-sm">{label}</label>
    <div className="bg-[#252641] mt-1 px-3 py-2 rounded text-white">{value}</div>
  </div>
);

const Tag = ({ label }) => (
  <div className="bg-[#252641] text-white mt-1 px-3 py-2 rounded uppercase">{label}</div>
);


  return (
        <div className="bg-[#121428] mx-auto p-6 rounded-lg max-w-3xl">
      <h2 className="mb-6 text-[#FF4EF1] font-semibold border-b border-[#2E314A] text-xl uppercase">Turnierbestätigung</h2>

      {/* Quick Info */}
      <div className="flex justify-around items-center bg-[#252641] mb-6 px-4 py-3 rounded-lg">
        <span className="text-white">{formData.game}</span>
        <span className="text-white">{formData.teamSize}</span>
        <span className="text-white">{formData.tournamentMode?.replace(/([A-Z])/g, ' $1').toUpperCase()}</span>
        <span className="text-white">{formData.startDate}</span>
        <span className="text-white">{formData.startTime}</span>
      </div>

      {/* Tournament Info */}
      <div className="bg-[#dd17c9] px-4 py-3 text-white mb-4 rounded-lg">
        <h3 className="font-bold text-xl">{formData.title}</h3>
        <p className="text-sm">Max Teams: {formData.maxTeams}</p>
      </div>

      {/* Grundinfos */}
      <div className="mb-8">
        <h3 className="mb-6 text-[#FF4EF1] font-semibold border-b border-[#2E314A] pt-6 text-xl uppercase">Grundinformationen</h3>
        <div className="gap-4 grid grid-cols-2">
          <Info label="Spiel" value={formData.game} />
          <Info label="Teamgröße" value={formData.teamSize} />
          <Info label="Format" value={formData.tournamentMode?.replace(/([A-Z])/g, ' $1').toUpperCase()} />
          <Info label="Maximale Teams" value={formData.maxTeams} />
          <Info label="Punktesystem" value={formData.scoringSystem} />
          <Info label="Regeln" value={formData.rules || 'Keine angegeben'} />
          <Info label="Anmeldestart" value={formData.registrationStart} />
          <Info label="Anmeldeende" value={formData.registrationEnd} />
          <Info label="Teilnahmegebühr" value={`$ ${formData.entryFee}`} />
        </div>

        <div className="mt-4 space-y-4">
          {formData.isPublic && <Tag label="Öffentliches Turnier" />}
          {formData.inviteOnly && <Tag label="Nur auf Einladung" />}
          {formData.checkInRequired && <Tag label="Check-In erforderlich" />}
        </div>
      </div>

      {/* Zeitplanung */}
      <div className="mb-8">
        <h3 className="mb-6 text-[#FF4EF1] font-semibold border-b border-[#2E314A] text-xl uppercase">Zeitplanung</h3>
        <div className="gap-4 grid grid-cols-2">
          <Info label="Startdatum" value={formData.startDate} />
          <Info label="Startzeit" value={formData.startTime} />
          <Info label="Zeitzone" value={formData.timezone} />
          <Info label="Matchdauer" value={`${formData.matchDuration} Minuten`} />
          <Info label="Pause" value={`${formData.breakDuration} Minuten`} />
        </div>
      </div>

      {/* Preise */}
      <div className="mb-8">
        <h3 className="mb-6 text-[#FF4EF1] font-semibold border-b border-[#2E314A] text-xl uppercase">Preise</h3>
        {formData.prizes && formData.prizes.length > 0 ? (
          formData.prizes.map((prize) => (
            <div key={prize.id} className="flex items-center text-white mb-2">
              <span className="mr-3 font-bold text-[#FF4EF1]">{prize.place}. PREIS:</span>
              <span>{prize.name}</span>
            </div>
          ))
        ) : (
          <p className="text-white">Keine Preise definiert</p>
        )}
      </div>

      {/* Hinweis + Navigation */}
      <div className="mb-6 text-white text-sm">
        <p>Mit dem Erstellen des Turniers stimmst du den Nutzungsbedingungen von GamerLink zu.</p>
      </div>

      <div className="flex justify-between">
        <button onClick={onBack} className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-lg font-semibold text-white">
          ZURÜCK
        </button>
        <button onClick={onSubmit} className="bg-[#dd17c9] hover:bg-[#aa0d9d] px-10 py-2 rounded-lg font-semibold text-white">
          TURNIER ERSTELLEN
        </button>
      </div>
    </div>

  );
};

export default Step4Confirmation;