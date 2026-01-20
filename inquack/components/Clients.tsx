
import React from 'react';

const Clients: React.FC = () => {
  const clients = [
    "Barbearia Classic", "Loja da Ana", "Pet Shop Amigo", 
    "Consultório Dr. Silva", "Café do Ponto", "Studio Gisele", 
    "Inova Tech", "Marmitaria Sabor", "Oficina Central", 
    "Moda Fitness"
  ];

  return (
    <section className="py-20 px-6 bg-white overflow-hidden border-t border-gray-50">
      <div className="max-w-7xl mx-auto">
        <h3 className="text-center text-sm font-bold text-gray-400 uppercase tracking-[0.3em] mb-12">
          Empresas que confiam na inQuack
        </h3>
        
        <div className="relative flex overflow-hidden">
          <div className="flex gap-16 animate-scroll whitespace-nowrap py-4">
            {[...clients, ...clients].map((client, i) => (
              <span 
                key={i} 
                className="text-2xl font-bold text-gray-300 hover:text-brand-primary transition-colors cursor-default select-none"
              >
                {client}
              </span>
            ))}
          </div>
          {/* Fades */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
        </div>
      </div>
    </section>
  );
};

export default Clients;
