'use client';

import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';

interface Patient { id: string; name: string; }
interface Appointment { id: string; date: string; status: string; type: string; patientId: string; professionalId: string; duration: number }

export default function Appointments() {
    const { user, authLoading, logout } = useAuth();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ date: '', time: '', patientId: '', professionalId: '', type: 'CONSULTATION', duration: 30 });

    const [currentView, setCurrentView] = useState('Week');
    const [isAllDoctors, setIsAllDoctors] = useState(true);
    const [isExamRooms, setIsExamRooms] = useState(false);
    const [weekOffset, setWeekOffset] = useState(0);
    const [selectedAppointment, setSelectedAppointment] = useState<{name: string, type: string, time: string} | null>(null);

    useEffect(() => {
        if (!user) return;
        const fetchInitialData = async () => {
            try {
                const [a, p] = await Promise.all([api.get('/appointment'), api.get('/patient')]);
                setAppointments(a.data);
                setPatients(p.data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, [user]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const tenantId = user.memberships[0].tenant.id;
            const fullDate = new Date(`${formData.date}T${formData.time}:00`).toISOString();
            const res = await api.post('/appointment', { tenantId, ...formData, date: fullDate, status: 'SCHEDULED' });
            setAppointments([...appointments, res.data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
            setIsModalOpen(false);
        } catch { alert('Falha ao agendar.'); }
    };

    if (authLoading || loading || !user) return <div className="min-h-screen bg-white flex items-center justify-center font-headline text-slate-400 font-bold">Synchronizing Agenda...</div>;

    const hours = ['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM'];
    const days = [
        { name: 'MON', num: '23', active: false },
        { name: 'TUE', num: '24', active: true },
        { name: 'WED', num: '25', active: false },
        { name: 'THU', num: '26', active: false },
        { name: 'FRI', num: '27', active: false },
        { name: 'SAT', num: '28', active: false, fade: true },
        { name: 'SUN', num: '29', active: false, fade: true },
    ];

    // Helpers for grid positioning mock based on reference image
    const calculateTop = (timeStr: string) => {
        const [hour, min] = timeStr.split(':');
        const h = parseInt(hour, 10);
        const relativeHour = h >= 8 ? h - 8 : h + 4; // Map 8am to 0, 1pm to 5
        return (relativeHour * 100) + parseInt(min, 10) * (100 / 60);
    };

    return (
        <AppLayout userProfile={user} currentRoute="appointments" onLogout={logout}>
            <div className="p-8 max-w-7xl mx-auto pb-32">
                {/* Header Sequence */}
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-[32px] font-extrabold font-headline tracking-[-0.03em] text-slate-800">Weekly Agenda</h2>
                        <div className="flex items-center gap-4 mt-2 text-slate-800 font-semibold">
                            <button onClick={() => setWeekOffset(weekOffset - 1)} className="text-slate-400 hover:text-slate-600 transition-colors"><span className="material-symbols-outlined text-sm">arrow_back_ios</span></button>
                            <span className="text-sm">October {23 + (weekOffset * 7)} — {29 + (weekOffset * 7)}, 2023</span>
                            <button onClick={() => setWeekOffset(weekOffset + 1)} className="text-slate-400 hover:text-slate-600 transition-colors"><span className="material-symbols-outlined text-sm">arrow_forward_ios</span></button>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
                            <button onClick={() => setCurrentView('Week')} className={`px-5 py-2 text-sm font-semibold rounded-lg ${currentView === 'Week' ? 'font-bold text-[#005bc1] bg-blue-50/50' : 'text-slate-500 hover:text-slate-700'}`}>Week</button>
                            <button onClick={() => setCurrentView('Day')} className={`px-5 py-2 text-sm font-semibold rounded-lg ${currentView === 'Day' ? 'font-bold text-[#005bc1] bg-blue-50/50' : 'text-slate-500 hover:text-slate-700'}`}>Day</button>
                            <button onClick={() => setCurrentView('Month')} className={`px-5 py-2 text-sm font-semibold rounded-lg ${currentView === 'Month' ? 'font-bold text-[#005bc1] bg-blue-50/50' : 'text-slate-500 hover:text-slate-700'}`}>Month</button>
                        </div>
                        
                        <button onClick={() => setIsAllDoctors(!isAllDoctors)} className={`flex items-center gap-2 px-4 py-2 border rounded-xl shadow-sm transition-colors ${isAllDoctors ? 'bg-[#005bc1] text-white border-[#005bc1]' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`}>
                            <span className={`material-symbols-outlined text-[18px] ${isAllDoctors ? 'text-white' : 'text-slate-500'}`}>filter_list</span>
                            <span className="text-sm font-bold">All Doctors</span>
                        </button>
                        
                        <button onClick={() => setIsExamRooms(!isExamRooms)} className={`flex items-center gap-2 px-4 py-2 border rounded-xl shadow-sm transition-colors ${isExamRooms ? 'bg-[#005bc1] text-white border-[#005bc1]' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`}>
                            <span className={`material-symbols-outlined text-[18px] ${isExamRooms ? 'text-white' : 'text-slate-500'}`}>door_open</span>
                            <span className="text-sm font-bold">Exam Rooms</span>
                        </button>
                    </div>
                </div>

                {/* Calendar Grid Canvas */}
                <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm relative">
                    
                    {/* Days Header */}
                    <div className="flex border-b border-slate-100 pl-20">
                        {days.map((day, idx) => (
                            <div key={idx} className={`flex-1 flex flex-col items-center justify-center py-5 ${day.active ? 'bg-[#eef3fb]' : ''} border-r border-slate-100 last:border-r-0`}>
                                <span className={`text-[11px] font-bold tracking-widest uppercase mb-1 ${day.active ? 'text-[#005bc1]' : day.fade ? 'text-slate-300' : 'text-slate-400'}`}>{day.name}</span>
                                <span className={`text-[20px] font-extrabold font-headline ${day.active ? 'text-[#005bc1]' : day.fade ? 'text-slate-300' : 'text-slate-800'}`}>{day.num}</span>
                                {day.active && <div className="w-1 h-1 bg-[#005bc1] rounded-full mt-1"></div>}
                            </div>
                        ))}
                    </div>

                    {/* Grid Body */}
                    <div className="relative" style={{ height: '800px' }}>
                        
                        {/* Time Markers */}
                        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
                            {hours.map((time, idx) => (
                                <div key={idx} className="flex h-[100px] border-b border-slate-100 last:border-b-0 w-full">
                                    <div className="w-20 shrink-0 flex items-start justify-center pt-2">
                                        <span className="text-[11px] font-bold text-slate-500">{time}</span>
                                    </div>
                                    <div className="flex-1 flex pointer-events-none">
                                        {days.map((_, dIdx) => (
                                            <div key={dIdx} className="flex-1 border-r border-slate-100 last:border-r-0"></div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Current Time Indicator Row */}
                        <div className="absolute w-full flex items-center z-20" style={{ top: '350px' }}>
                            <div className="w-20 flex justify-center">
                                <span className="bg-[#b34032] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">11:27 AM</span>
                            </div>
                            <div className="flex-1 h-[2px] bg-[#b34032] flex items-center w-full">
                                <div className="w-2 h-2 rounded-full bg-[#b34032] -ml-1"></div>
                            </div>
                        </div>

                        {/* Events Overlay Container */}
                        <div className="absolute top-0 left-20 right-0 bottom-0 flex z-10 p-1">
                            {/* Mon Column */}
                            <div className="flex-1 relative">
                                <div onClick={() => setSelectedAppointment({name: 'Beatrice Thorne', type: 'Cardiology Check-up', time: '09:00 - 09:45'})} className="absolute left-2 right-2 bg-blue-50 border border-blue-200 rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer" style={{ top: '100px', height: '75px' }}>
                                    <h4 className="font-bold text-[#005bc1] text-sm leading-tight">Beatrice Thorne</h4>
                                    <p className="text-[11px] text-[#005bc1]/80 mt-0.5 leading-tight">Cardiology Check-up</p>
                                    <span className="text-[10px] font-bold text-[#005bc1] mt-2 block">09:00 - 09:45</span>
                                </div>
                            </div>
                            
                            {/* Tue Column */}
                            <div className="flex-1 relative bg-[#eef3fb]/30 border-r border-slate-100">
                                <div onClick={() => setSelectedAppointment({name: 'Marcus Holloway', type: 'Post-Op Review', time: '08:30 - 10:00'})} className="absolute left-2 right-2 bg-[#005bc1] rounded-2xl p-3.5 shadow-lg shadow-blue-500/30 cursor-pointer overflow-hidden group flex flex-col" style={{ top: '50px', height: '120px' }}>
                                    <div className="flex items-center gap-1.5 mb-1 shrink-0">
                                        <span className="material-symbols-outlined text-white text-[12px]">emergency</span>
                                        <span className="text-[9px] font-bold text-white tracking-widest uppercase">Urgent</span>
                                    </div>
                                    <div className="flex-1 min-h-0 overflow-hidden">
                                        <h4 className="font-extrabold text-white text-[13px] sm:text-[14px] leading-tight mb-0.5 truncate">Marcus Holloway</h4>
                                        <p className="text-[10px] sm:text-[11px] text-blue-100 font-medium leading-tight truncate">Post-Op Review</p>
                                    </div>
                                    
                                    <div className="mt-auto flex justify-between items-end shrink-0 pt-1">
                                        <span className="text-[10px] sm:text-[11px] font-bold text-white">08:30 - 10:00</span>
                                        <div className="relative w-6 h-6">
                                            <img src="https://i.pravatar.cc/150?u=marcus" className="absolute inset-0 w-full h-full rounded-full border border-blue-400 transition-opacity group-hover:opacity-0" />
                                            <div className="absolute inset-0 bg-[#00428e] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="material-symbols-outlined text-white text-[14px]">more_vert</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Wed Column */}
                            <div className="flex-1 relative">
                                <div className="absolute left-2 right-2 bg-[#eef3ea] border border-[#d6e5d0] rounded-xl p-3 shadow-sm cursor-pointer" style={{ top: '225px', height: '75px' }}>
                                    <h4 className="font-bold text-[#2d501d] text-sm leading-tight">Evelyn Harper</h4>
                                    <p className="text-[11px] text-[#4d723d] mt-0.5 leading-tight">Lab Results Review</p>
                                    <span className="text-[10px] font-bold text-[#2d501d] mt-2 block">10:15 - 11:00</span>
                                </div>
                            </div>
                            
                            {/* Thu Column */}
                            <div className="flex-1 relative">
                                <div className="absolute left-2 right-2 bg-[#f4f5f7] border border-slate-200 rounded-xl p-3 shadow-sm cursor-pointer" style={{ top: '100px', height: '150px' }}>
                                    <h4 className="font-bold text-slate-800 text-sm leading-tight">Julian Rossi</h4>
                                    <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">Initial Consultation</p>
                                    <div className="absolute bottom-3 left-3">
                                        <span className="text-[10px] font-bold text-slate-600">09:00 - 10:30</span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Fri Column */}
                            <div className="flex-1 relative">
                                <div className="absolute left-2 right-2 bg-blue-50 border border-blue-200 rounded-xl p-3 shadow-sm cursor-pointer" style={{ top: '400px', height: '75px' }}>
                                    <h4 className="font-bold text-[#005bc1] text-sm leading-tight">Sarah Jenkins</h4>
                                    <p className="text-[11px] text-[#005bc1]/80 mt-0.5 leading-tight">Routine Follow-up</p>
                                    <span className="text-[10px] font-bold text-[#005bc1] mt-2 block">12:00 - 12:45</span>
                                </div>
                            </div>
                            
                            {/* Sat Column */}
                            <div className="flex-1 relative"></div>
                            
                            {/* Sun Column */}
                            <div className="flex-1 relative"></div>
                        </div>
                    </div>
                </div>

                {/* Bottom Floating Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    {/* Today's Load */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between h-40">
                        <div className="flex justify-between items-start">
                            <span className="text-[11px] font-bold text-slate-500 tracking-widest uppercase">Today's Load</span>
                            <span className="material-symbols-outlined text-[#005bc1]">bar_chart</span>
                        </div>
                        <div>
                            <h3 className="text-4xl font-extrabold font-headline tracking-tighter text-slate-800 leading-none mb-1">14</h3>
                            <p className="text-sm font-medium text-slate-500">Appointments Scheduled</p>
                        </div>
                        <div className="flex gap-1.5 mt-2">
                            <div className="h-1.5 flex-1 bg-[#005bc1] rounded-full"></div>
                            <div className="h-1.5 flex-1 bg-[#005bc1] rounded-full"></div>
                            <div className="h-1.5 flex-1 bg-[#005bc1] rounded-full"></div>
                            <div className="h-1.5 flex-1 bg-slate-200 rounded-full"></div>
                            <div className="h-1.5 flex-1 bg-slate-200 rounded-full"></div>
                        </div>
                    </div>

                    {/* Next Patient */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between h-40">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-slate-600">notifications_active</span>
                            </div>
                            <div>
                                <span className="text-[11px] font-bold text-slate-500 tracking-widest uppercase mb-1 block">Next Patient</span>
                                <h4 className="text-[16px] font-bold font-headline text-slate-800 leading-none">Eleanor Rigby</h4>
                            </div>
                        </div>
                        <div className="flex items-center justify-between bg-slate-50 rounded-xl p-3">
                            <span className="text-[13px] font-bold text-[#005bc1]">In 12 minutes</span>
                            <button onClick={() => alert('Quarto da clínica notificado para receber o paciente Eleanor Rigby.')} className="text-[11px] font-bold text-slate-500 tracking-wider hover:text-slate-800 transition-colors uppercase">Notify Room</button>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between h-40">
                        <span className="text-[11px] font-bold text-slate-500 tracking-widest uppercase mb-2 block">Quick Actions</span>
                        <div className="flex flex-wrap gap-2 gap-y-3">
                            <button onClick={() => window.print()} className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 transition-colors px-4 py-2.5 rounded-full">
                                <span className="material-symbols-outlined text-[16px] text-slate-600">print</span>
                                <span className="text-xs font-bold text-slate-700">Print Daily</span>
                            </button>
                            <button onClick={() => alert('Lembretes enviados por SMS/WhatsApp para todos os pacientes de hoje.')} className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 transition-colors px-4 py-2.5 rounded-full">
                                <span className="material-symbols-outlined text-[16px] text-slate-600">share</span>
                                <span className="text-xs font-bold text-slate-700">Send Reminders</span>
                            </button>
                            <button onClick={() => alert('Acesso a bloqueio de agenda aberto.')} className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 transition-colors px-4 py-2.5 rounded-full">
                                <span className="material-symbols-outlined text-[16px] text-slate-600">block</span>
                                <span className="text-xs font-bold text-slate-700">Block Time</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Action Button */}
            <button onClick={() => setIsModalOpen(true)} className="fixed bottom-10 right-10 w-16 h-16 bg-[#005bc1] hover:bg-blue-700 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/40 transition-transform hover:scale-105 active:scale-95 z-50">
                <span className="material-symbols-outlined text-[32px]">add</span>
            </button>

            {/* Modal for new appointment (Preserved logical functionality) */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
                    <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl">
                        <h2 className="text-2xl font-bold font-headline mb-6 text-slate-800">Nova Consulta</h2>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-500 mb-1" htmlFor="pacientSelect">Paciente</label>
                                <select id="pacientSelect" required value={formData.patientId} onChange={e => setFormData({...formData, patientId: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#005bc1]/50 focus:border-[#005bc1] text-slate-800">
                                    <option value="">Selecione...</option>
                                    {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-500 mb-1" htmlFor="profId">ID Profissional</label>
                                <input id="profId" required type="text" value={formData.professionalId} onChange={e => setFormData({...formData, professionalId: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#005bc1]/50 focus:border-[#005bc1] text-slate-800" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-sm font-semibold text-slate-500 mb-1" htmlFor="formDataDay">Data</label><input id="formDataDay" required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#005bc1]/50 focus:border-[#005bc1] text-slate-800"/></div>
                                <div><label className="block text-sm font-semibold text-slate-500 mb-1" htmlFor="formDataTime">Hora</label><input id="formDataTime" required type="time" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#005bc1]/50 focus:border-[#005bc1] text-slate-800"/></div>
                            </div>
                            <div className="flex justify-end gap-3 mt-8">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors">Cancelar</button>
                                <button type="submit" className="px-5 py-2.5 rounded-xl font-bold bg-[#005bc1] text-white hover:bg-blue-700 transition-colors shadow-sm">Confirmar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal for viewing appointment details */}
            {selectedAppointment && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
                    <div className="bg-white rounded-3xl w-full max-w-sm p-8 shadow-2xl">
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-xl font-bold font-headline text-slate-800">Detalhes</h2>
                            <button onClick={() => setSelectedAppointment(null)} className="text-slate-400 hover:text-slate-600">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Paciente</p>
                                <p className="text-lg font-bold text-slate-800">{selectedAppointment.name}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Procedimento</p>
                                <p className="text-base text-slate-700">{selectedAppointment.type}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Horário</p>
                                <p className="text-base font-mono text-slate-700">{selectedAppointment.time}</p>
                            </div>
                        </div>
                        <div className="mt-8 flex gap-3">
                            <button className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl transition-colors">Reagendar</button>
                            <button className="flex-1 bg-[#005bc1] hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition-colors">Atender</button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
