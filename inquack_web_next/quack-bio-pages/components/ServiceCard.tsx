import React from 'react';
import { Service } from '../types';
import { Clock, Calendar } from 'lucide-react';

interface ServiceCardProps {
  service: Service;
  primaryColor: string;
  onSchedule: (service: Service) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, primaryColor, onSchedule }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex gap-4 items-center mb-3 hover:shadow-md transition-shadow">
      <div className="w-20 h-20 bg-gray-100 rounded-xl flex-shrink-0 overflow-hidden">
        {service.image_url ? (
            <img src={service.image_url} alt={service.name} className="w-full h-full object-cover" />
        ) : (
             <div className="w-full h-full flex items-center justify-center text-gray-400">
                <Calendar size={24} />
             </div>
        )}
      </div>
      
      <div className="flex-grow">
        <div className="flex justify-between items-start">
            <h3 className="font-bold text-gray-800 text-base">{service.name}</h3>
            <span className="font-bold text-gray-900 text-sm bg-gray-50 px-2 py-1 rounded-md">{formatPrice(service.price)}</span>
        </div>
        
        {service.duration && (
            <div className="flex items-center gap-1 text-gray-500 text-xs mt-1 mb-1">
                <Clock size={12} />
                <span>{service.duration}</span>
            </div>
        )}
        
        {service.description && (
          <p className="text-gray-500 text-xs line-clamp-2">{service.description}</p>
        )}
        
        <button 
            onClick={() => onSchedule(service)}
            className="mt-3 text-xs font-semibold px-3 py-1.5 rounded-lg text-white transition-opacity hover:opacity-90 active:scale-95"
            style={{ backgroundColor: primaryColor }}
        >
            Agendar
        </button>
      </div>
    </div>
  );
};
