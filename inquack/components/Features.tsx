
import React from 'react';
import { 
  Calendar, 
  Layout, 
  ShoppingBag, 
  Users, 
  MessageSquare, 
  CreditCard, 
  Zap, 
  Smartphone 
} from 'lucide-react';

const FeatureCard: React.FC<{ icon: React.ReactNode, title: string, desc: string, color: string }> = ({ icon, title, desc, color }) => (
  <div className="group bg-white p-8 rounded-[2.5rem] hover:shadow-2xl hover:shadow-brand-dark/5 transition-all duration-500 border border-gray-100 flex flex-col gap-6">
    <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <div>
      <h3 className="text-xl font-bold mb-3 text-brand-dark">{title}</h3>
      <p className="text-brand-muted leading-relaxed">{desc}</p>
    </div>
  </div>
);

const Features: React.FC = () => {
  const features = [
    {
      icon: <Calendar className="text-blue-600" />,
      color: "bg-blue-50",
      title: "Agendamento Online",
      desc: "Agenda inteligente que trabalha por você. Seus clientes marcam horários 24h por dia sem interrupções."
    },
    {
      icon: <Layout className="text-purple-600" />,
      color: "bg-purple-50",
      title: "Quackpage (Site na Bio)",
      desc: "Transforme seu Instagram em uma máquina de vendas com um microsite profissional e otimizado."
    },
    {
      icon: <ShoppingBag className="text-orange-600" />,
      color: "bg-orange-50",
      title: "Venda Online",
      desc: "Cadastre produtos e serviços em minutos e receba pagamentos diretamente pela plataforma."
    },
    {
      icon: <Users className="text-emerald-600" />,
      color: "bg-emerald-50",
      title: "CRM Integrado",
      desc: "Gestão completa de clientes. Saiba quem são, o que compram e como fidelizá-los."
    },
    {
      icon: <MessageSquare className="text-indigo-600" />,
      color: "bg-indigo-50",
      title: "Mensagens Automáticas",
      desc: "Automação de notificações para reduzir faltas e manter seus clientes sempre informados."
    },
    {
      icon: <CreditCard className="text-rose-600" />,
      color: "bg-rose-50",
      title: "Pagamento Integrado",
      desc: "Receba via PIX ou Cartão com as melhores taxas do mercado, tudo em um só lugar."
    },
    {
      icon: <Zap className="text-brand-primary" />,
      color: "bg-yellow-50",
      title: "IA Consultora",
      desc: "Nossa inteligência artificial analisa seus dados e sugere estratégias para seu negócio crescer."
    },
    {
      icon: <Smartphone className="text-cyan-600" />,
      color: "bg-cyan-50",
      title: "Bot de WhatsApp",
      desc: "Atendimento automático no WhatsApp para tirar dúvidas e fechar vendas enquanto você dorme."
    }
  ];

  return (
    <section className="py-24 px-6 bg-brand-soft/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-base font-bold text-brand-primary tracking-[0.2em] uppercase mb-4">Benefícios Reais</h2>
          <p className="text-4xl md:text-5xl font-extrabold text-brand-dark mb-6 tracking-tight">
            Tudo o que você precisa para <br className="hidden md:block"/> escalar seu negócio.
          </p>
          <p className="text-xl text-brand-muted max-w-2xl mx-auto">
            A inQuack democratiza ferramentas que antes eram acessíveis apenas para grandes empresas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <FeatureCard key={i} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
