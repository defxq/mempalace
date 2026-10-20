import { headers } from 'next/headers';

export default async function EngineeringLaunchpad() {
    // FORCE DYNAMIC COMPILATION:
    // Extracting connection headers forces Next.js to run this code live on every page hit,
    // completely preventing the engine from caching static 'localhost' strings.
    const requestHeaders = await headers();
    const hostHeader = requestHeaders.get('host') || 'localhost:3000';
    
    // Isolate your laptop's current network IP profile address (e.g., 192.168.1.5)
    const activeHostname = hostHeader.split(':')[0];
    const computedViewerUrl = `http://${activeHostname}:8080`;

    return (
        <main className="min-h-screen bg-[#0d1117] text-[#c9d1d9] p-6 font-mono flex flex-col justify-center items-center select-none">
            
            {/* Minimal Header Layout */}
            <div className="text-center flex flex-col gap-1.5 mb-8 max-w-[440px]">
                <h1 className="text-xs font-bold tracking-widest text-white uppercase">
                    ⚡ BLITZ // ENGINE.LAUNCHPAD
                </h1>
                <p className="text-[11px] text-[#8b949e] leading-relaxed">
                    Wireless multi-repository hub managing your data matrix and local documentation systems.
                </p>
            </div>

            {/* Industrial Action Decks */}
            <div className="w-full max-w-[340px] flex flex-col gap-2.5">
                
                <a 
                    href="/add" 
                    className="bg-[#21262d] border border-[#30363d] hover:border-[#8b949e] text-white p-3.5 rounded text-xs font-bold text-center decoration-none transition active:scale-[0.98] flex items-center justify-between"
                >
                    <span>➕ ADD NEW LOG ENTRY</span>
                    <span className="text-[#8b949e] font-normal text-[10px]">➔</span>
                </a>

                <a 
                    href="/manage" 
                    className="bg-[#21262d] border border-[#30363d] hover:border-[#8b949e] text-white p-3.5 rounded text-xs font-bold text-center decoration-none transition active:scale-[0.98] flex items-center justify-between"
                >
                    <span>🛠️ MANAGE & EDIT LEDGER</span>
                    <span className="text-[#8b949e] font-normal text-[10px]">➔</span>
                </a>

                {/* HARDWARE REPO LINK: Completely generated on your laptop server to point flawlessly to Port 8080 over Wi-Fi */}
                <a 
                    href={computedViewerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#1f242c] border border-[#e3b341]/20 hover:border-[#e3b341]/40 text-[#e3b341] p-3.5 rounded text-xs font-bold text-center decoration-none transition active:scale-[0.98] flex items-center justify-between mt-2"
                >
                    <span>🌐 LAUNCH REPO 1 PYTHON VIEW-PORT</span>
                    <span className="text-[#e3b341]/60 font-normal text-[10px]">↗</span>
                </a>

            </div>

            <div className="absolute bottom-6 text-[10px] text-[#161b22] tracking-wider uppercase">
                STATUS: ACTIVE RUNTIME // NET IP FIXED // SUBNET SECURE
            </div>

        </main>
    );
}
