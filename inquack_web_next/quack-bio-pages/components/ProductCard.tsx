import React from 'react';
import { Product } from '../types';
import { ShoppingBag, Plus, Minus, Monitor, Package } from 'lucide-react'; // Adicionei ícones novos

interface ProductCardProps {
  product: Product;
  primaryColor: string;
  cartQuantity: number;
  onAdd: (product: Product) => void;
  onRemove: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, primaryColor, cartQuantity, onAdd, onRemove }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow relative">
      
      {/* TAG DE STATUS (Físico ou Digital) */}
      <div className="absolute top-3 left-3 z-10 flex gap-1">
        {product.status === 'D' ? (
          <span className="flex items-center gap-1 bg-blue-100 text-blue-700 text-[10px] font-black px-2 py-1 rounded-lg border border-blue-200 shadow-sm uppercase tracking-wider">
            <Monitor size={10} /> Digital
          </span>
        ) : (
          <span className="flex items-center gap-1 bg-amber-100 text-amber-700 text-[10px] font-black px-2 py-1 rounded-lg border border-amber-200 shadow-sm uppercase tracking-wider">
            <Package size={10} /> Físico
          </span>
        )}
      </div>

      <div className="relative h-48 bg-gray-100 group">
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <ShoppingBag size={48} />
          </div>
        )}
        
        {/* Quantity Badge on Image if in cart */}
        {cartQuantity > 0 && (
            <div className="absolute top-2 right-2 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-lg animate-in zoom-in"
                 style={{ backgroundColor: primaryColor }}>
                {cartQuantity}
            </div>
        )}
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-gray-800 text-lg mb-1 leading-tight">{product.name}</h3>
        {product.description && (
          <p className="text-gray-500 text-sm mb-3 line-clamp-2 flex-grow">{product.description}</p>
        )}
        
        <div className="mt-auto pt-2">
            <div className="flex justify-between items-center mb-3">
                <span className="text-xl font-bold text-gray-900">{formatPrice(Number(product.price))}</span>
            </div>
            
            {cartQuantity === 0 ? (
                <button 
                    onClick={() => onAdd(product)}
                    className="w-full py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-medium text-white transition-all hover:opacity-90 active:scale-[0.98] shadow-sm"
                    style={{ backgroundColor: primaryColor }}
                >
                    <Plus size={16} />
                    Adicionar
                </button>
            ) : (
                <div className="flex items-center justify-between bg-gray-50 rounded-xl p-1 border border-gray-200">
                    <button 
                        onClick={() => onRemove(product)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-gray-600 shadow-sm hover:bg-gray-100 transition-colors"
                    >
                        <Minus size={14} />
                    </button>
                    <span className="font-bold text-gray-800 text-sm">{cartQuantity}</span>
                    <button 
                        onClick={() => onAdd(product)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-white shadow-sm hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: primaryColor }}
                    >
                        <Plus size={14} />
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}