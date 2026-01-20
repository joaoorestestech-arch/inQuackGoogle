import React from 'react';
import { QuackPage, BusinessHour } from '../types';
import { MapPin, Clock } from 'lucide-react';

interface BusinessInfoProps {
  page: QuackPage;
  hours: BusinessHour[];
  primaryColor: string;
}

export const BusinessInfo: React.FC<BusinessInfoProps> = ({ page, hours, primaryColor }) => {
  
  // Mapping for display and sorting
  const ptDays: {[key: string]: string} = {
      'sunday': 'Domingo', 'monday': 'Segunda', 'tuesday': 'Terça', 'wednesday': 'Quarta', 
      'thursday': 'Quinta', 'friday': 'Sexta', 'saturday': 'Sábado',
      'domingo': 'Domingo', 'segunda': 'Segunda', 'terça': 'Terça', 'quarta': 'Quarta',
      'quinta': 'Quinta', 'sexta': 'Sexta', 'sábado': 'Sábado'
  };

  const getDayIndex = (day: string) => {
      const lower = day.toLowerCase();
      // Maps both English and Portuguese to 0 (Sunday) - 6 (Saturday)
      const map: {[key:string]: number} = {
          'sunday': 0, 'domingo': 0,
          'monday': 1, 'segunda': 1,
          'tuesday': 2, 'terça': 2,
          'wednesday': 3, 'quarta': 3,
          'thursday': 4, 'quinta': 4,
          'friday': 5, 'sexta': 5,
          'saturday': 6, 'sábado': 6
      };
      return map[lower] ?? 7; // 7 puts unknowns at the end
  };

  const sortedHours = [...hours].sort((a, b) => {
      const idxA = getDayIndex(a.day_of_week);
      const idxB = getDayIndex(b.day_of_week);
      return idxA - idxB;
  });

  return (
    <div className="space-y-6 pb-24">
        {page.address && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-full bg-gray-50 text-gray-700">
                        <MapPin size={24} />
                    </div>
                    <h3 className="font-bold text-gray-800 text-lg">Endereço</h3>
                </div>
                <p className="text-gray-600">{page.address}</p>
                
                <a 
                    href={`https://maps.google.com/?q=${encodeURIComponent(page.address)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 block w-full text-center py-2 rounded-xl text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                    Ver no Mapa
                </a>
            </div>
        )}

        {sortedHours.length > 0 && (
             <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-full bg-gray-50 text-gray-700">
                        <Clock size={24} />
                    </div>
                    <h3 className="font-bold text-gray-800 text-lg">Horários de Atendimento</h3>
                </div>
                
                <div className="space-y-3">
                    {sortedHours.map(hour => {
                        const dayName = hour.day_of_week.toLowerCase();
                        const displayDay = ptDays[dayName] || hour.day_of_week;
                        
                        return (
                            <div key={hour.id} className="flex justify-between text-sm items-center border-b border-gray-50 last:border-0 pb-2 last:pb-0">
                                <span className="text-gray-500 font-medium capitalize">{displayDay}</span>
                                {hour.active && hour.open_time && hour.close_time ? (
                                    <span className="text-gray-800 font-semibold bg-green-50 text-green-700 px-2 py-0.5 rounded text-xs">
                                        {hour.open_time.slice(0, 5)} - {hour.close_time.slice(0, 5)}
                                    </span>
                                ) : (
                                    <span className="text-gray-400 text-xs italic">Fechado</span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        )}
    </div>
  );
};
