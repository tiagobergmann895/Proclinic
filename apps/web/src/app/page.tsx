'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import Cookies from 'js-cookie';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    useEffect(() => {
        const savedEmail = localStorage.getItem('proclinic.rememberedEmail');
        if (savedEmail) {
            setEmail(savedEmail);
            setRememberMe(true);
        }
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await api.post('/auth/login', { email, password });
            const { access_token } = response.data;
            Cookies.set('proclinic.token', access_token, { expires: 1 });
            
            if (rememberMe) {
                localStorage.setItem('proclinic.rememberedEmail', email);
            } else {
                localStorage.removeItem('proclinic.rememberedEmail');
            }

            router.push('/dashboard');
        } catch (error) {
            alert('Acesso negado. Credenciais inválidas.');
            setIsLoading(false);
        }
    };

    const handleRecovery = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!email) {
            alert('Por favor, informe a Conta (email) para recuperar o acesso.');
        } else {
            alert(`Instruções de recuperação foram enviadas para: ${email}`);
        }
    };

    return (
        <div className="min-h-screen bg-[#f4f7f9] text-slate-800 flex flex-col font-body">
            {/* Top Bar for Logo Identity */}
            <div className="w-full bg-white h-[88px] flex items-center px-8 sm:px-12 shadow-sm relative z-20">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#005bc1] rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                        <span className="material-symbols-outlined text-white text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>medical_services</span>
                    </div>
                    <span className="text-[22px] font-extrabold font-headline tracking-tight text-slate-800">MediFlow ERP</span>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex w-full relative h-[calc(100vh-88px)] overflow-hidden">
                {/* Left Side (Login Form) */}
                <div className="w-full lg:w-1/2 xl:w-[45%] flex items-center justify-center p-8 sm:p-12 relative z-10">
                    <div className="w-full max-w-md mx-auto bg-white p-10 sm:p-12 rounded-3xl shadow-sm border border-slate-200">
                        <div className="mb-10">
                            <h2 className="text-3xl font-extrabold font-headline tracking-tight text-slate-800 mb-2">Acesso Restrito</h2>
                            <p className="text-slate-500 font-medium text-[15px]">Use as credenciais do seu workspace corporativo.</p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-2 relative">
                                <label className="text-[13px] font-bold text-slate-500 uppercase tracking-widest block ml-1" htmlFor="emailInput">Conta</label>
                                <div className="relative flex items-center group">
                                    <span className="material-symbols-outlined absolute left-4 text-slate-400 group-focus-within:text-[#005bc1] transition-colors text-[20px]">corporate_fare</span>
                                    <input
                                        id="emailInput"
                                        type="text"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-[#FCFCFD] border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-[15px] font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#005bc1] focus:ring-4 focus:ring-blue-50 transition-all font-headline"
                                        placeholder="admin@mediflow.com ou usuário"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 relative">
                                <label className="text-[13px] font-bold text-slate-500 uppercase tracking-widest block ml-1" htmlFor="passwordInput">Chave de Segurança</label>
                                <div className="relative flex items-center group ml-0">
                                    <span className="material-symbols-outlined absolute left-4 text-slate-400 group-focus-within:text-[#005bc1] transition-colors text-[20px]">password</span>
                                    <input
                                        id="passwordInput"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-[#FCFCFD] border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-[15px] font-bold text-slate-800 focus:outline-none focus:border-[#005bc1] focus:ring-4 focus:ring-blue-50 transition-all tracking-[0.15em] font-mono"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-[14px] pt-1 pb-3">
                                <label className="flex items-center space-x-2 cursor-pointer group">
                                    <input 
                                        type="checkbox" 
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="w-4 h-4 rounded appearance-none border border-slate-300 bg-white checked:bg-[#005bc1] checked:border-[#005bc1] transition-all relative
                                     before:content-[''] before:absolute before:inset-0 before:w-2 before:h-2 before:m-auto before:scale-0 checked:before:scale-100 before:bg-white before:rounded-[2px] cursor-pointer" />
                                    <span className="text-slate-500 font-medium group-hover:text-slate-800 transition-colors">Memorizar Operador</span>
                                </label>
                                <a href="#" onClick={handleRecovery} className="text-[#005bc1] font-semibold hover:text-blue-800 transition-colors">Recuperar Acesso</a>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-[#005bc1] hover:bg-blue-700 text-white font-semibold font-headline text-[16px] py-4 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <span className="material-symbols-outlined animate-spin text-[24px]">sync</span>
                                ) : (
                                    <>
                                        <span>Autenticar Sessão</span>
                                        <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 0" }}>arrow_forward</span>
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-12 text-center">
                            <p className="text-slate-500 font-medium text-[14px]">
                                Nova Clínica Parceira? <br className="sm:hidden" />
                                <a href="/register" className="text-[#005bc1] font-bold hover:underline ml-1">Configurar Setup Inicial</a>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side (Visual/Branding) */}
                <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] bg-[#005bc1] relative overflow-hidden flex-col items-center justify-center p-16 text-white text-center shadow-[inset_10px_0_30px_rgba(0,0,0,0.05)]">
                    <div className="relative z-10 space-y-8 flex flex-col items-center max-w-2xl mx-auto">
                        <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-lg mb-4">
                            <span className="material-symbols-outlined text-white text-[40px]" style={{ fontVariationSettings: "'FILL' 1" }}>monitoring</span>
                        </div>
                        <h1 className="text-5xl xl:text-6xl font-extrabold font-headline leading-[1.1] tracking-tight text-white mb-2">
                            Excelência médica. <br />Gestão implacável.
                        </h1>
                        <p className="text-[18px] text-blue-100 font-medium leading-relaxed max-w-lg mx-auto">
                            A plataforma definitiva para automatizar clínicas, prevendo falhas operacionais e alavancando margens.
                        </p>
                    </div>

                    {/* Abstract Blue Overlays */}
                    <div className="absolute top-[-20%] right-[-10%] w-[80%] h-[80%] bg-blue-400/20 rounded-full blur-[120px] pointer-events-none" />
                    <div className="absolute min-w-[600px] w-[80%] min-h-[600px] h-[80%] bottom-[-20%] left-[-20%] bg-[#004291]/50 rounded-full blur-[100px] pointer-events-none" />
                </div>
            </div>
        </div>
    );
}
