'use client';

import React from 'react';

interface SimplePostProps {
  content: string;
  type?: 'joined' | 'created' | 'interest';
  date?: Date;
}

export default function SimplePost({ content, type = 'created', date }: SimplePostProps) {
  const colorClasses = {
    joined: 'text-[#39ff14]',
    created: 'text-[#FF4EF1]',
    interest: 'text-green-400',
  };

  const timestamp = date ? new Date(date) : new Date();

  const formattedTimestamp = `${timestamp.toLocaleDateString('de-DE')} ${timestamp.toLocaleTimeString('de-DE', { hour12: false })}`;

  return (
    <div className="bg-[#121428] text-[#d4d4d4] font-mono text-sm p-3 rounded-md shadow-sm border border-[#333]">
      <span className="text-white">[{formattedTimestamp}]</span>{' '}
      <span className={colorClasses[type]}>
        {content}
      </span>
    </div>
  );
}
