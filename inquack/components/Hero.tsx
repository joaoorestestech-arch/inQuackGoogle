import React from 'react';
import { ArrowUpRight, CheckCircle2, Zap, Clock, Tag } from 'lucide-react';
import myImageTwo from '../img/moreinfo.png';

interface HeroProps {
  onStart: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStart }) => {
  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -z-10 w-1/2 h-full opacity-20 pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-[#fbfaf9] rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-grey-500/10 text-brand-muted font-bold text-sm mb-6 border border-grey-900/10 shadow-">
            🐥 O link na bio para empreendedores brasileiros
          </div>

          <h1 className="text-5xl lg:text-7xl font-extrabold font-manrope leading-[1.1] text-brand-dark mb-6 tracking-tight">
            A maneira mais fácil de vender pelas <span className="text-brand-dark">redes sociais.</span>
          </h1>

          <p className="text-xl text-brand-muted mb-10 max-w-2xl mx-auto lg:mx-0 font-roboto">
            Site profissional, hospedagem de serviços, vendas de produtos, agendamento online, pagamento integrado e CRM. Tudo em um único link na bio.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
            <button
              onClick={onStart}
              className="w-full sm:w-auto bg-brand-dark text-white px-8 py-3 rounded-full font-semibold text-base sm:text-lg hover:bg-brand-muted transition-all flex items-center justify-center gap-2 group shadow-xl"
            >
              Comece gratuitamente
            </button>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-brand-dark/70">
              <Tag size={15} className="text-brand-dark/50" />
              Única plataforma com 0% de taxa
            </div>
            <div className="hidden sm:block w-px h-4 bg-brand-dark/20" />
            <div className="flex items-center gap-2 text-sm font-semibold text-brand-dark/70">
              <CheckCircle2 size={15} className="text-brand-dark/50" />
              Cancele quando quiser
            </div>
            <div className="hidden sm:block w-px h-4 bg-brand-dark/20" />
            <div className="flex items-center gap-2 text-sm font-semibold text-brand-dark/70">
              <Clock size={15} className="text-brand-dark/50" />
              Suporte 24 horas
            </div>
          </div>
        </div>

        <div className="flex-1 relative w-full max-w-lg lg:max-w-none">
          <div className="flex-1 relative w-full max-w-lg lg:max-w-none">
            <img
              src={myImageTwo}
              alt="inQuack Dashboard"
              className="w-full h-auto object-cover"
            />
            {/* Float Element: CRM */}
            <div className="absolute top-36 -left-10 bg-white p-4 rounded-2xl shadow-xl animate-bounce hidden sm:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">C</div>
                <div>
                  <div className="text-xs text-gray-400">Novo Lead</div>
                  <div className="text-sm font-bold">Rafael Silva</div>
                </div>
              </div>
            </div>
            {/* Float Element: Sales */}
            <div className="absolute bottom-10 -right-10 bg-white p-4 rounded-2xl shadow-xl hidden sm:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-primary rounded-lg flex items-center justify-center text-brand-dark font-bold">R$</div>
                <div>
                  <div className="text-xs text-gray-400">Venda Realizada</div>
                  <div className="text-sm font-bold">R$ 450,00</div>
                </div>
              </div>
            </div>
          </div>
          {/* Background Aura */}
          <div className="absolute -inset-4 bg-brand-primary/10 rounded-3xl blur-2xl -z-10"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;