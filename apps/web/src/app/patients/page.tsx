'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { api } from '@/lib/api';
import { AppLayout } from '@/components/layout/AppLayout';

interface Patient { id: string; name: string; email?: string; phone?: string; cpf?: string; createdAt: string; }

export default function Patients() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', cpf: '' });

    useEffect(() => {
        const fetchInitialData = async () => {
            const token = Cookies.get('proclinic.token');
            if (!token) return router.push('/');
            try {
                const [u, p] = await Promise.all([api.get('/auth/me'), api.get('/patient')]);
                setUser(u.data);
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
            const res = await api.post('/patient', { ...formData, tenantId });
            setPatients([res.data, ...patients]);
            setIsModalOpen(false);
            setFormData({ name: '', email: '', phone: '', cpf: '' });
        } catch { alert('Falha ao criar paciente.'); }
    };

    if (loading || !user) return <div className="min-h-screen bg-background text-on-surface flex items-center justify-center font-headline font-bold">Carregando Pacientes...</div>;

    return (
        <AppLayout userProfile={user} currentRoute="patients" onLogout={() => { Cookies.remove('proclinic.token'); router.push('/'); }}>
            <div className="mt-20 p-10 space-y-10">
                <section className="flex justify-between items-end">
                    <div>
                        <h2 className="text-4xl font-extrabold font-headline tracking-tight text-on-surface">Pacientes</h2>
                        <p className="text-on-surface-variant mt-1">Gestão de prontuários eletrônicos.</p>
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="px-5 py-3 bg-gradient-to-br from-primary to-primary-dim text-on-primary rounded-xl text-sm font-bold font-headline flex items-center gap-2 hover:opacity-90 shadow-lg shadow-primary/20">
                        <span className="material-symbols-outlined text-lg">person_add</span> Cadastrar Paciente
                    </button>
                </section>

                <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-3xl p-6 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[600px]">
                            <thead>
                                <tr className="border-b border-outline-variant/10 text-on-surface-variant text-xs uppercase tracking-wider">
                                    <th className="p-4 font-bold">Identificação</th>
                                    <th className="p-4 font-bold">Contato</th>
                                    <th className="p-4 font-bold text-right">Cadastrado em</th>
                                </tr>
                            </thead>
                            <tbody>
                                {patients.length === 0 ? (
                                    <tr><td colSpan={3} className="p-8 text-center text-on-surface-variant">Base de pacientes vazia.</td></tr>
                                ) : patients.map(p => (
                                    <tr key={p.id} className="border-b border-outline-variant/5 hover:bg-surface-container-low transition-colors group">
                                        <td className="p-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold">
                                                    {p.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-on-surface">{p.name}</p>
                                                    <p className="text-xs text-on-surface-variant">CPF: {p.cpf || 'Não informado'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <p className="text-sm font-medium text-on-surface">{p.email || '-'}</p>
                                            <p className="text-xs text-on-surface-variant font-mono">{p.phone || '-'}</p>
                                        </td>
                                        <td className="p-4 text-right">
                                            <span className="text-sm font-medium bg-surface-container-high px-3 py-1 rounded-lg text-on-surface-variant">
                                                {new Date(p.createdAt).toLocaleDateString('pt-BR')}
                                            </span>
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
                    <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-3xl w-full max-w-lg p-8 shadow-2xl">
                        <h2 className="text-2xl font-bold font-headline mb-6 text-on-surface">Novo Paciente</h2>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-on-surface-variant mb-1">Nome Completo</label>
                                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-surface-container-low border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/50 text-on-surface" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-on-surface-variant mb-1">E-mail</label>
                                <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-surface-container-low border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/50 text-on-surface" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-sm font-semibold text-on-surface-variant mb-1">Telefone</label><input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-surface-container-low border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/50 text-on-surface"/></div>
                                <div><label className="block text-sm font-semibold text-on-surface-variant mb-1">CPF</label><input type="text" value={formData.cpf} onChange={e => setFormData({...formData, cpf: e.target.value})} className="w-full bg-surface-container-low border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/50 text-on-surface"/></div>
                            </div>
                            <div className="flex justify-end gap-3 mt-8">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl font-bold text-on-surface-variant hover:bg-surface-container-high transition-colors">Cancelar</button>
                                <button type="submit" className="px-5 py-2.5 rounded-xl font-bold bg-primary text-on-primary hover:bg-primary-dim transition-colors shadow-sm">Confirmar Cadastro</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
