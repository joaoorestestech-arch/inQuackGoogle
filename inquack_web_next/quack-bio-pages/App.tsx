import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, useParams, Navigate } from 'react-router-dom';
import { fetchPageBySlug, fetchPageData } from './services/api';
import { QuackPage, Product, Service, BusinessHour, ViewState, CartItem } from './types';
import { Loading } from './components/Loading';
import { SocialLinks } from './components/SocialLinks';
import { ProductCard } from './components/ProductCard';
import { ServiceCard } from './components/ServiceCard';
import { BusinessInfo } from './components/BusinessInfo';
import { AppointmentModal } from './components/AppointmentModal';
import { CartModal } from './components/CartModal';
import { Store, Calendar, Info, MapPin, ShoppingCart } from 'lucide-react';

// Landing component
const Home = () => (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-gray-50">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Quack Pages</h1>
        <p className="text-gray-600 mb-8 max-w-md">Create your own mini-store and bio page instantly. Visit a store by using the URL.</p>
        <div className="p-4 bg-white rounded-lg shadow-sm border text-sm text-gray-500">
            Try: <a href="/#/aurora-spa" className="text-orange-500 hover:underline">/aurora-spa</a>
        </div>
    </div>
);

// Main Profile Viewer Component
const ProfileViewer = () => {
    const { slug } = useParams<{ slug: string }>();
    const [page, setPage] = useState<QuackPage | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [hours, setHours] = useState<BusinessHour[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<ViewState>('products');
    
    // Cart State
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Modal State
    const [selectedService, setSelectedService] = useState<Service | null>(null);

    useEffect(() => {
        if (!slug) return;

        const loadData = async () => {
            try {
                setLoading(true);
                const pageData = await fetchPageBySlug(slug);
                if (!pageData) {
                    setError("Página não encontrada");
                    return;
                }
                setPage(pageData);

                if (pageData.user_id) {
                    const relatedData = await fetchPageData(pageData.user_id);
                    setProducts(relatedData.products);
                    setServices(relatedData.services);
                    setHours(relatedData.hours);
                    
                    if (relatedData.products.length > 0 && pageData.show_products) {
                        setActiveTab('products');
                    } else if (relatedData.services.length > 0 && pageData.show_services) {
                        setActiveTab('services');
                    } else {
                        setActiveTab('info');
                    }
                }
            } catch (err: any) {
                console.error("Error fetching data:", err);
                setError("Não foi possível carregar a loja. Verifique o endereço.");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [slug]);

    // Cart Handlers
    const addToCart = (product: Product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item => 
                    item.id === product.id 
                    ? { ...item, cartQuantity: item.cartQuantity + 1 }
                    : item
                );
            }
            return [...prev, { ...product, cartQuantity: 1 }];
        });
    };

    const removeFromCart = (product: Product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing && existing.cartQuantity > 1) {
                return prev.map(item => 
                    item.id === product.id 
                    ? { ...item, cartQuantity: item.cartQuantity - 1 }
                    : item
                );
            }
            return prev.filter(item => item.id !== product.id);
        });
    };

    const clearCart = () => setCart([]);

    const getCartQuantity = (productId: string) => {
        return cart.find(item => item.id === productId)?.cartQuantity || 0;
    };

    const cartTotalItems = cart.reduce((acc, item) => acc + item.cartQuantity, 0);
    const cartTotalPrice = cart.reduce((acc, item) => acc + (item.price * item.cartQuantity), 0);

    if (loading) return <Loading />;
    
    if (error || !page) return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Ops! 🦆</h2>
                <p className="text-gray-600">{error || "Página não encontrada"}</p>
                <a href="/" className="mt-4 inline-block text-orange-500 hover:underline">Voltar ao início</a>
            </div>
        </div>
    );

    const primaryColor = page.primary_color || '#fb923c';
    const textColor = page.text_color || '#1f2937';
    const showProductsTab = page.show_products && products.length > 0;
    const showServicesTab = page.show_services && services.length > 0;

    return (
        <div className="min-h-screen bg-gray-50 pb-20 font-sans">
            {/* --- Banner Area --- */}
            <div className="relative">
                <div 
                    className="h-48 w-full bg-cover bg-center relative"
                    style={{ 
                        backgroundImage: page.banner_url ? `url(${page.banner_url})` : undefined,
                        backgroundColor: !page.banner_url ? primaryColor : undefined 
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/30"></div>
                </div>

                <div className="container mx-auto px-4 relative -mt-16 flex flex-col items-center">
                    <div className="relative">
                        <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
                            {page.profile_url ? (
                                <img src={page.profile_url} alt={page.store_name || "Profile"} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400 text-3xl font-bold">
                                    {(page.store_name || "S").charAt(0)}
                                </div>
                            )}
                        </div>
                        <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>

                    <div className="text-center mt-3 max-w-lg">
                        <h1 className="text-2xl font-bold text-gray-900 leading-tight">{page.store_name}</h1>
                        <div className="flex items-center justify-center gap-1 text-gray-500 text-sm mt-1">
                            {page.address && (
                                <>
                                    <MapPin size={14} />
                                    <span>{page.address.split(',')[0]}</span>
                                </>
                            )}
                        </div>
                        {page.bio && (
                            <p className="text-gray-600 mt-2 text-sm leading-relaxed px-4">{page.bio}</p>
                        )}
                    </div>

                    <SocialLinks page={page} iconColor={textColor} />
                </div>
            </div>

            {/* --- Content Area --- */}
            <main className="container mx-auto px-4 mt-2 max-w-xl">
                
                {activeTab === 'products' && (
                    <div className="animate-fade-in pb-24">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-gray-800">Destaques</h2>
                            <span className="text-xs text-gray-500">{products.length} itens</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {products.map(product => (
                                <ProductCard 
                                    key={product.id} 
                                    product={product} 
                                    primaryColor={primaryColor} 
                                    cartQuantity={getCartQuantity(product.id)}
                                    onAdd={addToCart}
                                    onRemove={removeFromCart}
                                />
                            ))}
                        </div>
                        {products.length === 0 && (
                            <div className="text-center py-10 text-gray-400">Nenhum produto cadastrado.</div>
                        )}
                    </div>
                )}

                {activeTab === 'services' && (
                    <div className="animate-fade-in pb-24">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-gray-800">Serviços</h2>
                        </div>
                        <div className="flex flex-col">
                            {services.map(service => (
                                <ServiceCard 
                                    key={service.id} 
                                    service={service} 
                                    primaryColor={primaryColor} 
                                    onSchedule={setSelectedService}
                                />
                            ))}
                        </div>
                         {services.length === 0 && (
                            <div className="text-center py-10 text-gray-400">Nenhum serviço disponível.</div>
                        )}
                    </div>
                )}

                {activeTab === 'info' && (
                    <div className="animate-fade-in">
                        <BusinessInfo page={page} hours={hours} primaryColor={primaryColor} />
                    </div>
                )}
            </main>

            {/* --- Floating Cart Button --- */}
            {cartTotalItems > 0 && !isCartOpen && (
                <div className="fixed bottom-24 right-4 z-40 animate-bounce-in">
                    <button 
                        onClick={() => setIsCartOpen(true)}
                        className="flex items-center gap-3 px-5 py-3 rounded-full shadow-xl text-white font-bold transition-transform hover:scale-105 active:scale-95"
                        style={{ backgroundColor: primaryColor }}
                    >
                        <div className="relative">
                            <ShoppingCart size={24} />
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                                {cartTotalItems}
                            </span>
                        </div>
                        <span>
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cartTotalPrice)}
                        </span>
                    </button>
                </div>
            )}

            {/* --- Sticky Bottom Navigation --- */}
            <div className="fixed bottom-6 left-0 right-0 px-4 z-50 flex justify-center pointer-events-none">
                <div className="bg-gray-900/95 backdrop-blur-md text-white rounded-full shadow-2xl px-2 py-2 flex items-center gap-1 pointer-events-auto border border-white/10 max-w-sm w-full justify-between">
                    
                    {showProductsTab && (
                        <button 
                            onClick={() => setActiveTab('products')}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-full transition-all duration-300 ${activeTab === 'products' ? 'bg-orange-500 text-white font-bold shadow-lg' : 'text-gray-400 hover:text-white'}`}
                            style={{ backgroundColor: activeTab === 'products' ? primaryColor : 'transparent' }}
                        >
                            <Store size={20} />
                            <span className={activeTab === 'products' ? 'block' : 'hidden md:block'}>Shops</span>
                        </button>
                    )}

                    {showServicesTab && (
                        <button 
                            onClick={() => setActiveTab('services')}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-full transition-all duration-300 ${activeTab === 'services' ? 'bg-orange-500 text-white font-bold shadow-lg' : 'text-gray-400 hover:text-white'}`}
                            style={{ backgroundColor: activeTab === 'services' ? primaryColor : 'transparent' }}
                        >
                            <Calendar size={20} />
                            <span className={activeTab === 'services' ? 'block' : 'hidden md:block'}>Agenda</span>
                        </button>
                    )}

                    <button 
                        onClick={() => setActiveTab('info')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-full transition-all duration-300 ${activeTab === 'info' ? 'bg-orange-500 text-white font-bold shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        style={{ backgroundColor: activeTab === 'info' ? primaryColor : 'transparent' }}
                    >
                        <Info size={20} />
                        <span className={activeTab === 'info' ? 'block' : 'hidden md:block'}>Links</span>
                    </button>
                </div>
            </div>

            {/* --- Modals --- */}
            {selectedService && page && (
                <AppointmentModal 
                    service={selectedService}
                    page={page}
                    businessHours={hours}
                    onClose={() => setSelectedService(null)}
                />
            )}

            {isCartOpen && page && (
                <CartModal 
                    cart={cart}
                    page={page}
                    onClose={() => setIsCartOpen(false)}
                    onAdd={addToCart}
                    onRemove={removeFromCart}
                    onClear={clearCart}
                />
            )}
        </div>
    );
};

// Main App Router
function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:slug" element={<ProfileViewer />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
