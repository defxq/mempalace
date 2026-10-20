'use client';
import { useState } from 'react';
import { runGitPushRoutine } from './actions';

export default function LaunchpadCockpitClient({ viewerUrl, initialHasChanges }) {
    const [hasChanges, setHasChanges] = useState(initialHasChanges);
    const [syncStatus, setSyncStatus] = useState(null); // 'syncing' | 'success' | 'failed'
    const [statusMessage, setStatusMessage] = useState('');

    const handleGitSync = async () => {
        if (!hasChanges) return; // Guard clause to kill execution on locked states
        
        setSyncStatus('syncing');
        setStatusMessage('ANALYZING DATABASE MATRIX... DISPATCHING CLOUD SNAPSHOT... [SYNCING]');
        
        const result = await runGitPushRoutine();
        
        if (result.success) {
            setSyncStatus('success');
            setStatusMessage('UPSTREAM REVISIONS DISPATCHED // CLOUD SYNCHRONIZED.');
            setHasChanges(false); // Relock the button since changes were pushed successfully
            setTimeout(() => { setSyncStatus(null); }, 5000); 
        } else {
            setSyncStatus('failed');
            setStatusMessage(`CRITICAL DATA DISRUPT: ${result.error || 'UPSTREAM ERROR'}`);
        }
    };

    return (
        <main className="h-[100dvh] w-screen bg-[#090b14] text-[#a9b2c3] font-mono flex flex-col justify-center items-center relative overflow-hidden">
            
            {/* Moody Atmospheric Twilight Gradient Blur Overlays */}
            <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[260px] h-[280px] bg-gradient-to-b from-[#1e1b4b] via-[#121034] to-transparent rounded-full filter blur-[60px] opacity-40 pointer-events-none" />
            <div className="absolute bottom-[-5%] w-[100px] h-[100px] bg-[#d97706]/5 rounded-full filter blur-[40px] pointer-events-none" />

            <div className="w-full max-w-[320px] px-4 box-border relative z-10 flex flex-col gap-5">
                
                {/* BRAND HEADER */}
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
                        'bg-[#ff0055]/5 border-[#ff0055]/20 text-[#ff0055]'
                    }`}>
                        {statusMessage}
                    </div>
                )}

                {/* HIGH-DENSITY INTERACTION NAVIGATION LINKS */}
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

                    {/* 
                       DYNAMIC CONDITIONAL DOCK BUTTON:
                       If local drive file updates exist, renders active with vibrant twilight orange tones.
                       If pristine, locks out mouse/touch clicks programmatically and visually grays out.
                    */}
                    {hasChanges ? (
                        <button 
                            type="button" 
                            onClick={handleGitSync}
                            className={`group bg-[#161012] border border-[#ff4500]/30 hover:border-[#ff4500]/60 hover:bg-[#241215] p-3.5 rounded text-xs font-black tracking-widest text-[#ff5500] transition duration-150 active:scale-[0.98] flex items-center justify-between w-full cursor-pointer mt-1 ${
                                syncStatus === 'syncing' ? 'animate-pulse' : ''
                            }`}
                        >
                            <span>🚀 SAVE TO CLOUD</span>
                            <span className="text-[#ff4500]/40 text-[10px]">✓</span>
                        </button>
                    ) : (
                        <button 
                            type="button" 
                            disabled
                            className="bg-[#11121a] border border-[#1f2335] text-[#424b61] p-3.5 rounded text-xs font-bold tracking-widest flex items-center justify-between w-full cursor-not-allowed mt-1 opacity-50 select-none"
                        >
                            <span>🔒 MAKE CHANGES TO SAVE</span>
                            <span className="text-[10px]">✖</span>
                        </button>
                    )}
                </div>

                <div className="text-[7.5px] text-[#333b4f] tracking-widest text-center uppercase mt-1">
                    SUBNET RUNTIME SECURE // STABLE ENVIRONMENT
                </div>

            </div>
        </main>
    );
}
