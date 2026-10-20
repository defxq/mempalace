'use client';
import { useState } from 'react';
import { runGitPushRoutine } from './actions';

export default function LaunchpadCockpitClient({ viewerUrl }) {
    const [syncStatus, setSyncStatus] = useState(null); // 'syncing' | 'success' | 'pristine' | 'failed'
    const [statusMessage, setStatusMessage] = useState('');

    const handleGitSync = async () => {
        setSyncStatus('syncing');
        setStatusMessage('ANALYZING LOCAL DATA REVISIONS... [SYNCING]');
        
        const result = await runGitPushRoutine();
        
        if (result.success) {
            if (result.changesDetected === false) {
                setSyncStatus('pristine');
                setStatusMessage('WORKSPACE PRISTINE // NO REVISIONS DETECTED ON HARD DRIVE.');
            } else {
                setSyncStatus('success');
                setStatusMessage('UPSTREAM REVISIONS DISPATCHED // CLOUD SYNCHRONIZED.');
            }
            setTimeout(() => { setSyncStatus(null); }, 5000); 
        } else {
            setSyncStatus('failed');
            setStatusMessage(`CRITICAL DATA DISRUPT: ${result.error || 'UPSTREAM ERROR'}`);
        }
    };

    return (
        /* 
           DYNAMIC VIEWPORT BOUNDARY FIX: 
           Using h-[100dvh] layout layers with zero padding caps locks the main card wrapper 
           directly to the mobile screen boundary frame to eliminate the 1cm top-to-bottom drag bounce, 
           while leaving pinch-to-zoom browser gestures fully functional.
        */
        <main className="h-[100dvh] w-screen bg-[#090b14] text-[#a9b2c3] font-mono flex flex-col justify-center items-center relative overflow-hidden">
            
            {/* Moody Atmospheric Twilight Gradient Blur Overlays */}
            <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[260px] h-[280px] bg-gradient-to-b from-[#1e1b4b] via-[#121034] to-transparent rounded-full filter blur-[60px] opacity-40 pointer-events-none" />
            <div className="absolute bottom-[-5%] w-[100px] h-[100px] bg-[#d97706]/5 rounded-full filter blur-[40px] pointer-events-none" />

            <div className="w-full max-w-[320px] px-4 box-border relative z-10 flex flex-col gap-5">
                
                {/* REBRANDED MEMPALACE HEADER */}
                <div className="flex flex-col gap-1 text-center">
                    <h1 className="text-xs font-black tracking-[0.35em] text-[#e2e8f0] uppercase">
                        ⚡ MEMPALACE
                    </h1>
                    <p className="text-[9px] text-[#525e75] tracking-wide mt-1 uppercase">
                        REPOSITORIES REVISION DECK
                    </p>
                    
                    {/* Fiery Warm Amber Streetlamp Glow Accent Indicator */}
                    <div className="w-[140px] h-[1px] mx-auto bg-gradient-to-r from-transparent via-[#ff8800] to-transparent shadow-[0_0_8px_#ff6600] mt-3" />
                </div>

                {/* LOGS RESPONSIVE BANNER LAYER */}
                {syncStatus && (
                    <div className={`p-3 border rounded text-[9px] font-bold tracking-wider uppercase transition-all duration-300 text-center leading-relaxed ${
                        syncStatus === 'syncing' ? 'bg-[#00f0ff]/5 border-[#00f0ff]/20 text-[#00f0ff]' :
                        syncStatus === 'success' ? 'bg-[#00ff88]/5 border-[#00ff88]/20 text-[#00ff88]' :
                        syncStatus === 'pristine' ? 'bg-[#ff8800]/5 border-[#ff8800]/30 text-[#ffaa00] shadow-[0_0_8px_rgba(255,136,0,0.1)]' :
                        'bg-[#ff0055]/5 border-[#ff0055]/20 text-[#ff0055]'
                    }`}>
                        {statusMessage}
                    </div>
                )}

                {/* HIGH-DENSITY DEEP TWILIGHT INTERACTION LINKS ROW DECKS */}
                <div className="flex flex-col gap-2.5 w-full">
                    <a 
                        href="/add" 
                        className="group bg-[#111424] border border-[#232946] hover:border-[#ff8800]/30 p-3.5 rounded text-xs font-bold tracking-widest text-[#cbd5e1] decoration-none transition duration-150 active:scale-[0.98] flex items-center justify-between"
                    >
                        <span className="group-hover:text-[#ffaa00] transition">📂 ADD NEW</span>
                        <span className="text-[#3b4261] text-[10px] group-hover:text-[#ffaa00] transition">➔</span>
                    </a>

                    <a 
                        href="/manage" 
                        className="group bg-[#111424] border border-[#232946] hover:border-[#ff8800]/30 p-3.5 rounded text-xs font-bold tracking-widest text-[#cbd5e1] decoration-none transition duration-150 active:scale-[0.98] flex items-center justify-between"
                    >
                        <span className="group-hover:text-[#ffaa00] transition">🛠️ MANAGE</span>
                        <span className="text-[#3b4261] text-[10px] group-hover:text-[#ffaa00] transition">➔</span>
                    </a>

                    <a 
                        href={viewerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group bg-[#111424] border border-[#232946] hover:border-[#ff8800]/40 p-3.5 rounded text-xs font-bold tracking-widest text-[#ffaa00] decoration-none transition duration-150 active:scale-[0.98] flex items-center justify-between"
                    >
                        <span>🌐 OPEN VIEW-PORT</span>
                        <span className="text-[#ffaa00]/40 text-[10px]">↗</span>
                    </a>

                    <a 
                        href="/history" 
                        className="group bg-[#111424] border border-[#232946] hover:border-[#ff8800]/30 p-3.5 rounded text-xs font-bold tracking-widest text-[#cbd5e1] decoration-none transition duration-150 active:scale-[0.98] flex items-center justify-between"
                    >
                        <span className="group-hover:text-[#ffaa00] transition">📜 HISTORY</span>
                        <span className="text-[#3b4261] text-[10px] group-hover:text-[#ffaa00] transition">➔</span>
                    </a>

                    {/* REDESIGNED: INTERACTIVE REVISION SAVE BUTTON FOR NATIVE SYSTEM ACTIONS */}
                    <button 
                        type="button" 
                        disabled={syncStatus === 'syncing'}
                        onClick={handleGitSync}
                        className={`group bg-[#1a1215] border border-[#ff4500]/20 hover:border-[#ff4500]/50 hover:bg-[#201416] p-3.5 rounded text-xs font-black tracking-widest text-[#ff5500] transition duration-150 active:scale-[0.98] flex items-center justify-between w-full cursor-pointer disabled:opacity-40 disabled:pointer-events-none mt-1 ${
                            syncStatus === 'syncing' ? 'animate-pulse' : ''
                        }`}
                    >
                        <span>🚀 SAVE TO CLOUD</span>
                        <span className="text-[#ff4500]/40 text-[10px]">✓</span>
                    </button>
                </div>

                <div className="text-[7.5px] text-[#333b4f] tracking-widest text-center uppercase mt-1">
                    SUBNET RUNTIME SECURE // STABLE ENVIRONMENT
                </div>

            </div>
        </main>
    );
}
