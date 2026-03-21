'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { api } from '@/lib/api';
import { AppLayout } from '@/components/layout/AppLayout';

interface BiMetrics {
    totalPatients: number;
    totalRevenue: number;
    totalReceivable: number;
    avgTicket: number;
    totalAppointments: number;
}

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [metrics, setMetrics] = useState<BiMetrics | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInitialData = async () => {
            const token = Cookies.get('proclinic.token');
            if (!token) return router.push('/');
            try {
                const userResponse = await api.get('/auth/me');
                setUser(userResponse.data);
                const metricsResponse = await api.get('/bi/metrics');
                setMetrics(metricsResponse.data);
            } catch (error) {
                Cookies.remove('proclinic.token');
                router.push('/');
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, [router]);

    if (loading || !user || !metrics) return <div className="min-h-screen bg-background flex flex-col items-center justify-center text-on-surface font-headline font-bold">Carregando MediFlow ERP...</div>;

    const doctorName = user.email.split('@')[0];

    return (
        <AppLayout userProfile={user} currentRoute="dashboard" onLogout={() => { Cookies.remove('proclinic.token'); router.push('/'); }}>
            <div className="mt-20 p-10 space-y-10">
                <section className="flex justify-between items-end">
                    <div>
                        <h2 className="text-4xl font-extrabold font-headline tracking-tight text-on-surface">Overview</h2>
                        <p className="text-on-surface-variant mt-1">Bem-vindo de volta, Dr. {doctorName}. Aqui está o resumo atualizado da base.</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 bg-surface-container-highest text-on-surface rounded-xl text-sm font-semibold flex items-center gap-2 hover:opacity-80">
                            <span className="material-symbols-outlined text-lg">filter_list</span> Filtros
                        </button>
                    </div>
                </section>

                <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="md:col-span-1 p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/10 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-primary/10 text-primary rounded-lg text-lg"><span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>event_available</span></div>
                        </div>
                        <p className="text-on-surface-variant text-sm font-medium">Agendamentos Totais</p>
                        <p className="text-3xl font-extrabold font-headline mt-1">{metrics.totalAppointments}</p>
                    </div>

                    <div className="md:col-span-1 p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/10 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-tertiary/10 text-tertiary rounded-lg text-lg"><span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>person_add</span></div>
                        </div>
                        <p className="text-on-surface-variant text-sm font-medium">Pacientes na Base</p>
                        <p className="text-3xl font-extrabold font-headline mt-1">{metrics.totalPatients}</p>
                    </div>

                    <div className="md:col-span-2 p-6 rounded-3xl bg-gradient-to-br from-primary to-primary-dim text-on-primary shadow-xl shadow-primary/20 relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-2 bg-white/20 backdrop-blur-md rounded-lg"><span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>payments</span></div>
                                <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full">Liquidada Global</span>
                            </div>
                            <p className="text-white/80 text-sm font-medium">Faturamento Total (Recebido)</p>
                            <p className="text-4xl font-extrabold font-headline mt-1">R$ {metrics.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                        </div>
                    </div>
                </section>

                <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/10 shadow-sm">
                        <h3 className="text-xl font-bold font-headline mb-8">Desempenho Financeiro</h3>
                        <div className="flex items-end justify-between h-56 gap-4">
                            <div className="flex-1 bg-primary/10 rounded-t-xl h-32 hover:bg-primary/20"></div>
                            <div className="flex-1 bg-primary/10 rounded-t-xl h-44 hover:bg-primary/20"></div>
                            <div className="flex-1 bg-primary/10 rounded-t-xl h-40 hover:bg-primary/20"></div>
                            <div className="flex-1 bg-primary/10 rounded-t-xl h-52 hover:bg-primary/20"></div>
                            <div className="flex-1 bg-primary/30 rounded-t-xl h-36 hover:bg-primary/40"></div>
                            <div className="flex-1 bg-primary rounded-t-xl h-48 shadow-lg shadow-primary/20 relative">
                                <span className="absolute -top-6 text-xs font-bold text-primary w-full text-center">Atual</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/10 shadow-sm">
                            <h3 className="text-lg font-bold font-headline mb-4">Notificações Críticas</h3>
                            <div className="flex gap-4">
                                <div className="w-2 h-2 mt-2 rounded-full bg-primary shrink-0"></div>
                                <div>
                                    <p className="text-sm font-medium leading-tight">Módulo BI Ativado</p>
                                    <p className="text-xs text-on-surface-variant mt-1">Analytics em tempo real agora disponível.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}
