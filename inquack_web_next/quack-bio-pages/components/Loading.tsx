import React from 'react';

export const Loading: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin"></div>
      <p className="text-gray-500 font-medium">Carregando loja...</p>
    </div>
  </div>
);
