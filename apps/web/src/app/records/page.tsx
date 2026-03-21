'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { api } from '@/lib/api';
import { AppLayout } from '@/components/layout/AppLayout';

interface Patient { id: string; name: string; }
interface ClinicalRecord { id: string; date: string; type: string; content: string; signed: boolean; patientId: string; patient?: Patient; }

export default function Records() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [records, setRecords] = useState<ClinicalRecord[]>([]);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ patientId: '', type: 'ANAMNESIS', content: '', professionalId: '' });

    useEffect(() => {
        const fetchInitialData = async () => {
            const token = Cookies.get('proclinic.token');
            if (!token) return router.push('/');
            try {
                const [u, r, p] = await Promise.all([api.get('/auth/me'), api.get('/clinical-record'), api.get('/patient')]);
                setUser(u.data);
                setRecords(r.data);
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
            const res = await api.post('/clinical-record', { tenantId, ...formData, signed: true });
            setRecords([{...res.data, patient: patients.find(p => p.id === formData.patientId)}, ...records]);
            setIsModalOpen(false);
            setFormData({ patientId: '', type: 'ANAMNESIS', content: '', professionalId: '' });
        } catch { alert('Falha ao salvar prontuário.'); }
    };

    if (loading || !user) return <div className="min-h-screen bg-background text-on-surface flex items-center justify-center font-headline font-bold">Carregando Prontuários...</div>;

    return (
        <AppLayout userProfile={user} currentRoute="records" onLogout={() => { Cookies.remove('proclinic.token'); router.push('/'); }}>
            <div className="mt-20 p-10 space-y-10">
                <section className="flex justify-between items-end">
                    <div>
                        <h2 className="text-4xl font-extrabold font-headline tracking-tight text-on-surface">EHR Records</h2>
                        <p className="text-on-surface-variant mt-1">Prontuários eletrônicos e evolução clínica unificada.</p>
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="px-5 py-3 bg-gradient-to-br from-primary to-primary-dim text-on-primary rounded-xl text-sm font-bold font-headline flex items-center gap-2 hover:opacity-90 shadow-lg shadow-primary/20">
                        <span className="material-symbols-outlined text-lg">edit_document</span> Nova Evolução
                    </button>
                </section>

                <div className="grid grid-cols-1 gap-6">
                    {records.length === 0 ? (
                        <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-3xl p-10 text-center text-on-surface-variant font-medium shadow-sm">
                            Nenhum registro clínico localizado nesta clínica.
                        </div>
                    ) : records.map(record => {
                        const dateObj = new Date(record.date);
                        const patientName = record.patient?.name || patients.find(p => p.id === record.patientId)?.name || `ID ${record.patientId.substring(0,4)}`;
                        return (
                            <div key={record.id} className="bg-surface-container-lowest border border-outline-variant/10 rounded-3xl p-8 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1.5 h-full bg-primary/80"></div>
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-primary-container text-on-primary-container rounded-2xl flex items-center justify-center">
                                            <span className="material-symbols-outlined">clinical_notes</span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-xl font-headline text-on-surface">{patientName}</h3>
                                            <p className="text-sm font-medium text-on-surface-variant flex items-center gap-2 mt-1">
                                                <span className="material-symbols-outlined text-sm">schedule</span>
                                                {dateObj.toLocaleDateString('pt-BR')} às {dateObj.toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'})}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className="px-3 py-1 bg-surface-container-low text-on-surface-variant font-bold text-xs uppercase tracking-wider rounded-lg">{record.type}</span>
                                        {record.signed && (
                                            <span className="flex items-center gap-1 text-[10px] font-bold text-success bg-success/10 px-2 py-1 rounded-md uppercase tracking-wider">
                                                <span className="material-symbols-outlined text-xs">verified</span> Assinado Digitalmente
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="bg-surface-container-low/50 p-6 rounded-2xl text-on-surface font-mono text-sm leading-relaxed border border-outline-variant/5">
                                    {record.content}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-inverse-surface/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-3xl w-full max-w-2xl p-8 shadow-2xl max-h-[90vh] flex flex-col">
                        <h2 className="text-2xl font-bold font-headline mb-6 text-on-surface">Criar Evolução Clínica</h2>
                        <form onSubmit={handleSave} className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-on-surface-variant mb-1">Paciente</label>
                                    <select required value={formData.patientId} onChange={e => setFormData({...formData, patientId: e.target.value})} className="w-full bg-surface-container-low border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/50 text-on-surface">
                                        <option value="">Selecione...</option>
                                        {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-on-surface-variant mb-1">Tipo de Documento</label>
                                    <select required value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full bg-surface-container-low border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/50 text-on-surface">
                                        <option value="ANAMNESIS">Anamnese Inicial</option>
                                        <option value="EVOLUTION">Evolução SOAP</option>
                                        <option value="EXAM_RESULT">Laudo de Exame</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-on-surface-variant mb-1">Assinatura Digital (ID Profissional)</label>
                                <input required type="text" value={formData.professionalId} onChange={e => setFormData({...formData, professionalId: e.target.value})} className="w-full bg-surface-container-low border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/50 text-on-surface" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-on-surface-variant mb-1">Relato Clínico</label>
                                <textarea required rows={8} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} placeholder="S (Subjetivo): Paciente relata...&#10;O (Objetivo): Exame físico...&#10;A (Avaliação): ...&#10;P (Plano): ..." className="w-full bg-surface-container-low border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary/50 text-on-surface font-mono leading-relaxed resize-none custom-scrollbar" />
                            </div>
                            <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-outline-variant/10">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl font-bold text-on-surface-variant hover:bg-surface-container-high transition-colors">Cancelar</button>
                                <button type="submit" className="px-5 py-2.5 rounded-xl font-bold bg-primary text-on-primary hover:bg-primary-dim transition-colors shadow-sm flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">verified</span> Assinar e Salvar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
