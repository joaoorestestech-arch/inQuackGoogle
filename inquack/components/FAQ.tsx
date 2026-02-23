import React, { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "Como funciona o período de teste gratuito?",
    answer: "Você tem 14 dias para testar todas as funcionalidades da inQuack sem pagar nada. Não pedimos cartão de crédito para começar. Se gostar, é só escolher um plano e continuar usando."
  },
  {
    question: "Preciso ter conhecimento técnico para usar a inQuack?",
    answer: "Não! A inQuack foi criada pensando em pessoas sem conhecimento técnico. Tudo funciona no estilo arrasta e solta, de forma intuitiva e simples. Em poucos minutos você já tem seu link da bio funcionando."
  },
  {
    question: "Quanto a inQuack cobra de taxa nas minhas vendas?",
    answer: "Zero. A inQuack não cobra nenhuma taxa sobre suas vendas. Você paga apenas a mensalidade do seu plano e fica com 100% do valor das suas vendas. Simples assim."
  },
  {
    question: "Como funciona o pagamento dos meus clientes?",
    answer: "Integramos com as principais plataformas de pagamento do Brasil. Seus clientes podem pagar via cartão de crédito, PIX ou boleto. O dinheiro cai direto na sua conta, de forma segura."
  },
  {
    question: "Posso ter mais de um profissional na mesma conta?",
    answer: "Sim! No plano Essencial, você pode adicionar múltiplos profissionais, cada um com sua própria agenda e serviços. Perfeito para salões, barbearias e clínicas."
  },
  {
    question: "A inQuack substitui meu Instagram?",
    answer: "Não, a inQuack complementa seu Instagram! Você continua postando e interagindo normalmente. A diferença é que agora seu link da bio se torna uma verdadeira central de negócios, onde seus seguidores podem agendar, comprar e pagar sem sair do Instagram."
  },
  {
    question: "Posso cancelar minha assinatura a qualquer momento?",
    answer: "Sim, você pode cancelar quando quiser, sem multas ou taxas. Seu acesso continuará até o final do período pago."
  },
  {
    question: "Vocês oferecem suporte?",
    answer: "Sim! Oferecemos suporte via WhatsApp para todos os planos. No plano Essencial, você tem suporte prioritário com tempo de resposta mais rápido."
  }
];

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIndex(prev => (prev === idx ? null : idx));
  };

  return (
    <section className="pt-12 pb-16 md:pb-24 px-6 bg-[#fbfaf9]">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <h2 className="text-4xl md:text-5xl font-semibold text-brand-dark font-display tracking-tight text-center leading-tight mb-12">
          Tire suas dúvidas
        </h2>

        {/* Accordion Cards */}
        <div className="flex flex-col gap-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-gray-200 shadow-sm bg-white overflow-hidden space-y-2"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between gap-6 px-6 py-5 text-left group"
                >
                  <span className="text-base font-medium text-brand-dark leading-snug">
                    {faq.question}
                  </span>
                  <span className={`flex-shrink-0 text-2xl font-bold leading-none transition-transform duration-300 ${isOpen ? 'rotate-45 text-brand-dark' : 'text-brand-dark'
                    }`}>
                    +
                  </span>
                </button>

                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                  <p className="px-6 pb-5 text-brand-muted text-base leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;