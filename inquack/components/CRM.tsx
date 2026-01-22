import React, { useState, useMemo } from 'react';
import { UserRound, MessageSquare, Globe, TrendingUp } from 'lucide-react';

// Definimos o que o CRM precisa para funcionar
interface CRMProps {
  clients: any[];
}

const CRM: React.FC<CRMProps> = ({ clients }) => {
  const [clientSearch, setClientSearch] = useState('');
  const [clientSort, setClientSort] = useState<'newest' | 'oldest'>('newest');

  const filteredClients = useMemo(() => {
    return (clients || [])
      .filter(c => c.client_name.toLowerCase().includes(clientSearch.toLowerCase()))
      .sort((a, b) => {
        const dateA = new Date(a.last_date || 0).getTime();
        const dateB = new Date(b.last_date || 0).getTime();
        return clientSort === 'newest' ? dateB - dateA : dateA - dateB;
      });
  }, [clients, clientSearch, clientSort]);

  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-300 pb-20">
      {/* ... (Todo o seu código de retorno do CRM permanece igual aqui) ... */}
      <div className="flex flex-col gap-4 sticky top-[88px] bg-brand-bg/80 backdrop-blur-md z-20 py-2">
        <h3 className="text-2xl font-black text-brand-dark tracking-tight">Gestão de Clientes (CRM)</h3>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input 
              type="text"
              placeholder="Buscar cliente..."
              value={clientSearch}
              onChange={(e) => setClientSearch(e.target.value)}
              className="w-full bg-white border border-gray-100 pl-10 pr-4 py-3 rounded-2xl text-sm font-medium outline-none focus:ring-2 ring-brand-primary"
            />
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" size={18} />
          </div>
          <button 
            onClick={() => setClientSort(prev => prev === 'newest' ? 'oldest' : 'newest')}
            className="bg-white border border-gray-100 px-4 py-3 rounded-2xl text-brand-muted flex items-center gap-2 font-bold text-xs"
          >
            <TrendingUp size={16} className={clientSort === 'oldest' ? 'rotate-180' : ''} />
            {clientSort === 'newest' ? 'Recentes' : 'Antigos'}
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredClients.map((client) => (
          <div key={client.id} className="bg-white p-6 rounded-[2rem] border border-gray-50 shadow-sm">
             {/* Conteúdo do Card */}
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-brand-primary/10 text-brand-dark rounded-2xl flex items-center justify-center font-black">
                  {client.client_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-brand-dark">{client.client_name}</h4>
                  <p className="text-xs text-brand-muted">{client.client_phone}</p>
                </div>
             </div>
             <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between">
                <span className="text-xl font-black">R$ {client.sum_price?.toFixed(2)}</span>
                <span className="text-xs font-bold text-brand-muted">{new Date(client.last_date).toLocaleDateString()}</span>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CRM;