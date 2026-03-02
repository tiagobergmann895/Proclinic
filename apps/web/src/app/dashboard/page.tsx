'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { LogOut, Users, Calendar, Activity } from 'lucide-react';
import { api } from '@/lib/api';

interface UserProfile {
    id: string;
    email: string;
    memberships: {
        role: string;
        tenant: {
            name: string;
        };
    }[];
}

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const token = Cookies.get('proclinic.token');
            if (!token) {
                router.push('/');
                return;
            }

            try {
                const response = await api.get('/auth/me');
                setUser(response.data);
            } catch (error) {
                console.error('Erro ao buscar usuário:', error);
                Cookies.remove('proclinic.token');
                router.push('/');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [router]);

    const handleLogout = () => {
        Cookies.remove('proclinic.token');
        router.push('/');
    };

    if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-100">Carregando...</div>;
    if (!user) return null;

    const tenantName = user.memberships[0]?.tenant?.name || 'Minha Clínica';

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex">
            {/* Sidebar Simples */}
            <aside className="w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col">
                <div className="flex items-center space-x-3 mb-10">
                    <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center">
                        <Activity className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-xl">ProClinic</span>
                </div>

                <nav className="flex-1 space-y-2">
                    <a href="#" className="flex items-center space-x-3 px-4 py-3 bg-sky-500/10 text-sky-400 rounded-lg">
                        <Activity className="w-5 h-5" />
                        <span>Visão Geral</span>
                    </a>
                    <a href="#" className="flex items-center space-x-3 px-4 py-3 text-slate-400 hover:bg-slate-800 rounded-lg transition-colors">
                        <Calendar className="w-5 h-5" />
                        <span>Agendamentos</span>
                    </a>
                    <a href="#" className="flex items-center space-x-3 px-4 py-3 text-slate-400 hover:bg-slate-800 rounded-lg transition-colors">
                        <Users className="w-5 h-5" />
                        <span>Pacientes</span>
                    </a>
                </nav>

                <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors mt-auto"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Sair</span>
                </button>
            </aside>

            {/* Conteúdo Principal */}
            <main className="flex-1 p-8 overflow-auto">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold">Painel de Controle</h1>
                        <p className="text-slate-400">Bem-vindo, {user.email}</p>
                        <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">{tenantName}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                        <Users className="w-5 h-5 text-slate-400" />
                    </div>
                </header>

                {/* Cards de Exemplo */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                        <h3 className="text-slate-400 text-sm font-medium mb-2">Pacientes Hoje</h3>
                        <p className="text-3xl font-bold">0</p>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                        <h3 className="text-slate-400 text-sm font-medium mb-2">Agendamentos (Semana)</h3>
                        <p className="text-3xl font-bold">0</p>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                        <h3 className="text-slate-400 text-sm font-medium mb-2">Receita Mensal</h3>
                        <p className="text-3xl font-bold text-emerald-400">R$ 0,00</p>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 min-h-[400px] flex items-center justify-center text-slate-500">
                    <p>Gráficos e tabelas virão aqui...</p>
                </div>
            </main>
        </div>
    );
}
