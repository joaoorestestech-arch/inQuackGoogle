import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, CreditCard, User, MapPin, Phone, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { CartItem, QuackPage, Sale } from '../types';
import { createSales } from '../services/api';

interface CartModalProps {
  cart: CartItem[];
  page: QuackPage;
  onClose: () => void;
  onAdd: (item: CartItem) => void;
  onRemove: (item: CartItem) => void;
  onClear: () => void;
}

type Step = 'review' | 'checkout' | 'success';

export const CartModal: React.FC<CartModalProps> = ({ cart, page, onClose, onAdd, onRemove, onClear }) => {
  const [step, setStep] = useState<Step>('review');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    paymentMethod: 'pix'
  });

  const primaryColor = page.primary_color || '#fb923c';

  const total = cart.reduce((acc, item) => acc + (item.price * item.cartQuantity), 0);
  const formatPrice = (price: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address) {
        setError("Por favor, preencha todos os campos obrigatórios.");
        return;
    }

    setLoading(true);
    setError(null);

    try {
        // Prepare sales data
        // Database Schema: One row per 'sale'. Since we don't have a 'quantity' column in sales table,
        // we create one row per product type, with the 'amount' being total price (price * qty).
        const salesData: Sale[] = cart.map(item => ({
            user_id: page.user_id,
            client_name: formData.name,
            product_id: item.id,
            amount: item.price * item.cartQuantity, // Total value for this line item
            payment_method: formData.paymentMethod,
            cellphone: formData.phone,
            adress: formData.address,
            status: 'success'
        }));

        await createSales(salesData);
        onClear(); // Clear global cart
        setStep('success');
    } catch (err) {
        console.error(err);
        setError("Erro ao finalizar compra. Tente novamente.");
    } finally {
        setLoading(false);
    }
  };

  if (cart.length === 0 && step !== 'success') {
      return null;
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
        <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh]">
            
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                    {step === 'review' && <><ShoppingBag size={20} className="text-gray-500" /> Seu Carrinho</>}
                    {step === 'checkout' && <><CreditCard size={20} className="text-gray-500" /> Finalizar Pedido</>}
                    {step === 'success' && <><CheckCircle size={20} className="text-green-500" /> Pedido Recebido!</>}
                </h3>
                <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                    <X size={20} className="text-gray-500" />
                </button>
            </div>

            {/* Content */}
            <div className="p-0 overflow-y-auto no-scrollbar flex-grow bg-gray-50/50">
                
                {/* Step 1: Review Cart */}
                {step === 'review' && (
                    <div className="p-4 space-y-4">
                        {cart.map(item => (
                            <div key={item.id} className="bg-white p-3 rounded-xl border border-gray-100 flex gap-3 shadow-sm">
                                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                    {item.image_url ? (
                                        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover"/>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300"><ShoppingBag size={20}/></div>
                                    )}
                                </div>
                                <div className="flex-grow flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-semibold text-gray-800 text-sm line-clamp-1">{item.name}</h4>
                                        <span className="font-bold text-gray-900 text-sm">{formatPrice(item.price * item.cartQuantity)}</span>
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                        <div className="text-xs text-gray-500">
                                            Unit: {formatPrice(item.price)}
                                        </div>
                                        <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-2 py-1 border border-gray-200">
                                            <button onClick={() => onRemove(item)} className="text-gray-500 hover:text-red-500">-</button>
                                            <span className="text-xs font-bold w-4 text-center">{item.cartQuantity}</span>
                                            <button onClick={() => onAdd(item)} className="text-gray-500 hover:text-green-500">+</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Step 2: Checkout Form */}
                {step === 'checkout' && (
                    <form id="checkout-form" onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 mb-2 flex justify-between items-center">
                            <span className="text-gray-600 font-medium">Total a Pagar</span>
                            <span className="text-xl font-bold text-gray-900">{formatPrice(total)}</span>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input 
                                    type="text" 
                                    required
                                    placeholder="Seu nome"
                                    className="w-full pl-10 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Telefone / Celular</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input 
                                    type="tel" 
                                    required
                                    placeholder="(00) 00000-0000"
                                    className="w-full pl-10 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                                    value={formData.phone}
                                    onChange={e => setFormData({...formData, phone: e.target.value})}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Endereço de Entrega</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                                <textarea 
                                    required
                                    rows={2}
                                    placeholder="Rua, Número, Bairro, Cidade..."
                                    className="w-full pl-10 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all resize-none"
                                    value={formData.address}
                                    onChange={e => setFormData({...formData, address: e.target.value})}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Forma de Pagamento</label>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { id: 'pix', label: 'PIX' },
                                    { id: 'credit_card', label: 'Cartão' },
                                    { id: 'cash', label: 'Dinheiro' }
                                ].map(method => (
                                    <button
                                        key={method.id}
                                        type="button"
                                        onClick={() => setFormData({...formData, paymentMethod: method.id})}
                                        className={`py-2 rounded-lg text-sm font-medium border transition-all ${
                                            formData.paymentMethod === method.id 
                                            ? 'bg-gray-800 text-white border-gray-800' 
                                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                        }`}
                                    >
                                        {method.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-start gap-2">
                                <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}
                    </form>
                )}

                {/* Step 3: Success */}
                {step === 'success' && (
                    <div className="text-center py-12 px-6">
                        <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                            <CheckCircle size={40} />
                        </div>
                        <h4 className="text-2xl font-bold text-gray-800 mb-2">Pedido Realizado!</h4>
                        <p className="text-gray-600 mb-8">
                            Obrigado, {formData.name}.<br/>
                            Recebemos seu pedido e entraremos em contato pelo número informado para confirmar a entrega.
                        </p>
                    </div>
                )}
            </div>

            {/* Footer / Actions */}
            {step !== 'success' && (
                <div className="p-4 bg-white border-t border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-500 text-sm">Total</span>
                        <span className="text-2xl font-bold text-gray-900">{formatPrice(total)}</span>
                    </div>
                    
                    <div className="flex gap-3">
                        {step === 'checkout' && (
                            <button 
                                onClick={() => setStep('review')}
                                className="px-4 py-3 rounded-xl font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                            >
                                Voltar
                            </button>
                        )}
                        
                        {step === 'review' ? (
                            <button 
                                onClick={() => setStep('checkout')}
                                className="w-full py-3 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 hover:opacity-90 transition-all"
                                style={{ backgroundColor: primaryColor }}
                            >
                                Continuar para Entrega
                                <ArrowRight size={18} />
                            </button>
                        ) : (
                            <button 
                                form="checkout-form"
                                type="submit"
                                disabled={loading}
                                className="flex-grow py-3 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                                style={{ backgroundColor: primaryColor }}
                            >
                                {loading ? 'Enviando...' : 'Finalizar Compra'}
                            </button>
                        )}
                    </div>
                </div>
            )}
             {step === 'success' && (
                <div className="p-4 bg-white border-t border-gray-100">
                    <button 
                        onClick={onClose}
                        className="w-full py-3 rounded-xl font-bold text-white shadow-lg hover:opacity-90 transition-all"
                        style={{ backgroundColor: primaryColor }}
                    >
                        Fechar
                    </button>
                </div>
            )}
        </div>
    </div>
  );
};
