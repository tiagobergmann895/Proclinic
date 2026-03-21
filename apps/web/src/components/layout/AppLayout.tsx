import { ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    userProfile: any;
    currentRoute: string;
    onLogout: () => void;
}

export function AppLayout({ children, userProfile, currentRoute, onLogout }: AppLayoutProps) {
    const doctorName = userProfile?.name || userProfile?.email?.split('@')[0] || 'Julian Vance';
    const clinicName = userProfile?.memberships?.[0]?.tenant?.name || 'City Central Clinic';
    
    // Default avatar if no profile picture, but we'll use a placeholder for identical look
    const avatarUrl = "https://i.pravatar.cc/150?u=a042581f4e29026704d"; 

    const renderNav = (href: string, icon: string, label: string, routeKey: string) => {
        const isActive = currentRoute === routeKey;
        const activeContainerClass = isActive ? "bg-white shadow-sm text-[#005bc1]" : "text-[#566166] hover:text-slate-800 hover:bg-slate-200/50";
        const iconClass = isActive ? "text-[#005bc1]" : "text-[#566166]";

        return (
            <a href={href} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold font-headline text-[15px] ${activeContainerClass}`}>
                <span className={`material-symbols-outlined ${iconClass}`} style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>{icon}</span>
                <span>{label}</span>
            </a>
        );
    };

    return (
        <div className="flex min-h-screen bg-white text-slate-800 font-body">
            {/* SideNavBar */}
            <aside className="h-screen w-64 fixed left-0 top-0 overflow-y-auto bg-[#f4f7f9] z-50 flex flex-col">
                <div className="px-8 pt-8 pb-6">
                    <h1 className="text-[22px] font-extrabold text-slate-800 font-headline tracking-tight leading-none mb-1">MediFlow ERP</h1>
                    <p className="text-[13px] text-slate-500 font-medium">{clinicName}</p>
                </div>
                
                <nav className="flex-1 px-4 flex flex-col gap-1 mt-2">
                    {renderNav('/dashboard', 'grid_view', 'Dashboard', 'dashboard')}
                    {renderNav('/appointments', 'calendar_month', 'Appointments', 'appointments')}
                    {renderNav('/records', 'medical_information', 'EHR Records', 'records')}
                    {renderNav('/finance', 'payments', 'Financials', 'finance')}
                    {renderNav('/settings', 'settings', 'Settings', 'settings')}
                </nav>

                <div className="p-6 mt-auto">
                    <button className="w-full bg-[#005bc1] hover:bg-blue-700 text-white font-semibold font-headline py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition-colors focus:outline-none focus:ring-4 focus:ring-blue-100">
                        <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>add_circle</span>
                        <span>New Appointment</span>
                    </button>
                    
                    {/* Logout Hidden Trigger for functionality */}
                    <button onClick={onLogout} className="w-full mt-4 text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors">
                        Desconectar Sessão
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="ml-64 flex-1 flex flex-col min-w-0 bg-white">
                {/* TopAppBar */}
                <header className="fixed top-0 right-0 w-[calc(100%-16rem)] z-40 bg-white h-[88px]">
                    <div className="flex justify-between items-center px-8 h-full">
                        {/* Global Search */}
                        <div className="w-[450px] relative mt-2">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-[20px]">search</span>
                            <input 
                                className="w-full bg-[#FCFCFD] border border-slate-200 rounded-full py-3.5 pl-12 pr-4 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#005bc1] focus:ring-4 focus:ring-blue-50 transition-all" 
                                placeholder="Search patients, doctors or records..." 
                                type="text" 
                            />
                        </div>
                        
                        {/* Profile & Actions */}
                        <div className="flex items-center gap-7 mt-2">
                            <button className="text-slate-500 hover:text-slate-800 transition-colors relative">
                                <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>notifications</span>
                                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                            </button>
                            <button className="text-slate-500 hover:text-slate-800 transition-colors">
                                <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>help</span>
                            </button>
                            
                            <div className="flex items-center gap-3 pl-8 cursor-pointer group">
                                <div className="text-right">
                                    <p className="text-[14px] font-bold text-slate-800 font-headline group-hover:text-[#005bc1] transition-colors">{doctorName}</p>
                                    <p className="text-[12px] font-medium text-slate-500">Cardiologist</p>
                                </div>
                                <img src={avatarUrl} alt="User Avatar" className="w-10 h-10 rounded-full object-cover shadow-sm border border-slate-200" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Canvas inserted here */}
                <div className="mt-[88px] min-h-[calc(100vh-88px)] relative">
                    {children}
                </div>
            </main>
        </div>
    );
}
