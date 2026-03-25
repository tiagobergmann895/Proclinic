'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { api } from '@/lib/api';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/hooks/useAuth';

interface SadtGuide {
  id: string;
  guideNumber: string;
  requestDate: string;
  insurerName: string;
  insurerCard?: string;
  cid10?: string;
  clinicalIndication?: string;
  procedures: { code: string; description: string; quantity: number }[];
  observations?: string;
  status: string;
  patient: { name: string; cpf?: string; birthDate?: string };
  professional: { name: string; specialty?: string; docNumber?: string };
}

const EMPTY_FORM = {
  patientId: '',
  professionalId: '',
  insurerName: 'Particular',
  insurerCard: '',
  cid10: '',
  clinicalIndication: '',
  observations: '',
  procedures: [{ code: '', description: '', quantity: 1 }],
};

const STATUS_COLOR: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  EXECUTED: 'bg-emerald-100 text-emerald-700',
  CANCELLED: 'bg-red-100 text-red-600',
};
const STATUS_LABEL: Record<string, string> = {
  PENDING: 'Pendente',
  EXECUTED: 'Executado',
  CANCELLED: 'Cancelado',
};

export default function SadtPage() {
  const router = useRouter();
  const { user, authLoading, logout } = useAuth();
  const [guides, setGuides] = useState<SadtGuide[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [professionals, setProfessionals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [printGuide, setPrintGuide] = useState<SadtGuide | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push('/'); return; }
    fetchAll();
  }, [user, authLoading]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [guidesRes, patientsRes, profsRes] = await Promise.all([
        api.get('/sadt-guide'),
        api.get('/patient'),
        api.get('/professional'),
      ]);
      setGuides(guidesRes.data);
      setPatients(patientsRes.data);
      setProfessionals(profsRes.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/sadt-guide', {
        ...formData,
        procedures: formData.procedures.filter(p => p.description),
      });
      setIsModalOpen(false);
      setFormData(EMPTY_FORM);
      fetchAll();
    } catch (err) {
      alert('Erro ao salvar a guia.');
    } finally {
      setSaving(false);
    }
  };

  const addProcedure = () =>
    setFormData(f => ({ ...f, procedures: [...f.procedures, { code: '', description: '', quantity: 1 }] }));

  const removeProcedure = (idx: number) =>
    setFormData(f => ({ ...f, procedures: f.procedures.filter((_, i) => i !== idx) }));

  const updateProcedure = (idx: number, field: string, value: any) =>
    setFormData(f => ({ ...f, procedures: f.procedures.map((p, i) => i === idx ? { ...p, [field]: value } : p) }));

  const handlePrint = (guide: SadtGuide) => {
    setPrintGuide(guide);
    setTimeout(() => window.print(), 300);
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await api.patch(`/sadt-guide/${id}`, { status });
      fetchAll();
    } catch { alert('Erro ao atualizar status.'); }
  };

  if (loading || authLoading) return <div className="min-h-screen bg-background flex items-center justify-center text-on-surface font-headline font-bold">Carregando Guias SADT...</div>;

  return (
    <AppLayout userProfile={user} currentRoute="sadt" onLogout={() => { Cookies.remove('proclinic.token'); router.push('/'); }}>
      <div className="mt-20 p-6 lg:p-10 space-y-8">
        {/* Header */}
        <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold font-headline tracking-tight text-on-surface">Guias SADT</h2>
            <p className="text-on-surface-variant mt-1">Serviço Auxiliar de Diagnóstico e Terapia</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-3 bg-primary text-on-primary rounded-xl font-bold font-headline shadow-md hover:opacity-90 transition-opacity"
          >
            <span className="material-symbols-outlined text-[20px]">add</span> Nova Guia
          </button>
        </section>

        {/* Guide List */}
        <section className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          {guides.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <span className="material-symbols-outlined text-6xl mb-4" style={{ fontVariationSettings: "'FILL' 0" }}>description</span>
              <p className="font-semibold text-lg">Nenhuma guia emitida ainda.</p>
              <p className="text-sm mt-1">Clique em "Nova Guia" para começar.</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-slate-500">
                  <th className="text-left px-6 py-4 font-bold uppercase tracking-widest text-xs">Nº Guia</th>
                  <th className="text-left px-6 py-4 font-bold uppercase tracking-widest text-xs">Paciente</th>
                  <th className="text-left px-6 py-4 font-bold uppercase tracking-widest text-xs">Profissional</th>
                  <th className="text-left px-6 py-4 font-bold uppercase tracking-widest text-xs">Convênio</th>
                  <th className="text-left px-6 py-4 font-bold uppercase tracking-widest text-xs">Data</th>
                  <th className="text-left px-6 py-4 font-bold uppercase tracking-widest text-xs">Status</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {guides.map(g => (
                  <tr key={g.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-slate-500">{g.guideNumber.slice(0, 8).toUpperCase()}</td>
                    <td className="px-6 py-4 font-semibold text-slate-800">{g.patient.name}</td>
                    <td className="px-6 py-4 text-slate-600">{g.professional.name}</td>
                    <td className="px-6 py-4 text-slate-600">{g.insurerName}</td>
                    <td className="px-6 py-4 text-slate-500">{new Date(g.requestDate).toLocaleDateString('pt-BR')}</td>
                    <td className="px-6 py-4">
                      <select
                        value={g.status}
                        onChange={e => handleStatusChange(g.id, e.target.value)}
                        className={`text-xs font-bold rounded-full px-3 py-1 border-none cursor-pointer ${STATUS_COLOR[g.status]}`}
                        title="Status da guia"
                      >
                        <option value="PENDING">Pendente</option>
                        <option value="EXECUTED">Executado</option>
                        <option value="CANCELLED">Cancelado</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handlePrint(g)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-semibold text-xs transition-colors"
                      >
                        <span className="material-symbols-outlined text-[14px]">print</span> Imprimir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>

      {/* ---- New Guide Modal ---- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl p-8 shadow-2xl my-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold font-headline text-slate-800">Nova Guia SADT</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-5">
              {/* Patient + Professional */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Paciente *</label>
                  <select required value={formData.patientId} onChange={e => setFormData(f => ({ ...f, patientId: e.target.value }))} className="w-full border border-slate-200 rounded-xl p-3 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-100" title="Paciente">
                    <option value="">Selecionar...</option>
                    {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Profissional Solicitante *</label>
                  <select required value={formData.professionalId} onChange={e => setFormData(f => ({ ...f, professionalId: e.target.value }))} className="w-full border border-slate-200 rounded-xl p-3 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-100" title="Profissional solicitante">
                    <option value="">Selecionar...</option>
                    {professionals.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
              </div>

              {/* Insurer */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Convênio / Operadora</label>
                  <input value={formData.insurerName} onChange={e => setFormData(f => ({ ...f, insurerName: e.target.value }))} className="w-full border border-slate-200 rounded-xl p-3 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-100" placeholder="Ex: Unimed, Particular..." />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Nº Carteirinha</label>
                  <input value={formData.insurerCard} onChange={e => setFormData(f => ({ ...f, insurerCard: e.target.value }))} className="w-full border border-slate-200 rounded-xl p-3 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-100" placeholder="(opcional)" />
                </div>
              </div>

              {/* CID-10 + Indication */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">CID-10</label>
                  <input value={formData.cid10} onChange={e => setFormData(f => ({ ...f, cid10: e.target.value }))} className="w-full border border-slate-200 rounded-xl p-3 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-100" placeholder="Ex: K21.0" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Indicação Clínica</label>
                  <input value={formData.clinicalIndication} onChange={e => setFormData(f => ({ ...f, clinicalIndication: e.target.value }))} className="w-full border border-slate-200 rounded-xl p-3 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-100" placeholder="Justificativa clínica..." />
                </div>
              </div>

              {/* Procedures */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Procedimentos</label>
                  <button type="button" onClick={addProcedure} className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">add</span> Adicionar
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.procedures.map((proc, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                      <input value={proc.code} onChange={e => updateProcedure(idx, 'code', e.target.value)} placeholder="Código TUSS" className="col-span-3 border border-slate-200 rounded-lg p-2 text-xs bg-slate-50 focus:outline-none" />
                      <input value={proc.description} onChange={e => updateProcedure(idx, 'description', e.target.value)} placeholder="Descrição do procedimento" className="col-span-7 border border-slate-200 rounded-lg p-2 text-xs bg-slate-50 focus:outline-none" />
                      <input type="number" min={1} value={proc.quantity} onChange={e => updateProcedure(idx, 'quantity', Number(e.target.value))} className="col-span-1 border border-slate-200 rounded-lg p-2 text-xs bg-slate-50 focus:outline-none text-center" />
                      <button type="button" onClick={() => removeProcedure(idx)} className="col-span-1 text-slate-400 hover:text-red-500 flex justify-center">
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Observations */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Observações</label>
                <textarea value={formData.observations} onChange={e => setFormData(f => ({ ...f, observations: e.target.value }))} rows={2} className="w-full border border-slate-200 rounded-xl p-3 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-100 resize-none" placeholder="Informações adicionais..." />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors">Cancelar</button>
                <button type="submit" disabled={saving} className="px-5 py-2.5 rounded-xl font-bold bg-primary text-on-primary hover:opacity-90 transition-opacity shadow-sm disabled:opacity-60">
                  {saving ? 'Salvando...' : 'Emitir Guia'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---- Print Layout (hidden, only visible when printing) ---- */}
      {printGuide && (
        <div className="hidden print:block fixed inset-0 bg-white z-[999] p-10 text-black font-sans">
          <div className="border-2 border-black rounded p-6 max-w-3xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-4">
              <div>
                <h1 className="text-xl font-extrabold uppercase">Guia de Serviço Auxiliar de Diagnóstico e Terapia</h1>
                <p className="text-xs mt-1">SADT — Solicitação / Autorização / Execução</p>
              </div>
              <div className="text-right text-xs">
                <p><strong>Nº Guia:</strong> {printGuide.guideNumber.slice(0, 8).toUpperCase()}</p>
                <p><strong>Data:</strong> {new Date(printGuide.requestDate).toLocaleDateString('pt-BR')}</p>
              </div>
            </div>

            {/* Patient + Insurer */}
            <div className="grid grid-cols-2 gap-4 border-b border-black pb-4 mb-4 text-sm">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-500 mb-0.5">Paciente</p>
                <p className="font-semibold">{printGuide.patient.name}</p>
                {printGuide.patient.cpf && <p className="text-xs text-slate-600">CPF: {printGuide.patient.cpf}</p>}
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-500 mb-0.5">Convênio / Operadora</p>
                <p className="font-semibold">{printGuide.insurerName}</p>
                {printGuide.insurerCard && <p className="text-xs text-slate-600">Carteira: {printGuide.insurerCard}</p>}
              </div>
            </div>

            {/* Clinical */}
            <div className="border-b border-black pb-4 mb-4 text-sm">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500 mb-0.5">CID-10</p>
                  <p>{printGuide.cid10 || '—'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[10px] uppercase font-bold text-slate-500 mb-0.5">Indicação Clínica</p>
                  <p>{printGuide.clinicalIndication || '—'}</p>
                </div>
              </div>
            </div>

            {/* Procedures */}
            <div className="border-b border-black pb-4 mb-4">
              <p className="text-[10px] uppercase font-bold text-slate-500 mb-2">Procedimentos Solicitados</p>
              <table className="w-full text-sm border border-black">
                <thead>
                  <tr className="bg-slate-100 border-b border-black">
                    <th className="text-left px-3 py-1.5 font-bold border-r border-black text-xs">Código</th>
                    <th className="text-left px-3 py-1.5 font-bold border-r border-black text-xs">Descrição</th>
                    <th className="text-center px-3 py-1.5 font-bold text-xs">Qtd.</th>
                  </tr>
                </thead>
                <tbody>
                  {(printGuide.procedures as any[]).map((p, i) => (
                    <tr key={i} className="border-b border-slate-200">
                      <td className="px-3 py-1.5 border-r border-black text-xs font-mono">{p.code || '—'}</td>
                      <td className="px-3 py-1.5 border-r border-black text-xs">{p.description}</td>
                      <td className="px-3 py-1.5 text-center text-xs">{p.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Observations */}
            {printGuide.observations && (
              <div className="border-b border-black pb-4 mb-4 text-sm">
                <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Observações</p>
                <p>{printGuide.observations}</p>
              </div>
            )}

            {/* Signature */}
            <div className="grid grid-cols-2 gap-16 mt-8 text-sm">
              <div className="border-t border-black pt-2">
                <p className="font-semibold">{printGuide.professional.name}</p>
                {printGuide.professional.specialty && <p className="text-xs text-slate-600">{printGuide.professional.specialty}</p>}
                {printGuide.professional.docNumber && <p className="text-xs text-slate-600">CRM/CRO: {printGuide.professional.docNumber}</p>}
                <p className="text-[10px] text-slate-500 mt-1">Assinatura / Carimbo do Profissional</p>
              </div>
              <div className="border-t border-black pt-2">
                <p className="text-[10px] text-slate-500 mt-1">Assinatura do Paciente ou Responsável</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
