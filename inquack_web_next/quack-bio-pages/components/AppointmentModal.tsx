import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, User, Phone, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Service, BusinessHour, QuackPage, Appointment } from '../types';
import { createAppointment, fetchAppointmentsByDate } from '../services/api';

interface AppointmentModalProps {
  service: Service;
  page: QuackPage;
  businessHours: BusinessHour[];
  onClose: () => void;
}

type Step = 'calendar' | 'details' | 'success';

export const AppointmentModal: React.FC<AppointmentModalProps> = ({ service, page, businessHours, onClose }) => {
  const [step, setStep] = useState<Step>('calendar');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Slot Management
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isCalculatingSlots, setIsCalculatingSlots] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const primaryColor = page.primary_color || '#fb923c';

  // --- Utility Functions ---

  // Converts "HH:MM:SS" or "HH:MM" to minutes from midnight
  const timeToMinutes = (timeStr: string) => {
    if (!timeStr) return 0;
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Converts minutes to "HH:MM"
  const minutesToTime = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  // Parse duration string to minutes. Heuristic approach.
  const parseDuration = (durationStr: string | null): number => {
    if (!durationStr) return 60; // Default 1 hour
    const str = durationStr.toLowerCase();
    
    // Check specific keywords
    if (str.includes('hora') || str.includes('h')) {
        const parts = str.match(/(\d+)/g);
        if (parts) {
            let total = 0;
            // Simplified parser: assumes first number is hours unless "min" is explicit
            if (str.includes('min') && !str.includes('h')) {
                return parseInt(parts[0]);
            }
            // If "1h 30min"
            if (str.includes('h')) total += parseInt(parts[0]) * 60;
            if (str.includes('min') && parts.length > 1) total += parseInt(parts[1]);
            
            return total > 0 ? total : 60;
        }
    }
    
    // Fallback: if just a number, assume minutes
    const num = parseInt(str.replace(/\D/g, ''));
    return isNaN(num) ? 60 : num;
  };

  // --- Logic ---

  const getBusinessDayRule = (date: Date) => {
    const dayOfWeekIndex = date.getDay();
    const ptDays = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
    const enDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    
    return businessHours.find(h => {
        const dbDay = h.day_of_week.toLowerCase();
        return dbDay === ptDays[dayOfWeekIndex] || dbDay === enDays[dayOfWeekIndex];
    });
  };

  const calculateSlots = async (date: Date) => {
    setIsCalculatingSlots(true);
    setAvailableSlots([]);
    setSelectedSlot(null);

    try {
        const rule = getBusinessDayRule(date);
        if (!rule || !rule.active || !rule.open_time || !rule.close_time) {
            setIsCalculatingSlots(false);
            return;
        }

        const openMins = timeToMinutes(rule.open_time);
        const closeMins = timeToMinutes(rule.close_time);
        
        // Logic: Calculate service duration, ensure it occupies at least 60 mins blocks
        const rawDuration = parseDuration(service.duration);
        // Force minimum 60 mins if less, otherwise round up to nearest 60 if needed, 
        // OR simply use exact duration for collision check but display in 60min grid.
        // Prompt says: "30 min must occupy 1h full". "2h occupies 2 blocks".
        // Let's treat the 'booking block' as effectively Math.ceil(duration / 60) * 60 for the grid system.
        
        const effectiveDuration = Math.max(60, rawDuration); 

        // Fetch existing appointments
        const dateStr = date.toISOString().split('T')[0];
        const existingApps = await fetchAppointmentsByDate(page.user_id, dateStr);

        const slots: string[] = [];
        
        // Generate grid every 60 minutes
        for (let time = openMins; time + effectiveDuration <= closeMins; time += 60) {
            const slotStart = time;
            const slotEnd = time + effectiveDuration;

            // Collision Detection
            const hasCollision = existingApps.some(app => {
                if (!app.appointment_time) return false;
                const appStart = timeToMinutes(app.appointment_time);
                // Get that appointment's duration. If not present, assume 60.
                // We must respect the existing appointment's actual duration to know when it ends.
                const appDuration = Math.max(60, parseDuration(app.duration || '60')); 
                const appEnd = appStart + appDuration;

                // Check overlap logic: (StartA < EndB) and (EndA > StartB)
                return slotStart < appEnd && slotEnd > appStart;
            });

            if (!hasCollision) {
                slots.push(minutesToTime(time));
            }
        }

        setAvailableSlots(slots);
    } catch (e) {
        console.error("Error calculating slots", e);
    } finally {
        setIsCalculatingSlots(false);
    }
  };

  // --- Calendar Logic ---

  const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const handlePrevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  const isDateDisabled = (day: number) => {
    const dateToCheck = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (dateToCheck < today) return true;
    const businessDay = getBusinessDayRule(dateToCheck);
    return !businessDay || !businessDay.active;
  };

  const handleDateClick = async (day: number) => {
    if (isDateDisabled(day)) return;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setSelectedDate(date);
    setStep('details');
    // Trigger slot calculation
    await calculateSlots(date);
  };

  // --- Form Logic ---

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedSlot || !formData.name || !formData.phone) {
        setError("Por favor, preencha todos os campos e selecione um horário.");
        return;
    }

    setLoading(true);
    setError(null);

    try {
        const appointment: Appointment = {
            user_id: page.user_id,
            client_name: formData.name,
            service_id: service.id,
            appointment_date: selectedDate.toISOString().split('T')[0],
            appointment_time: selectedSlot,
            duration: service.duration || '60 min', // Save original duration string
            cellphone: formData.phone,
            status: 'pending'
        };

        await createAppointment(appointment);
        setStep('success');
    } catch (err) {
        console.error(err);
        setError("Erro ao agendar. O horário pode ter sido ocupado recentemente.");
    } finally {
        setLoading(false);
    }
  };

  const renderCalendar = () => {
    const days = [];
    const totalDays = daysInMonth(currentMonth);
    const startDay = firstDayOfMonth(currentMonth);

    for (let i = 0; i < startDay; i++) days.push(<div key={`empty-${i}`} className="h-10"></div>);

    for (let day = 1; day <= totalDays; day++) {
        const disabled = isDateDisabled(day);
        const isSelected = selectedDate?.getDate() === day && selectedDate?.getMonth() === currentMonth.getMonth();
        
        days.push(
            <button
                key={day}
                onClick={() => handleDateClick(day)}
                disabled={disabled}
                type="button"
                className={`
                    h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium transition-all
                    ${isSelected ? 'text-white shadow-md scale-110' : ''}
                    ${!disabled && !isSelected ? 'hover:bg-gray-100 text-gray-700' : ''}
                    ${disabled ? 'text-gray-300 cursor-not-allowed' : ''}
                `}
                style={isSelected ? { backgroundColor: primaryColor } : {}}
            >
                {day}
            </button>
        );
    }
    return days;
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                    {step === 'calendar' && <><CalendarIcon size={20} className="text-gray-500" /> Selecione a Data</>}
                    {step === 'details' && <><Clock size={20} className="text-gray-500" /> Escolha o Horário</>}
                    {step === 'success' && <><CheckCircle size={20} className="text-green-500" /> Agendado!</>}
                </h3>
                <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                    <X size={20} className="text-gray-500" />
                </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto no-scrollbar">
                
                {/* Step 1: Calendar */}
                {step === 'calendar' && (
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-100 rounded-full">
                                <ChevronLeft size={20} />
                            </button>
                            <span className="font-bold text-gray-800 capitalize">
                                {currentMonth.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}
                            </span>
                            <button onClick={handleNextMonth} className="p-2 hover:bg-gray-100 rounded-full">
                                <ChevronRight size={20} />
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-7 gap-1 text-center mb-2">
                            {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
                                <span key={i} className="text-xs font-bold text-gray-400">{d}</span>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 gap-1 justify-items-center">
                            {renderCalendar()}
                        </div>
                    </div>
                )}

                {/* Step 2: Details & Slot Selection */}
                {step === 'details' && (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                            <h4 className="font-bold text-gray-800 mb-1">{service.name}</h4>
                            <div className="text-sm text-gray-600 flex flex-wrap gap-4">
                                <span className="flex items-center gap-1"><CalendarIcon size={14}/> {selectedDate?.toLocaleDateString('pt-BR')}</span>
                                {service.duration && <span className="flex items-center gap-1"><Clock size={14}/> {service.duration}</span>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Horários Disponíveis</label>
                            
                            {isCalculatingSlots ? (
                                <div className="flex items-center justify-center py-8 text-gray-400 gap-2">
                                    <Loader2 className="animate-spin" size={20}/>
                                    <span className="text-sm">Verificando agenda...</span>
                                </div>
                            ) : availableSlots.length > 0 ? (
                                <div className="grid grid-cols-4 gap-2">
                                    {availableSlots.map(slot => (
                                        <button
                                            key={slot}
                                            type="button"
                                            onClick={() => setSelectedSlot(slot)}
                                            className={`
                                                py-2 rounded-lg text-sm font-semibold border transition-all
                                                ${selectedSlot === slot 
                                                    ? 'text-white border-transparent shadow-md transform scale-105' 
                                                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'}
                                            `}
                                            style={selectedSlot === slot ? { backgroundColor: primaryColor } : {}}
                                        >
                                            {slot}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-500 text-sm">
                                    Sem horários disponíveis para este dia.
                                </div>
                            )}
                        </div>

                        {selectedSlot && (
                            <div className="animate-fade-in space-y-4 pt-2 border-t border-gray-100">
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
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefone / WhatsApp</label>
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
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-start gap-2">
                                <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="flex gap-3 mt-2">
                            <button 
                                type="button"
                                onClick={() => setStep('calendar')}
                                className="flex-1 py-3 rounded-xl font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                            >
                                Voltar
                            </button>
                            <button 
                                type="submit"
                                disabled={loading || !selectedSlot}
                                className="flex-[2] py-3 rounded-xl font-bold text-white shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                                style={{ backgroundColor: primaryColor }}
                            >
                                {loading ? 'Confirmando...' : 'Confirmar Agendamento'}
                            </button>
                        </div>
                    </form>
                )}

                {/* Step 3: Success */}
                {step === 'success' && (
                    <div className="text-center py-8">
                        <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                            <CheckCircle size={40} />
                        </div>
                        <h4 className="text-2xl font-bold text-gray-800 mb-2">Agendamento Confirmado!</h4>
                        <p className="text-gray-600 mb-8">
                            Obrigado, {formData.name}.<br/>
                            Seu horário para <strong>{service.name}</strong> foi reservado para o dia <strong>{selectedDate?.toLocaleDateString('pt-BR')}</strong> às <strong>{selectedSlot}</strong>.
                        </p>
                        <button 
                            onClick={onClose}
                            className="w-full py-3 rounded-xl font-bold text-white transition-opacity hover:opacity-90"
                            style={{ backgroundColor: primaryColor }}
                        >
                            Fechar
                        </button>
                    </div>
                )}

            </div>
        </div>
    </div>
  );
};
