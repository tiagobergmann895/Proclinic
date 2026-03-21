'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { api } from '@/lib/api';
import { AppLayout } from '@/components/layout/AppLayout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Line } from 'recharts';

interface BiMetrics {
    totalPatients: number;
    totalRevenue: number;
    totalReceivable: number;
    avgTicket: number;
    totalAppointments: number;
    totalProfessionals: number;
}

const mockRevenueData = [
    { name: 'Jan', revenue: 4000, target: 3000 },
    { name: 'Fev', revenue: 3000, target: 3500 },
    { name: 'Mar', revenue: 5000, target: 4000 },
    { name: 'Abr', revenue: 7000, target: 5000 },
    { name: 'Mai', revenue: 6000, target: 5500 },
    { name: 'Jun', revenue: 9000, target: 6000 },
];

const mockPatientGrowth = [
    { name: 'Sem 1', newPatients: 15 },
    { name: 'Sem 2', newPatients: 20 },
    { name: 'Sem 3', newPatients: 18 },
    { name: 'Sem 4', newPatients: 28 },
];

export default function BusinessIntelligence() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [metrics, setMetrics] = useState<BiMetrics | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInitialData = async () => {
            const token = Cookies.get('proclinic.token');
            if (!token) return router.push('/');
            try {
                const [u, m] = await Promise.all([api.get('/auth/me'), api.get('/bi/metrics')]);
                setUser(u.data);
                setMetrics(m.data);
            } catch (e) {
                Cookies.remove('proclinic.token');
                router.push('/');
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, [router]);

    if (loading || !user || !metrics) return <div className="min-h-screen bg-background text-on-surface flex items-center justify-center font-headline font-bold">Carregando C-Level Dashboard...</div>;

    return (
        <AppLayout userProfile={user} currentRoute="bi" onLogout={() => { Cookies.remove('proclinic.token'); router.push('/'); }}>
            <div className="mt-20 p-10 space-y-10">
                <section className="flex justify-between items-end">
                    <div>
                        <h2 className="text-4xl font-extrabold font-headline tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-tertiary">
                            Analytics & BI
                        </h2>
                        <p className="text-on-surface-variant mt-1">Inteligência de negócios em tempo real.</p>
                    </div>
                    <button className="px-5 py-3 bg-surface-container-high text-on-surface rounded-xl text-sm font-bold font-headline flex items-center gap-2 hover:bg-surface-dim transition-colors shadow-sm">
                        <span className="material-symbols-outlined text-lg">download</span> Exportar Relatório
                    </button>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-surface-container-lowest border border-outline-variant/10 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden flex flex-col items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center">
                            <span className="material-symbols-outlined text-2xl">account_balance_wallet</span>
                        </div>
                        <div>
                            <h3 className="text-on-surface-variant text-sm font-bold tracking-wider uppercase mb-1">Receita Líquida</h3>
                            <p className="text-3xl font-headline font-extrabold text-on-surface">R$ {metrics.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                        </div>
                    </div>

                    <div className="bg-surface-container-lowest border border-outline-variant/10 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden flex flex-col items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-tertiary-container text-on-tertiary-container flex items-center justify-center">
                            <span className="material-symbols-outlined text-2xl">local_atm</span>
                        </div>
                        <div>
                            <h3 className="text-on-surface-variant text-sm font-bold tracking-wider uppercase mb-1">Ticket Médio (LTV)</h3>
                            <p className="text-3xl font-headline font-extrabold text-on-surface">R$ {metrics.avgTicket.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                        </div>
                    </div>

                    <div className="bg-surface-container-lowest border border-outline-variant/10 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden flex flex-col items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center">
                            <span className="material-symbols-outlined text-2xl">group_add</span>
                        </div>
                        <div>
                            <h3 className="text-on-surface-variant text-sm font-bold tracking-wider uppercase mb-1">Base Ativa</h3>
                            <p className="text-3xl font-headline font-extrabold text-on-surface">{metrics.totalPatients}</p>
                        </div>
                    </div>

                    <div className="bg-surface-container-lowest border border-outline-variant/10 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden flex flex-col items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-error-container text-on-error-container flex items-center justify-center">
                            <span className="material-symbols-outlined text-2xl">medical_information</span>
                        </div>
                        <div>
                            <h3 className="text-on-surface-variant text-sm font-bold tracking-wider uppercase mb-1">Procedimentos</h3>
                            <p className="text-3xl font-headline font-extrabold text-on-surface">{metrics.totalAppointments}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-surface-container-lowest border border-outline-variant/10 p-8 rounded-3xl shadow-sm">
                        <h3 className="text-lg font-bold font-headline text-on-surface mb-6">Receita vs Meta (Semestral)</h3>
                        <div className="h-72 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={mockRevenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#005bc1" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#005bc1" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e2e5" vertical={false} />
                                    <XAxis dataKey="name" stroke="#566166" tick={{fill: '#566166', fontSize: 12}} axisLine={false} tickLine={false} />
                                    <YAxis stroke="#566166" tick={{fill: '#566166', fontSize: 12}} axisLine={false} tickLine={false} tickFormatter={(value) => `R$${value/1000}k`} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e0e2e5', borderRadius: '12px', color: '#2a3439', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                                        itemStyle={{ color: '#2a3439', fontWeight: 'bold' }}
                                    />
                                    <Area type="monotone" dataKey="revenue" stroke="#005bc1" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" name="Realizado" />
                                    <Line type="monotone" dataKey="target" stroke="#7e4f71" strokeWidth={2} strokeDasharray="5 5" name="Meta" dot={false} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-surface-container-lowest border border-outline-variant/10 p-8 rounded-3xl shadow-sm">
                        <h3 className="text-lg font-bold font-headline text-on-surface mb-6">Captação de Pacientes (Mensal)</h3>
                        <div className="h-72 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={mockPatientGrowth} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e2e5" vertical={false} />
                                    <XAxis dataKey="name" stroke="#566166" tick={{fill: '#566166', fontSize: 12}} axisLine={false} tickLine={false} />
                                    <YAxis stroke="#566166" tick={{fill: '#566166', fontSize: 12}} axisLine={false} tickLine={false} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e0e2e5', borderRadius: '12px', color: '#2a3439', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                                        cursor={{fill: '#f0f4f7'}}
                                    />
                                    <Bar dataKey="newPatients" fill="#3b9df7" radius={[6, 6, 0, 0]} name="Leads Convertidos" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-surface-container-lowest border border-outline-variant/10 p-8 rounded-3xl shadow-sm flex items-center gap-6">
                        <div className="w-16 h-16 rounded-3xl bg-surface-container-high border border-outline-variant/20 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-3xl text-on-surface">robot_2</span>
                        </div>
                        <div>
                            <h4 className="font-bold text-lg font-headline text-on-surface">Predictive No-Show Engine</h4>
                            <p className="text-sm font-medium text-on-surface-variant mt-2 leading-relaxed">Sua taxa atual de ausências é <strong className="text-error font-bold">8.4%</strong>. Algoritmo de inteligência recomenda *overbooking* de 1 paciente por tarde.</p>
                        </div>
                    </div>
                    
                    <div className="bg-surface-container-lowest border border-outline-variant/10 p-8 rounded-3xl shadow-sm flex items-center gap-6">
                        <div className="w-16 h-16 rounded-3xl bg-surface-container-high border border-outline-variant/20 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-3xl text-on-surface">query_stats</span>
                        </div>
                        <div>
                            <h4 className="font-bold text-lg font-headline text-on-surface">Rentabilidade Cruzada</h4>
                            <p className="text-sm font-medium text-on-surface-variant mt-2 leading-relaxed"><strong>Odontologia Geral</strong> oferece maior margem (R$ 490/h). Redimensione campanhas Ads para este funil de vendas baseado no LTV.</p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
