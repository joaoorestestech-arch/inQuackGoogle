import React, { useState, useEffect } from 'react';
import {
  CheckCircle2
} from 'lucide-react';

import agendaImg from '../img/agenda_calendar.png';
import paymentImg from '../img/Badget-pay.png';
import marketingImg from '../img/Badget-marketing.png';
import textImg from '../img/Badget-text.png';
import inQuackAssistente from '../img/inQuack-Assistente.svg';
import fisicocard from '../img/Fisico.svg';
import digitalcard from '../img/Digital.svg';


interface SubFeature {
  id: string;
  title: string;
  desc: string;
  preview: React.ReactNode;
}

interface FeatureModuleProps {
  badge?: string;
  title: string;
  description: string;
  items: SubFeature[];
  reverse?: boolean;
  hideBadge?: boolean;
  bgColor?: string;
  onSignup?: () => void;
}


const FeatureModule: React.FC<FeatureModuleProps> = ({ badge, title, description, items, reverse = false, hideBadge = false, bgColor = '#f7f0e8', onSignup }) => {
  const [activeTabId, setActiveTabId] = useState(items[0].id);

  useEffect(() => {
    setActiveTabId(items[0].id);
  }, [items]);

  const activeTab = items.find(item => item.id === activeTabId) || items[0];

  return (
    <div className="pt-0 pb-16 md:pb-24">
      {/* Desktop Layout */}
      <div className={`hidden lg:flex items-center gap-20 ${reverse ? 'flex-row-reverse' : ''}`}>
        <div className="flex-1 space-y-8 text-left">
          <div>
            {!hideBadge && badge && (
              <span className="inline-block px-4 py-1.5 rounded-full bg-[#fff] text-brand-dark font-bold text-md border shadow-sm mb-6">
                {badge}
              </span>
            )}
            <h3 className="text-4xl md:text-5xl font-semibold text-brand-dark font-display tracking-tight leading-tight mb-6">
              {title}
            </h3>
            <p className="text-lg text-brand-dark/80 leading-relaxed font-medium max-w-lg mb-10">
              {description}
            </p>
          </div>

          <div className="flex flex-col relative">
            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-zinc-100 rounded-full" />

            {items.map((item) =>
              activeTabId === item.id ? (
                <div key={item.id} className="relative flex items-stretch">
                  <div
                    className="absolute left-0 top-0 bottom-0 w-[2px] rounded-full transition-all duration-300"
                    style={{ backgroundColor: bgColor }}
                  />
                  <button
                    onClick={() => setActiveTabId(item.id)}
                    className="w-full pl-6 pr-4 py-5 text-left transition-all duration-300"
                  >
                    <h4 className="text-2xl font-semibold tracking-tight text-brand-dark">
                      {item.title}
                    </h4>
                    <p className="text-brand-dark/80 text-lg mt-2 leading-relaxed font-medium animate-in fade-in slide-in-from-top-1 duration-300">
                      {item.desc}
                    </p>
                  </button>
                </div>
              ) : (
                <div key={item.id} className="group relative flex items-stretch cursor-pointer" onClick={() => setActiveTabId(item.id)}>
                  <button className="w-full pl-6 pr-4 py-5 text-left">
                    <h4 className="text-2xl font-semibold tracking-tight text-zinc-300 transition-all duration-300 ease-out group-hover:text-zinc-500 group-hover:translate-x-1">
                      {item.title}
                    </h4>
                  </button>
                </div>
              )
            )}
          </div>
        </div>

        <div className="flex-1">
          <div className="rounded-b-[3rem] rounded-tr-[3rem] p-12 h-[520px] flex items-center justify-center relative overflow-hidden group shadow-inner" style={{ backgroundColor: bgColor }}>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-white rounded-full blur-[100px] opacity-40 group-hover:opacity-60 transition-opacity duration-1000" />
            <div className="relative z-10 w-full flex justify-center animate-in fade-in zoom-in duration-500" key={activeTabId}>
              {activeTab.preview}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        <div className="mb-8">
          {!hideBadge && badge && (
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#f1f1f1] text-brand-dark font-bold text-xs border border-grey-900/10 shadow-sm mb-4">
              {badge}
            </span>
          )}
          <h3 className="text-3xl font-semibold text-brand-dark font-display tracking-tight leading-tight mb-3">
            {title}
          </h3>
          <p className="text-brand-dark/80 leading-relaxed font-medium text-base">
            {description}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-[1.5rem] p-5 flex flex-col gap-5"
              style={{ backgroundColor: bgColor }}
            >
              <div className="flex items-center gap-3">
                <h4 className="text-xl font-semibold text-brand-dark tracking-tight leading-snug">
                  {item.title}
                </h4>
              </div>
              <p className="text-brand-dark/75 text-base leading-relaxed font-medium">
                {item.desc}
              </p>
              <div className="rounded-2xl p-5 flex items-center justify-center min-h-[180px] relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-white rounded-full blur-[60px] opacity-50" />
                <div className="relative z-10 scale-[0.82] origin-center w-full flex justify-center">
                  {item.preview}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center gap-3">
          <button
            onClick={onSignup}
            className="w-full sm:w-auto bg-brand-dark text-white px-8 py-4 rounded-full font-semibold text-2xl sm:text-lg hover:bg-brand-muted transition-all flex items-center justify-center gap-2 group shadow-xl"
          >
            Testar 7 dias grátis
          </button>
        </div>
      </div>
    </div>
  );
};

const Features: React.FC<{ onSignup?: () => void }> = ({ onSignup }) => {
  const [activeTab, setActiveTab] = useState(0);

  const sections = [
    {
      tabLabel: "Personalize & Venda",
      bgColor: "#DAC9FD",
      badge: "Personalize tudo",
      title: "Seu negócio pronto para vender online em minutos",
      description: "Construa seu site, venda produtos, receba pagamentos e expanda seu posicionamento digital sem precisar de experiência técnica. Tenha tudo em um só lugar.",
      reverse: false,
      items: [
        {
          id: 'site',
          title: "Site na bio",
          desc: "Um site incrivel fácil de personalizar com a cara do seu negócio.",
          preview: (
            <div className="relative w-[260px] h-[400px] bg-white rounded-[2.5rem] border-[8px] border-gray-900 shadow-2xl overflow-hidden">
              <div className="h-full bg-[#FFFDF6] p-6 flex flex-col items-center">
                <div className="w-16 h-16 bg-brand-primary rounded-full mb-4 mt-8" />
                <div className="h-4 w-32 bg-gray-200 rounded-full mb-2" />
                <div className="h-3 w-48 bg-gray-100 rounded-full mb-8" />
                <div className="space-y-3 w-full">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-full h-10 bg-white border border-gray-200 rounded-xl shadow-sm" />
                  ))}
                </div>
              </div>
            </div>
          )
        },
        {
          id: 'loja',
          title: "Loja Online",
          desc: "Cadastre produtos e serviços em minutos e receba pagamentos diretamente pela plataforma.",
          preview: (
            <div className="flex gap-4 w-full max-w-[340px] items-center justify-center">
              <img src={fisicocard} alt="Produto Físico" className="w-1/2 h-auto object-contain drop-shadow-xl" />
              <img src={digitalcard} alt="Produto Digital" className="w-1/2 h-auto object-contain drop-shadow-xl" />
            </div>
          )
        },
        {
          id: 'pagamento',
          title: "Venda tudo em um só lugar",
          desc: "Seus clientes podem comprar seus produtos, contratar seus serviços e pagar com apenas um clique. Sem esforço.",
          preview: (
            <div className="w-full max-w-[340px] drop-shadow-xl">
              <img src={paymentImg} alt="Pagamento Seguro" className="w-full h-auto rounded-3xl" />
            </div>
          )
        },
        {
          id: 'agenda',
          title: "Agenda que se organiza sozinha",
          desc: "Seus clientes agendam, pagam e você só recebe a notificação no celular.",
          preview: (
            <div className="w-full max-w-[340px] drop-shadow-xl">
              <img src={agendaImg} alt="Agenda" className="w-full h-auto rounded-[2rem]" />
            </div>
          )
        }
      ]
    },
    {
      tabLabel: "Assistente de IA",
      bgColor: "#F9CE69",
      badge: "Assistente de IA",
      title: "Um assistente que nunca dorme, nunca falta e nunca esquece",
      description: "Responde dúvidas, fecha agendamentos e ainda resgata clientes que sumiram. Tudo automaticamente.",
      reverse: false,
      items: [
        {
          id: 'ia-atendimento',
          title: "Atendimento 24/7",
          desc: "Automação de notificação para reduzir faltas, atendimento automático no WhatsApp para tirar dúvidas e fechar vendas enquanto você dorme.",
          preview: (
            <div className="w-full max-w-[340px] drop-shadow-xl">
              <img src={textImg} alt="Atendimento IA" className="w-full h-auto rounded-3xl" />
            </div>
          )
        },
        {
          id: 'ia-disparos',
          title: "Disparos automáticos",
          desc: "Resgata clientes que sumiram e recupera vendas perdidas. Tudo automático, sem você mexer um dedo.",
          preview: (
            <div className="w-full max-w-[340px] drop-shadow-xl">
              <img src={marketingImg} alt="Disparos Automáticos" className="w-full h-auto rounded-3xl" />
            </div>
          )
        },
        {
          id: 'ia-consultoria',
          title: "Insights do negócio",
          desc: "Como nossa IA está em frequente contato com seus clientes, ela analisa seus dados e sugere estratégias para seu negócio crescer.",
          preview: (() => {
            const InsightsChat = () => {
              const [step, setStep] = React.useState(0);
              const [typing, setTyping] = React.useState(false);

              const AVATAR_SRC = inQuackAssistente;

              const messages = [
                { role: 'user', text: 'Como estão minhas vendas essa semana?' },
                { role: 'ai', text: 'Suas vendas cresceram 23% vs semana passada! 🎉 Terça e quarta foram os dias mais fortes.' },
                { role: 'ai', text: 'Dica: suas vendas caem toda segunda-feira. Que tal criar uma promoção semanal só pra esse dia?', isInsight: true },
              ];

              React.useEffect(() => {
                if (step >= messages.length) return;
                setTyping(true);
                const delay = messages[step].role === 'ai' ? 900 : 400;
                const t = setTimeout(() => {
                  setTyping(false);
                  setStep(s => s + 1);
                }, delay + 800);
                return () => clearTimeout(t);
              }, [step]);

              const visible = messages.slice(0, step);

              const Avatar = ({ size }: { size: number }) => (
                <div className="rounded-xl overflow-hidden flex-shrink-0" style={{ width: size, height: size, minWidth: size }}>
                  <img src={AVATAR_SRC} alt="Assistente inQuack" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              );

              return (
                <div className="w-full max-w-[340px] rounded-2xl overflow-hidden flex flex-col" style={{ backgroundColor: '#FDFBF7', border: '1px solid #f0ece4' }}>
                  <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: '1px solid #f0ece4' }}>
                    <Avatar size={40} />
                    <div>
                      <p className="text-xs font-bold text-gray-900">Assistente inQuack</p>
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                        <p className="text-[10px] text-gray-400 font-medium">Online agora</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 px-4 py-4 min-h-[180px]">
                    {visible.map((msg, i) => (
                      <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'ai' && <div className="mr-2 mt-0.5"><Avatar size={24} /></div>}
                        <div
                          className="max-w-[200px] px-3 py-2 text-xs font-medium leading-relaxed"
                          style={{
                            backgroundColor: msg.role === 'user' ? '#1a1a1a' : (msg as any).isInsight ? '#FEF3C7' : '#fff',
                            color: msg.role === 'user' ? '#fff' : '#1a1a1a',
                            borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                            border: (msg as any).isInsight ? '1px solid #F9CE69' : msg.role === 'ai' ? '1px solid #f0ece4' : 'none',
                            boxShadow: msg.role === 'ai' ? '0 1px 4px rgba(0,0,0,0.06)' : 'none',
                          }}
                        >
                          {(msg as any).isInsight && (
                            <span className="block text-[10px] font-bold mb-1" style={{ color: '#c9a000' }}>💡 Insight</span>
                          )}
                          {msg.text}
                        </div>
                      </div>
                    ))}

                    {typing && (
                      <div className="flex justify-start items-center gap-2">
                        <Avatar size={24} />
                        <div className="px-3 py-2 flex items-center gap-1" style={{ backgroundColor: '#fff', borderRadius: '14px 14px 14px 4px', border: '1px solid #f0ece4', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                          {[0, 1, 2].map(j => (
                            <span key={j} className="w-1.5 h-1.5 rounded-full bg-gray-300 inline-block" style={{ animation: `bounce 1s ease-in-out ${j * 0.15}s infinite` }} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mx-4 mb-4 px-3 py-2 rounded-xl" style={{ backgroundColor: '#fff', border: '1px solid #f0ece4' }}>
                    <p className="text-xs text-gray-300 flex-1">Pergunte algo...</p>
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#F9CE69' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                      </svg>
                    </div>
                  </div>
                </div>
              );
            };
            return <InsightsChat />;
          })()
        },
        {
          id: 'ia-upsell',
          title: "Sugere produtos complementares",
          desc: "Cliente comprou shampoo? A IA oferece condicionador. Agendou corte? Sugere barba. Aumenta seu ticket médio automaticamente.",
          preview: (() => {
            const UpsellCard = () => {
              const [accepted, setAccepted] = React.useState(false);
              const [showSuggestion, setShowSuggestion] = React.useState(false);
              const [typing, setTyping] = React.useState(false);

              React.useEffect(() => {
                const t1 = setTimeout(() => setTyping(true), 800);
                const t2 = setTimeout(() => { setTyping(false); setShowSuggestion(true); }, 2200);
                return () => { clearTimeout(t1); clearTimeout(t2); };
              }, []);

              const basePrice = 50;
              const addPrice = accepted ? 28 : 0;
              const totalPrice = basePrice + addPrice;

              return (
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-[300px] overflow-hidden">
                  <div className="px-5 pt-5 pb-3 border-b border-gray-100">
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-3">Carrinho</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-lg">✂️</div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">Corte Masculino</p>
                          <p className="text-xs text-gray-400">45 min</p>
                        </div>
                      </div>
                      <span className="text-sm font-black text-gray-900">R$ {basePrice}</span>
                    </div>

                    {accepted && (
                      <div className="flex items-center justify-between mt-3 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg" style={{ backgroundColor: '#FEF3C7' }}>🪒</div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">Barba Completa</p>
                            <p className="text-xs text-gray-400">30 min</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-400 line-through">R$ 40</p>
                          <p className="text-sm font-black" style={{ color: '#c9a000' }}>R$ 28</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="px-5 py-3 flex items-center justify-between" style={{ backgroundColor: accepted ? '#FDFBF0' : '#fafafa' }}>
                    <span className="text-xs font-semibold text-gray-500">Total</span>
                    <span className="text-lg font-black text-gray-900 transition-all duration-300">
                      R$ {totalPrice}
                      {accepted && <span className="text-xs font-semibold ml-1" style={{ color: '#16a34a' }}>economia!</span>}
                    </span>
                  </div>

                  <div className="px-5 pb-5 pt-3">
                    {typing && !showSuggestion && (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black flex-shrink-0" style={{ backgroundColor: '#F9CE69' }}>✦</div>
                        <div className="px-3 py-2 flex items-center gap-1 rounded-xl" style={{ backgroundColor: '#FDFBF7', border: '1px solid #f0ece4' }}>
                          {[0, 1, 2].map(j => (
                            <span key={j} className="w-1.5 h-1.5 rounded-full bg-gray-300 inline-block" style={{ animation: `bounce 1s ease-in-out ${j * 0.15}s infinite` }} />
                          ))}
                        </div>
                      </div>
                    )}

                    {showSuggestion && !accepted && (
                      <div className="animate-in fade-in slide-in-from-bottom-2 duration-400">
                        <div className="flex items-center gap-1.5 mb-2">
                          <div className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black" style={{ backgroundColor: '#F9CE69' }}>✦</div>
                          <span className="text-[11px] font-bold text-gray-500">Sugestão da IA</span>
                        </div>
                        <div className="rounded-2xl p-4 relative overflow-hidden" style={{ backgroundColor: '#FDFBF7', border: '1.5px solid #F9CE69' }}>
                          <div className="absolute top-0 right-0 text-[10px] font-black px-2.5 py-1 rounded-bl-xl" style={{ backgroundColor: '#F9CE69', color: '#1a1a1a' }}>30% OFF</div>
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ backgroundColor: '#FEF3C7' }}>🪒</div>
                            <div>
                              <p className="text-sm font-bold text-gray-900">+ Barba Completa</p>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-xs text-gray-400 line-through">R$ 40</span>
                                <span className="text-sm font-black" style={{ color: '#c9a000' }}>R$ 28</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-[11px] text-gray-500 font-medium mb-3 leading-relaxed">
                            Clientes que fazem corte + barba economizam em média <strong>R$ 12</strong> por visita. 💡
                          </p>
                          <button onClick={() => setAccepted(true)} className="w-full py-2 rounded-xl text-sm font-bold transition-all duration-200 hover:opacity-90 active:scale-95" style={{ backgroundColor: '#F9CE69', color: '#1a1a1a' }}>
                            Adicionar ao carrinho
                          </button>
                        </div>
                      </div>
                    )}

                    {accepted && (
                      <div className="flex items-center gap-2 animate-in fade-in duration-300">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: '#d1fae5' }}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </div>
                        <p className="text-xs font-semibold" style={{ color: '#16a34a' }}>Barba adicionada com desconto!</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            };
            return <UpsellCard />;
          })()
        }
      ]
    },
    {
      tabLabel: "Análise & CRM",
      bgColor: "#B0D8FD",
      badge: "Análise & CRM",
      title: "Veja tudo o que está funcionando para você.",
      description: "Acompanhe métricas, entenda o comportamento dos clientes e otimize seu faturamento mensal.",
      reverse: false,
      items: [
        {
          id: 'stats-cliques',
          title: "Cliques e Visitas",
          desc: "Saiba exatamente de onde vêm seus visitantes e o que mais chama atenção.",
          preview: (() => {
            const ClicksChart = () => {
              const [activeBar, setActiveBar] = React.useState(0);

              const data = [
                { label: 'Dom', visitas: 45, cliques: 22, conversao: 12 },
                { label: 'Seg', visitas: 62, cliques: 38, conversao: 20 },
                { label: 'Ter', visitas: 75, cliques: 48, conversao: 25 },
                { label: 'Qua', visitas: 92, cliques: 70, conversao: 42 },
                { label: 'Qui', visitas: 68, cliques: 44, conversao: 28 },
                { label: 'Sex', visitas: 58, cliques: 36, conversao: 18 },
                { label: 'Sab', visitas: 55, cliques: 30, conversao: 15 },
              ];

              const maxVal = Math.max(...data.map(d => d.visitas));
              const active = data[activeBar];
              const prev = activeBar > 0 ? data[activeBar - 1].label : null;

              const COLORS: Record<string, string> = {
                visitas: '#DAC9FD',
                cliques: '#F9A76A',
                conversao: '#F9CE69',
              };
              const C_INACTIVE = '#e2e2e2';
              const BAR_H = 150;

              return (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-[360px] px-5 pt-5 pb-4 flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-3" style={{ height: `${BAR_H}px` }}>
                    {data.map((m, i) => {
                      const isActive = i === activeBar;
                      const metrics = [
                        { key: 'visitas', val: m.visitas },
                        { key: 'cliques', val: m.cliques },
                        { key: 'conversao', val: m.conversao },
                      ].sort((a, b) => b.val - a.val);
                      const tallestH = (metrics[0].val / maxVal) * BAR_H;
                      return (
                        <button key={i} onClick={() => setActiveBar(i)} className="flex-1 h-full flex flex-col justify-start items-center" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                          <div style={{ height: `${BAR_H - tallestH}px`, flexShrink: 0 }} />
                          <div className="relative w-full" style={{ height: `${tallestH}px` }}>
                            {isActive ? (
                              metrics.map(({ key, val }) => (
                                <div key={key} className="absolute bottom-0 left-0 w-full transition-all duration-300" style={{ height: `${(val / maxVal) * BAR_H}px`, backgroundColor: COLORS[key], borderRadius: '10px' }} />
                              ))
                            ) : (
                              <div className="absolute bottom-0 left-0 w-full" style={{ height: '100%', backgroundColor: C_INACTIVE, borderRadius: '10px' }} />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between -mt-1">
                    {data.map((m, i) => (
                      <button key={i} onClick={() => setActiveBar(i)} style={{ flex: 1, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'center', fontSize: '11px', fontWeight: i === activeBar ? 700 : 500, color: i === activeBar ? '#1a1a1a' : '#9ca3af', padding: 0 }}>
                        {m.label}
                      </button>
                    ))}
                  </div>

                  <div className="h-px bg-gray-100" />
                  <p className="text-sm font-bold text-gray-900 -mb-1">
                    {prev ? `${prev} – ${data[activeBar].label} 2024` : `${data[activeBar].label} 2024`}
                  </p>

                  <div className="flex flex-col gap-2.5">
                    {[
                      { label: 'Cliques', value: active.cliques, color: COLORS.cliques },
                      { label: 'Visitas', value: active.visitas, color: COLORS.visitas },
                      { label: 'Conversão', value: `${active.conversao}%`, color: COLORS.conversao },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                          <span className="text-sm font-medium text-gray-500">{item.label}</span>
                        </div>
                        <span className="text-sm font-bold text-gray-900">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            };
            return <ClicksChart />;
          })()
        },
        {
          id: 'crm-integrado',
          title: "CRM Integrado",
          desc: "Gestão completa de clientes. Saiba quem são, o que compram e use tags inteligentes para fidelizá-los.",
          preview: (
            <div className="w-full max-w-[360px] flex flex-col gap-3">
              {[
                { initials: 'AS', color: '#DAC9FD', name: 'Ana Silva', desc: 'Comprou Corte + Hidratação', time: '10:24', tags: [{ label: 'VIP', bg: '#DAC9FD', text: '#3b1fa8' }, { label: 'Fidelizada', bg: '#d1fae5', text: '#065f46' }], value: 'R$ 120' },
                { initials: 'JM', color: '#B0D8FD', name: 'João Mendes', desc: 'Agendou Barba Completa', time: 'Jan 31', tags: [{ label: 'Novo', bg: '#dbeafe', text: '#1e40af' }, { label: 'Agendado', bg: '#fef9c3', text: '#854d0e' }], value: 'R$ 45' },
                { initials: 'SF', color: '#fca5a5', name: 'Sofia Rosa', desc: 'Sem visita há 30 dias', time: 'Jan 12', tags: [{ label: 'Recuperar', bg: '#fee2e2', text: '#991b1b' }], value: null },
              ].map((client, i) => (
                <div key={i} className="bg-white rounded-2xl px-5 py-4 shadow-sm border border-gray-100 flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-base flex-shrink-0" style={{ backgroundColor: client.color, color: '#1a1a1a' }}>
                        {client.initials}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 leading-snug">{client.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{client.desc}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap self-start">{client.time}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {client.tags.map((tag, j) => (
                      <span key={j} className="text-xs font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: tag.bg, color: tag.text }}>{tag.label}</span>
                    ))}
                    {client.value && (
                      <div className="flex items-center gap-2 ml-1">
                        <span className="text-xs font-bold text-gray-600">{client.value}</span>
                        <div className="w-10 h-2 rounded-full bg-gray-200 overflow-hidden">
                          <div className="h-full bg-gray-400 rounded-full" style={{ width: '60%' }} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        },
        {
          id: 'stats-vendas',
          title: "Vendas & serviços",
          desc: "Identifique seus produtos estrela e os que precisam de mais atenção estratégica.",
          preview: (() => {
            const SalesChart = () => {
              const [activeBar, setActiveBar] = React.useState(3);
              const [period, setPeriod] = React.useState('7 dias');
              const [showDropdown, setShowDropdown] = React.useState(false);
              const periods = ['7 dias', '14 dias', '30 dias'];

              const allData: Record<string, { label: string; agendado: number; servicos: number }[]> = {
                '7 dias': [
                  { label: 'Dom', agendado: 320, servicos: 180 },
                  { label: 'Seg', agendado: 520, servicos: 310 },
                  { label: 'Ter', agendado: 680, servicos: 420 },
                  { label: 'Qua', agendado: 725, servicos: 580 },
                  { label: 'Qui', agendado: 610, servicos: 490 },
                  { label: 'Sex', agendado: 540, servicos: 370 },
                  { label: 'Sab', agendado: 490, servicos: 340 },
                ],
                '14 dias': [
                  { label: 'S1 Dom', agendado: 280, servicos: 150 }, { label: 'S1 Seg', agendado: 490, servicos: 280 },
                  { label: 'S1 Ter', agendado: 620, servicos: 390 }, { label: 'S1 Qua', agendado: 700, servicos: 510 },
                  { label: 'S1 Qui', agendado: 580, servicos: 440 }, { label: 'S1 Sex', agendado: 510, servicos: 350 },
                  { label: 'S1 Sab', agendado: 460, servicos: 310 }, { label: 'S2 Dom', agendado: 320, servicos: 180 },
                  { label: 'S2 Seg', agendado: 520, servicos: 310 }, { label: 'S2 Ter', agendado: 680, servicos: 420 },
                  { label: 'S2 Qua', agendado: 725, servicos: 580 }, { label: 'S2 Qui', agendado: 610, servicos: 490 },
                  { label: 'S2 Sex', agendado: 540, servicos: 370 }, { label: 'S2 Sab', agendado: 490, servicos: 340 },
                ],
                '30 dias': Array.from({ length: 30 }, (_, i) => ({
                  label: `${i + 1}`,
                  agendado: Math.floor(300 + Math.random() * 500),
                  servicos: Math.floor(150 + Math.random() * 400),
                })),
              };

              const days = allData[period];
              const maxVal = Math.max(...days.map(d => d.agendado + d.servicos));
              const totalPeriodo = days.reduce((acc, d) => acc + d.agendado + d.servicos, 0);
              const formatBRL = (val: number) => val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
              const handlePeriod = (p: string) => { setPeriod(p); setShowDropdown(false); setActiveBar(0); };

              return (
                <div className="rounded-2xl w-full max-w-[360px] px-5 pt-5 pb-5 flex flex-col gap-4" style={{ backgroundColor: '#f5f5f5' }}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">Ganhos totais</p>
                      <p className="text-2xl font-black text-gray-900 leading-none">R$ {formatBRL(totalPeriodo)}</p>
                    </div>
                    <div className="relative">
                      <button onClick={() => setShowDropdown(!showDropdown)} className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-white border border-gray-200 text-gray-700 shadow-sm">
                        {period}
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </button>
                      {showDropdown && (
                        <div className="absolute right-0 top-9 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-10 w-28">
                          {periods.map(p => (
                            <button key={p} onClick={() => handlePeriod(p)} className="w-full text-left px-3 py-2 text-xs font-semibold hover:bg-gray-50 transition-colors" style={{ color: p === period ? '#1a1a1a' : '#6b7280' }}>{p}</button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-end justify-between gap-1.5 h-[120px]">
                    {days.map((day, i) => {
                      const isActive = i === activeBar;
                      const heightPct = ((day.agendado + day.servicos) / maxVal) * 100;
                      return (
                        <button key={i} onClick={() => setActiveBar(i)} className="flex-1 flex flex-col items-center justify-end h-full" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                          <div className="w-full rounded-xl transition-all duration-300" style={{ height: `${heightPct}%`, backgroundColor: isActive ? '#F9CE69' : '#d1d5db', transform: isActive ? 'scaleY(1.05)' : 'scaleY(1)', transformOrigin: 'bottom' }} />
                        </button>
                      );
                    })}
                  </div>

                  {days.length <= 7 && (
                    <div className="flex items-center justify-between">
                      {days.map((day, i) => (
                        <button key={i} onClick={() => setActiveBar(i)} style={{ flex: 1, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'center', fontSize: '11px', fontWeight: i === activeBar ? 700 : 500, color: i === activeBar ? '#1a1a1a' : '#9ca3af', padding: 0 }}>{day.label}</button>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white rounded-2xl px-4 py-3 flex flex-col gap-2">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#FEF3C7' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F9CE69" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                      </div>
                      <div>
                        <p className="text-base font-black text-gray-900 leading-none">R$ {formatBRL(days[activeBar].agendado)}</p>
                        <p className="text-xs text-gray-400 mt-1 font-medium">Total Agendado</p>
                      </div>
                    </div>
                    <div className="bg-white rounded-2xl px-4 py-3 flex flex-col gap-2">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#FEF3C7' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F9CE69" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>
                      </div>
                      <div>
                        <p className="text-base font-black text-gray-900 leading-none">R$ {formatBRL(days[activeBar].servicos)}</p>
                        <p className="text-xs text-gray-400 mt-1 font-medium">Total Serviços</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            };
            return <SalesChart />;
          })()
        },
        {
          id: 'stats-mensal',
          title: "Estatísticas Mensais",
          desc: "Relatórios detalhados para você planejar o próximo mês com segurança.",
          preview: (() => {
            const StatsChart = () => {
              const [activePeriod, setActivePeriod] = React.useState('1M');
              const periods = ['1S', '1M', '3M', '6M', 'Tudo'];

              const dataMap: Record<string, number[]> = {
                '1S': [30, 42, 38, 55, 60, 72, 82],
                '1M': [20, 28, 35, 30, 45, 52, 48, 62, 58, 70, 75, 68, 85, 90, 95, 88, 102, 108, 115, 110, 122, 130, 125, 138, 132, 148, 142, 155, 150, 165],
                '3M': [10, 22, 18, 32, 28, 42, 38, 55, 50, 65, 72, 68, 82, 88, 95, 90, 108, 115, 122, 118, 135, 142, 148, 145, 158, 165, 172, 168, 180, 188, 195, 190, 205, 212, 218, 225],
                '6M': [5, 18, 14, 28, 24, 38, 34, 50, 46, 62, 70, 66, 82, 90, 98, 94, 112, 120, 128, 124, 142, 150, 158, 154, 170, 178, 186, 182, 198, 208, 216, 210, 228, 236, 244, 250],
                'Tudo': [2, 14, 10, 24, 20, 35, 30, 48, 44, 60, 68, 64, 82, 92, 100, 96, 116, 126, 136, 130, 150, 160, 170, 165, 182, 192, 202, 196, 215, 228, 238, 230, 250, 262, 272, 280],
              };

              const BRAND_COLOR = '#F9CE69';
              const BRAND_DARK = '#c9a000';
              const data = dataMap[activePeriod];
              const maxVal = Math.max(...data);
              const minVal = Math.min(...data);
              const range = maxVal - minVal || 1;
              const W = 460; const H = 160;
              const PAD = { top: 20, right: 20, bottom: 12, left: 12 };

              const pts = data.map((v, i) => ({
                x: PAD.left + (i / (data.length - 1)) * (W - PAD.left - PAD.right),
                y: PAD.top + (1 - (v - minVal) / range) * (H - PAD.top - PAD.bottom),
              }));

              const smooth = (points: { x: number; y: number }[]) => {
                let d = `M ${points[0].x} ${points[0].y}`;
                for (let i = 0; i < points.length - 1; i++) {
                  const p0 = points[i - 1] || points[i];
                  const p1 = points[i];
                  const p2 = points[i + 1];
                  const p3 = points[i + 2] || p2;
                  d += ` C ${p1.x + (p2.x - p0.x) / 6} ${p1.y + (p2.y - p0.y) / 6}, ${p2.x - (p3.x - p1.x) / 6} ${p2.y - (p3.y - p1.y) / 6}, ${p2.x} ${p2.y}`;
                }
                return d;
              };

              const linePath = smooth(pts);
              const last = pts[pts.length - 1];
              const areaPath = linePath + ` L ${last.x} ${H} L ${pts[0].x} ${H} Z`;

              return (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden w-full max-w-[360px]">
                  <div className="flex items-start justify-between px-5 pt-5 pb-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-400 font-medium mb-1">Faturamento total</p>
                      <p className="text-2xl font-black text-gray-900 leading-none">R$ 4.820</p>
                      <p className="text-xs text-green-500 font-semibold mt-1">+R$ 320 essa semana</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium mb-1">Novos clientes</p>
                      <p className="text-2xl font-black text-gray-900 leading-none">128</p>
                      <p className="text-xs text-green-500 font-semibold mt-1">+12 essa semana</p>
                    </div>
                  </div>
                  <div className="px-1">
                    <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ display: 'block', height: '140px' }}>
                      <defs>
                        <linearGradient id="areaGradYellow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={BRAND_COLOR} stopOpacity="0.35" />
                          <stop offset="100%" stopColor={BRAND_COLOR} stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path d={areaPath} fill="url(#areaGradYellow)" />
                      <path d={linePath} fill="none" stroke={BRAND_COLOR} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx={last.x} cy={last.y} r="5" fill={BRAND_DARK} />
                      <circle cx={last.x} cy={last.y} r="10" fill={BRAND_COLOR} fillOpacity="0.3" />
                    </svg>
                  </div>
                  <div className="flex items-center gap-2 px-4 pb-4 pt-1">
                    {periods.map((p) => (
                      <button key={p} onClick={() => setActivePeriod(p)} className="flex-1 text-xs font-semibold py-1.5 rounded-full transition-all duration-200"
                        style={activePeriod === p ? { backgroundColor: '#1a1a1a', color: '#fff' } : { backgroundColor: '#f3f4f6', color: '#6b7280' }}>
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              );
            };
            return <StatsChart />;
          })()
        }
      ]
    }
  ];

  return (
    <section className="pt-24 pb-0 px-6 bg-[#fbfaf9] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-6">
          <h2 className="text-4xl md:text-5xl font-semibold text-brand-dark font-display tracking-tight leading-tight">
            Conheça a solução completa para <br /> escalar seu negócio.
          </h2>
          <p className="text-lg text-brand-muted max-w-2xl mx-auto">
            Com a inQuack, seus clientes podem comprar seus produtos, contratar seus serviços e pagar com apenas um clique. Sem esforço.
          </p>
        </div>

        <div className="mb-12">
          <div className="flex flex-wrap gap-3 justify-center lg:hidden">
            {sections.map((section, idx) => (
              <button key={idx} onClick={() => setActiveTab(idx)} className="flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 whitespace-nowrap"
                style={activeTab === idx ? { backgroundColor: (section as any).bgColor, color: '#1a1a1a', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' } : { backgroundColor: '#e8e5e0', color: '#6b7280' }}>
                <span className="inline-block rounded-full flex-shrink-0" style={{ width: '8px', height: '8px', backgroundColor: activeTab === idx ? '#1a1a1a' : (section as any).bgColor, opacity: activeTab === idx ? 0.4 : 1 }} />
                {section.tabLabel}
              </button>
            ))}
          </div>
          <div className="hidden lg:flex overflow-x-auto scrollbar-hide">
            <div className="flex gap-3 p-1.5 rounded-2xl min-w-max mx-auto w-fit">
              {sections.map((section, idx) => (
                <button key={idx} onClick={() => setActiveTab(idx)} className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap"
                  style={activeTab === idx ? { backgroundColor: (section as any).bgColor, color: '#1a1a1a', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' } : { backgroundColor: 'transparent', color: '#6b7280' }}>
                  <span className="inline-block rounded-full flex-shrink-0" style={{ width: '8px', height: '8px', backgroundColor: (section as any).bgColor, opacity: activeTab === idx ? 0.6 : 1 }} />
                  {section.tabLabel}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <FeatureModule
            badge={sections[activeTab].badge}
            title={sections[activeTab].title}
            description={sections[activeTab].description}
            items={sections[activeTab].items}
            reverse={sections[activeTab].reverse}
            hideBadge={true}
            bgColor={(sections[activeTab] as any).bgColor}
            onSignup={onSignup}
          />
        </div>
      </div>

      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  );
};

export default Features;