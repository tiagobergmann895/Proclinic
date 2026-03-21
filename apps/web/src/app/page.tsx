'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import Cookies from 'js-cookie';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await api.post('/auth/login', { email, password });
            const { access_token } = response.data;
            Cookies.set('proclinic.token', access_token, { expires: 1 });
            router.push('/dashboard');
        } catch (error) {
            alert('Acesso negado. Credenciais inválidas.');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-on-surface grid grid-cols-1 lg:grid-cols-3 w-full">
            {/* Left Decor / Branding (Hidden on mobile) */}
            <div className="hidden lg:flex lg:col-span-2 bg-gradient-to-br from-primary to-primary-dim text-on-primary p-16 flex-col justify-between relative overflow-hidden">
                <div className="relative z-10 mb-20">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]">
                            <span className="material-symbols-outlined text-white text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>medical_services</span>
                        </div>
                        <span className="text-3xl font-extrabold font-headline tracking-tighter">MediFlow ERP</span>
                    </div>
                </div>
                
                <div className="relative z-10 max-w-3xl pb-20">
                    <h1 className="text-6xl xl:text-7xl font-extrabold font-headline leading-[1.05] tracking-tight mb-8 drop-shadow-sm">
                        Excelência médica. <br/>Gestão implacável.
                    </h1>
                    <p className="text-xl font-medium text-white/80 leading-relaxed max-w-xl">
                        A plataforma definitiva para automatizar clínicas, prevendo falhas operacionais e alavancando margens.
                    </p>
                </div>
                
                {/* Abstract geometric shapes */}
                <div className="absolute top-[-20%] right-[-10%] w-[80%] h-[80%] bg-white/5 rounded-full blur-[140px] pointer-events-none" />
                <div className="absolute bottom-[-10%] left-[-20%] w-[60%] h-[60%] bg-[#000000]/10 rounded-full blur-[120px] pointer-events-none" />
            </div>

            {/* Right Login Container */}
            <div className="col-span-1 flex flex-col items-center justify-center p-8 sm:p-12 min-h-screen bg-surface-container-lowest relative z-10 shadow-[-10px_0_30px_rgba(0,0,0,0.03)] border-l border-outline-variant/10">
                <div className="w-full max-w-md mx-auto">
                    <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
                        <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
                            <span className="material-symbols-outlined text-on-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>medical_services</span>
                        </div>
                        <span className="text-2xl font-extrabold font-headline tracking-tight text-on-surface">MediFlow</span>
                    </div>

                    <div className="mb-12 text-center lg:text-left">
                        <h2 className="text-4xl font-extrabold font-headline tracking-tight text-on-surface mb-2">Acesso Restrito</h2>
                        <p className="text-on-surface-variant font-medium text-lg">Use as credenciais do seu workspace.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-on-surface-variant uppercase tracking-wider block ml-1" htmlFor="emailInput">Conta Corporativa</label>
                            <label className="relative flex items-center group cursor-text" htmlFor="emailInput">
                                <span className="material-symbols-outlined absolute left-4 text-on-surface-variant group-focus-within:text-primary transition-colors">corporate_fare</span>
                                <input
                                    id="emailInput"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-surface border border-outline-variant/30 rounded-2xl py-4 pl-12 pr-4 text-on-surface placeholder-on-surface-variant/40 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-semibold font-headline text-lg"
                                    placeholder="admin@mediflow.com"
                                    required
                                />
                            </label>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-on-surface-variant uppercase tracking-wider block ml-1" htmlFor="passwordInput">Chave de Segurança</label>
                            <label className="relative flex items-center group cursor-text" htmlFor="passwordInput">
                                <span className="material-symbols-outlined absolute left-4 text-on-surface-variant group-focus-within:text-primary transition-colors">password</span>
                                <input
                                    id="passwordInput"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-surface border border-outline-variant/30 rounded-2xl py-4 pl-12 pr-4 text-on-surface placeholder-on-surface-variant/40 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-bold font-mono text-xl tracking-widest"
                                    placeholder="••••••••"
                                    required
                                />
                            </label>
                        </div>

                        <div className="flex items-center justify-between text-sm py-2">
                            <label className="flex items-center space-x-3 cursor-pointer group">
                                <div className="relative flex">
                                    <input type="checkbox" className="peer w-5 h-5 rounded-md border-outline-variant/30 bg-surface-container checked:bg-primary checked:border-primary transition-all focus:ring-2 focus:ring-primary/30" />
                                </div>
                                <span className="text-on-surface-variant font-medium group-hover:text-on-surface transition-colors">Memorizar Operador</span>
                            </label>
                            <a href="#" className="text-primary font-bold hover:text-primary-dim transition-colors">Recuperar Acesso</a>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-br from-primary to-primary-dim hover:from-primary-dim hover:to-primary text-on-primary font-extrabold font-headline text-lg py-4 rounded-2xl shadow-lg hover:shadow-xl shadow-primary/30 flex items-center justify-center gap-3 transition-all transform hover:translate-y-[-1px] active:translate-y-[1px] disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                        >
                            {isLoading ? (
                                <span className="material-symbols-outlined animate-spin text-2xl">sync</span>
                            ) : (
                                <>
                                    <span>Autenticar Sessão</span>
                                    <span className="material-symbols-outlined">arrow_forward</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-12 pt-8 border-t border-outline-variant/10 text-center">
                        <p className="text-on-surface-variant font-medium text-sm">
                            Nova Clínica Parceira? <br className="sm:hidden" />
                            <a href="/register" className="text-primary font-bold hover:underline ml-1">Configurar Setup Inicial</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
