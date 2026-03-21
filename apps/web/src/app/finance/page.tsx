'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { api } from '@/lib/api';
import { AppLayout } from '@/components/layout/AppLayout';

interface Patient { id: string; name: string; }
interface Invoice { id: string; description: string; amount: number; status: string; dueDate: string; patientId: string; patient?: Patient; }

export default function Finance() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ patientId: '', description: '', amount: '', status: 'PENDING', dueDate: '' });

    useEffect(() => {
        const fetchInitialData = async () => {
            const token = Cookies.get('proclinic.token');
            if (!token) return router.push('/');
            try {
                const [u, i, p] = await Promise.all([api.get('/auth/me'), api.get('/invoice'), api.get('/patient')]);
                setUser(u.data);
                setInvoices(i.data);
                setPatients(p.data);
            } catch (e) {
                Cookies.remove('proclinic.token');
                router.push('/');
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, [router]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const tenantId = user.memberships[0].tenant.id;
            const fullDate = new Date(`${formData.dueDate}T12:00:00`).toISOString();
            const res = await api.post('/invoice', { tenantId, ...formData, amount: parseFloat(formData.amount), dueDate: fullDate });
            setInvoices([{...res.data, patient: patients.find(p => p.id === formData.patientId)}, ...invoices].sort((a,b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()));
            setIsModalOpen(false);
            setFormData({ patientId: '', description: '', amount: '', status: 'PENDING', dueDate: '' });
        } catch { alert('Falha ao gerar cobrança.'); }
    };

    const handleReceive = async (id: string) => {
        try {
            await api.patch(`/invoice/${id}`, { status: 'PAID' });
            setInvoices(invoices.map(i => i.id === id ? { ...i, status: 'PAID' } : i));
        } catch (e) { alert('Falha ao dar baixa na fatura.'); }
    };

    if (loading || !user) return <div className="min-h-screen bg-background text-on-surface flex items-center justify-center font-headline font-bold">Carregando Módulo Financeiro...</div>;

    const totalReceivable = invoices.filter(i => i.status === 'PENDING').reduce((acc, curr) => acc + curr.amount, 0);
    const totalReceived = invoices.filter(i => i.status === 'PAID').reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <AppLayout userProfile={user} currentRoute="finance" onLogout={() => { Cookies.remove('proclinic.token'); router.push('/'); }}>
            <div className="mt-20 p-10 space-y-10">
                <section className="flex justify-between items-end">
                    <div>
                        <h2 className="text-4xl font-extrabold font-headline tracking-tight text-on-surface">Financials</h2>
                        <p className="text-on-surface-variant mt-1">Gestão inteligente de contas a receber e faturamento.</p>
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="px-5 py-3 bg-gradient-to-br from-primary to-primary-dim text-on-primary rounded-xl text-sm font-bold font-headline flex items-center gap-2 hover:opacity-90 shadow-lg shadow-primary/20">
                        <span className="material-symbols-outlined text-lg">receipt_long</span> Nova Cobrança
                    </button>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-surface-container-lowest border border-outline-variant/10 p-8 rounded-3xl shadow-sm relative overflow-hidden flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-success/10 text-success flex items-center justify-center">
                            <span className="material-symbols-outlined text-3xl">trending_up</span>
                        </div>
                        <div>
                            <h3 className="text-on-surface-variant font-bold text-sm tracking-wider uppercase">Receita Liquidada</h3>
                            <p className="text-4xl font-headline font-extrabold text-on-surface mt-1">R$ {totalReceived.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                        </div>
                    </div>
                    
                    <div className="bg-surface-container-lowest border border-error/20 p-8 rounded-3xl shadow-sm relative overflow-hidden flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-error-container/50 text-error flex items-center justify-center">
                            <span className="material-symbols-outlined text-3xl">hourglass_empty</span>
                        </div>
                        <div>
                            <h3 className="text-error font-bold text-sm tracking-wider uppercase">Inadimplência Projetada (A Receber)</h3>
                            <p className="text-4xl font-headline font-extrabold text-on-surface mt-1">R$ {totalReceivable.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-3xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center">
                        <h3 className="font-bold text-lg font-headline text-on-surface">Faturas e Cobranças</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="bg-surface-container-low/50 border-b border-outline-variant/10 text-on-surface-variant text-xs uppercase tracking-wider">
                                    <th className="p-4 font-bold">Descrição do Serviço</th>
                                    <th className="p-4 font-bold">Vencimento</th>
                                    <th className="p-4 font-bold">Valor (R$)</th>
                                    <th className="p-4 font-bold text-center">Status</th>
                                    <th className="p-4 font-bold text-right">Ação</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoices.length === 0 ? (
                                    <tr><td colSpan={5} className="p-8 text-center text-on-surface-variant font-medium">Fluxo de caixa zerado.</td></tr>
                                ) : invoices.map(inv => (
                                    <tr key={inv.id} className="border-b border-outline-variant/5 hover:bg-surface-container-low transition-colors group">
                                        <td className="p-4">
                                            <p className="font-bold text-on-surface">{inv.description}</p>
                                            <p className="text-xs text-on-surface-variant">{inv.patient?.name || `Paciente ${inv.patientId.substring(0,6)}`}</p>
                                        </td>
                                        <td className="p-4 text-on-surface-variant font-medium">{new Date(inv.dueDate).toLocaleDateString('pt-BR')}</td>
                                        <td className="p-4 font-headline font-extrabold text-on-surface">R$ {inv.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                                        <td className="p-4 text-center">
                                            {inv.status === 'PAID' ? 
                                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-success/20 text-success text-[10px] font-bold uppercase tracking-wider rounded-lg"><span className="material-symbols-outlined text-[14px]">check_circle</span> Pago</span> : 
                                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-error-container/50 text-error-dim text-[10px] font-bold uppercase tracking-wider rounded-lg"><span className="material-symbols-outlined text-[14px]">pending</span> Pendente</span>
                                            }
                                        </td>
                                        <td className="p-4 text-right">
                                            {inv.status === 'PENDING' && (
                                                <button onClick={() => handleReceive(inv.id)} className="px-4 py-2 bg-surface-container-high text-on-surface hover:bg-primary hover:text-on-primary font-bold text-xs rounded-lg transition-colors shadow-sm">
                                                    Dar Baixa
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-inverse-surface/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-3xl w-full max-w-lg p-8 shadow-2xl flex flex-col">
                        <h2 className="text-2xl font-bold font-headline mb-6 text-on-surface">Gerar Nova Fatura</h2>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-on-surface-variant mb-1">Paciente</label>
                                <select required value={formData.patientId} onChange={e => setFormData({...formData, patientId: e.target.value})} className="w-full bg-surface-container-low border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/50 text-on-surface">
                                    <option value="">Buscar paciente...</option>
                                    {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-on-surface-variant mb-1">Descrição</label>
                                <input required type="text" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-surface-container-low border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/50 text-on-surface" placeholder="Ex: Tratamento Especializado" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-on-surface-variant mb-1">Valor Final (R$)</label>
                                    <input required type="number" step="0.01" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full bg-surface-container-low border-none rounded-xl p-3 text-sm font-mono focus:ring-2 focus:ring-primary/50 text-on-surface" placeholder="0.00" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-on-surface-variant mb-1">Vencimento</label>
                                    <input required type="date" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} className="w-full bg-surface-container-low border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/50 text-on-surface" />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-outline-variant/10">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl font-bold text-on-surface-variant hover:bg-surface-container-high transition-colors">Cancelar</button>
                                <button type="submit" className="px-5 py-2.5 rounded-xl font-bold bg-primary text-on-primary hover:bg-primary-dim transition-colors shadow-sm flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">receipt_long</span> Gravar Fatura
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
