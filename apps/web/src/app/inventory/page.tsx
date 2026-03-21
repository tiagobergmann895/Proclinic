'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { api } from '@/lib/api';
import { AppLayout } from '@/components/layout/AppLayout';

interface Product { id: string; name: string; category: string; unit: string; minStock: number; currentStock: number; }
interface StockMovement { id: string; productId: string; type: string; quantity: number; reason: string; date: string; product?: Product; }

export default function Inventory() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [movements, setMovements] = useState<StockMovement[]>([]);
    const [loading, setLoading] = useState(true);
    
    const [isProductModal, setIsProductModal] = useState(false);
    const [isMovementModal, setIsMovementModal] = useState(false);
    
    const [productForm, setProductForm] = useState({ name: '', category: 'CLINICAL', unit: 'UN', minStock: '10' });
    const [movementForm, setMovementForm] = useState({ productId: '', type: 'IN', quantity: '', reason: 'PURCHASE' });

    useEffect(() => {
        const fetchInitialData = async () => {
            const token = Cookies.get('proclinic.token');
            if (!token) return router.push('/');
            try {
                const [u, p, m] = await Promise.all([api.get('/auth/me'), api.get('/product'), api.get('/stock-movement')]);
                setUser(u.data);
                setProducts(p.data);
                setMovements(m.data);
            } catch (error) {
                Cookies.remove('proclinic.token');
                router.push('/');
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, [router]);

    const handleSaveProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const tenantId = user.memberships[0].tenant.id;
            const res = await api.post('/product', { tenantId, ...productForm, minStock: parseInt(productForm.minStock), currentStock: 0 });
            setProducts([...products, res.data].sort((a,b) => a.name.localeCompare(b.name)));
            setIsProductModal(false);
            setProductForm({ name: '', category: 'CLINICAL', unit: 'UN', minStock: '10' });
        } catch { alert('Falha ao criar item.'); }
    };

    const handleSaveMovement = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const tenantId = user.memberships[0].tenant.id;
            const qty = parseInt(movementForm.quantity);
            const res = await api.post('/stock-movement', { tenantId, ...movementForm, quantity: qty });
            
            setProducts(products.map(p => {
                if (p.id === movementForm.productId) {
                    return { ...p, currentStock: p.currentStock + (movementForm.type === 'IN' ? qty : -qty) };
                }
                return p;
            }));

            const prod = products.find(p => p.id === movementForm.productId);
            setMovements([{...res.data, product: prod}, ...movements]);
            
            setIsMovementModal(false);
            setMovementForm({ productId: '', type: 'IN', quantity: '', reason: 'PURCHASE' });
        } catch { alert('Falha ao movimentar lote.'); }
    };

    if (loading || !user) return <div className="min-h-screen bg-background text-on-surface flex items-center justify-center font-headline font-bold">Carregando Estoque...</div>;

    const lowStockCount = products.filter(p => p.currentStock <= p.minStock).length;
    const totalItems = products.reduce((acc, curr) => acc + curr.currentStock, 0);

    return (
        <AppLayout userProfile={user} currentRoute="inventory" onLogout={() => { Cookies.remove('proclinic.token'); router.push('/'); }}>
            <div className="mt-20 p-10 space-y-10">
                <section className="flex justify-between items-end">
                    <div>
                        <h2 className="text-4xl font-extrabold font-headline tracking-tight text-on-surface">Inventory</h2>
                        <p className="text-on-surface-variant mt-1">Controle inteligente de insumos e cadeia logística da clínica.</p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => setIsProductModal(true)} className="px-5 py-3 bg-surface-container-high text-on-surface rounded-xl text-sm font-bold font-headline flex items-center gap-2 hover:bg-surface-dim transition-colors shadow-sm">
                            <span className="material-symbols-outlined text-lg">category</span> Adicionar Item Base
                        </button>
                        <button onClick={() => setIsMovementModal(true)} className="px-5 py-3 bg-gradient-to-br from-primary to-primary-dim text-on-primary rounded-xl text-sm font-bold font-headline flex items-center gap-2 hover:opacity-90 transition-colors shadow-lg shadow-primary/20">
                            <span className="material-symbols-outlined text-lg">sync_alt</span> Movimentar Lote
                        </button>
                    </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-surface-container-lowest border border-outline-variant/10 p-8 rounded-3xl shadow-sm flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-secondary-container text-secondary flex items-center justify-center">
                            <span className="material-symbols-outlined text-3xl">precision_manufacturing</span>
                        </div>
                        <div>
                            <h3 className="text-on-surface-variant font-bold text-sm tracking-wider uppercase">Volume Armazenado Global</h3>
                            <p className="text-4xl font-headline font-extrabold text-on-surface mt-1">{totalItems}</p>
                        </div>
                    </div>
                    
                    <div className={`border p-8 rounded-3xl shadow-sm flex items-center gap-6 ${lowStockCount > 0 ? 'bg-error-container/20 border-error/50' : 'bg-surface-container-lowest border-outline-variant/10'}`}>
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${lowStockCount > 0 ? 'bg-error text-on-error' : 'bg-surface-dim text-on-surface-variant'}`}>
                            <span className="material-symbols-outlined text-3xl">warning</span>
                        </div>
                        <div>
                            <h3 className={`${lowStockCount > 0 ? 'text-error' : 'text-on-surface-variant'} font-bold text-sm tracking-wider uppercase`}>Níveis Críticos / Vencimento</h3>
                            <p className={`text-4xl font-headline font-extrabold mt-1 ${lowStockCount > 0 ? 'text-error' : 'text-on-surface'}`}>
                                {lowStockCount} <span className="text-base font-body font-medium opacity-80">acionamentos necessários</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Lista Master */}
                    <div className="xl:col-span-2 bg-surface-container-lowest border border-outline-variant/10 rounded-3xl shadow-sm overflow-hidden flex flex-col items-stretch">
                        <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-low/30">
                            <h3 className="font-bold text-lg font-headline text-on-surface">Mapa do Almoxarifado</h3>
                        </div>
                        <div className="overflow-x-auto flex-1">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-outline-variant/10 text-on-surface-variant text-xs uppercase tracking-wider">
                                        <th className="p-4 font-bold">Produto / Lote</th>
                                        <th className="p-4 font-bold">Categoria</th>
                                        <th className="p-4 font-bold text-center">Saldo Restante</th>
                                        <th className="p-4 font-bold text-center">Gatilho Reposição</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((p) => {
                                        const isCritical = p.currentStock <= p.minStock;
                                        return (
                                            <tr key={p.id} className="border-b border-outline-variant/5 hover:bg-surface-container-low transition-colors group">
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        {isCritical ? 
                                                            <div className="w-2 h-2 rounded-full bg-error" title="Estoque Crítico"></div> :
                                                            <div className="w-2 h-2 rounded-full bg-success"></div>
                                                        }
                                                        <span className="font-bold text-on-surface">{p.name}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-xs font-bold text-on-surface-variant bg-surface-container-low/50 rounded-lg inline-block mt-2 ml-4">{p.category}</td>
                                                <td className={`p-4 text-center text-lg font-headline font-extrabold ${isCritical ? 'text-error' : 'text-primary'}`}>{p.currentStock} <span className="text-xs font-body font-normal text-on-surface-variant">{p.unit}</span></td>
                                                <td className="p-4 text-center text-on-surface-variant font-bold">{p.minStock}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Timeline Tracker */}
                    <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-3xl shadow-sm overflow-hidden flex flex-col h-[600px]">
                        <div className="p-6 border-b border-outline-variant/10 bg-surface-container-low/30">
                            <h3 className="font-bold text-lg font-headline text-on-surface">Log de Auditoria (Operadores)</h3>
                        </div>
                        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 relative">
                            {/* Vertical line timeline */}
                            <div className="absolute left-9 top-6 bottom-6 w-px bg-outline-variant/20 -z-10"></div>
                            
                            <div className="space-y-6">
                                {movements.map((m) => (
                                    <div key={m.id} className="flex gap-4 relative z-0">
                                        <div className={`w-6 h-6 rounded-full border-4 border-surface-container-lowest flex items-center justify-center mt-1 shrink-0 shadow-sm ${m.type === 'IN' ? 'bg-success text-success-on' : 'bg-error text-error-on'}`}>
                                            <span className="material-symbols-outlined text-[10px] text-white font-bold">{m.type === 'IN' ? 'add' : 'remove'}</span>
                                        </div>
                                        <div className="flex-1 bg-surface-container-low/50 p-4 rounded-2xl border border-outline-variant/5">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-bold text-sm text-on-surface">{m.product?.name || `Ref: ${m.productId.substring(0,4)}`}</h4>
                                                <span className={`text-lg font-headline font-extrabold ${m.type === 'IN' ? 'text-success' : 'text-error'}`}>
                                                    {m.type === 'IN' ? '+' : '-'}{m.quantity}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center mt-2">
                                                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider bg-surface-container-lowest px-2 py-1 rounded-md">{m.reason}</span>
                                                <span className="text-[10px] font-bold text-on-surface-variant">{new Date(m.date).toLocaleDateString('pt-BR')}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Novo Produto */}
            {isProductModal && (
                <div className="fixed inset-0 bg-inverse-surface/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-3xl w-full max-w-lg p-8 shadow-2xl">
                        <h2 className="text-2xl font-bold font-headline mb-6 text-on-surface">Registrar Ativo-Base (SKU)</h2>
                        <form onSubmit={handleSaveProduct} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-on-surface-variant mb-1">Nome Técnico / Item</label>
                                <input required type="text" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} className="w-full bg-surface-container-low border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/50 text-on-surface" placeholder="Ex: Seringa Descartável 5ml" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-on-surface-variant mb-1">Área / Categoria</label>
                                    <select value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})} className="w-full bg-surface-container-low border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/50 text-on-surface cursor-pointer">
                                        <option value="CLINICAL">Materiais Clínicos</option>
                                        <option value="SURGICAL">Cirúrgico O.R.</option>
                                        <option value="OFFICE">Expediente Administrativo</option>
                                        <option value="PHARMA">Fármacos / Anestésico</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-on-surface-variant mb-1">Unidade Logística</label>
                                    <select value={productForm.unit} onChange={e => setProductForm({...productForm, unit: e.target.value})} className="w-full bg-surface-container-low border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/50 text-on-surface cursor-pointer">
                                        <option value="UN">UN (Unidade Individual)</option>
                                        <option value="CX">CX (Caixa Fechada)</option>
                                        <option value="PC">PC (Pacote/Fardo)</option>
                                        <option value="L">L (Litro/Galão)</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-on-surface-variant mb-1">Trilho de Segurança (Estoque Mínimo)</label>
                                <input required type="number" min="0" value={productForm.minStock} onChange={e => setProductForm({...productForm, minStock: e.target.value})} className="w-full bg-surface-container-low border-none rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-primary/50 text-on-surface font-mono" />
                            </div>
                            <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-outline-variant/10">
                                <button type="button" onClick={() => setIsProductModal(false)} className="px-5 py-2.5 rounded-xl font-bold text-on-surface-variant hover:bg-surface-container-high transition-colors">Abortar</button>
                                <button type="submit" className="px-5 py-2.5 rounded-xl font-bold bg-primary text-on-primary hover:bg-primary-dim transition-colors shadow-sm flex items-center gap-2">Gravar Inventário</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Movimentacao */}
            {isMovementModal && (
                <div className="fixed inset-0 bg-inverse-surface/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-3xl w-full max-w-lg p-8 shadow-2xl">
                        <h2 className="text-2xl font-bold font-headline mb-6 text-on-surface">Operar Almoxarifado</h2>
                        <form onSubmit={handleSaveMovement} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-on-surface-variant mb-1">Selecionar Ativo</label>
                                <select required value={movementForm.productId} onChange={e => setMovementForm({...movementForm, productId: e.target.value})} className="w-full bg-surface-container-low border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/50 text-on-surface cursor-pointer">
                                    <option value="">Aponte a Referência...</option>
                                    {products.map(p => <option key={p.id} value={p.id}>{p.name} (Saldo Disponível: {p.currentStock})</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-on-surface-variant mb-1">Viés Operacional</label>
                                    <select value={movementForm.type} onChange={e => setMovementForm({...movementForm, type: e.target.value})} className="w-full bg-surface-container-low border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/50 text-on-surface cursor-pointer font-bold">
                                        <option value="IN">ENTRADA (Supply)</option>
                                        <option value="OUT">SAÍDA (Consumption)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-on-surface-variant mb-1">Volume do Lote</label>
                                    <input required type="number" min="1" value={movementForm.quantity} onChange={e => setMovementForm({...movementForm, quantity: e.target.value})} className="w-full bg-surface-container-low border-none rounded-xl p-3 text-sm font-bold font-mono text-primary text-center focus:ring-2 focus:ring-primary/50" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-on-surface-variant mb-1">Anotação Fiscal (Razão Social)</label>
                                <select value={movementForm.reason} onChange={e => setMovementForm({...movementForm, reason: e.target.value})} className="w-full bg-surface-container-low border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/50 text-on-surface cursor-pointer">
                                    <option value="PURCHASE">Aquisição / Ordem de Compra</option>
                                    <option value="USAGE">Uso Clínico (Subtração Direta)</option>
                                    <option value="EXPIRATION">Descarte Biológico Vencido</option>
                                    <option value="ADJUSTMENT">Reconciliação Auditada</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-outline-variant/10">
                                <button type="button" onClick={() => setIsMovementModal(false)} className="px-5 py-2.5 rounded-xl font-bold text-on-surface-variant hover:bg-surface-container-high transition-colors">Abortar</button>
                                <button type="submit" className="px-5 py-2.5 rounded-xl font-bold bg-primary text-on-primary hover:bg-primary-dim transition-colors shadow-sm">Autorizar Commit</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
