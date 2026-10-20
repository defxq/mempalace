import { Suspense } from 'react';
import { headers } from 'next/headers';
// FIXED: Path fixed to parent directory lookup to resolve the file correctly
import { getGitCommitHistory } from '../actions';

async function CommitHistoryListDeck() {
    // CACHE BUSTER CORE ROUTINE: 
    // Triggers a fresh live terminal repaint over the subnet on every single hit
    await headers(); 
    const logs = await getGitCommitHistory();

    return (
        <div className="flex flex-col gap-3 max-w-[800px] mx-auto pb-6">
            {logs.length === 0 ? (
                <p className="text-xs text-[#8b949e] text-center py-6 border border-dashed border-[#30363d] rounded">
                    NO REPOSITORY COMMITS LOCATED IN SYSTEM PATH VECTORS.
                </p>
            ) : (
                logs.map((commit, index) => (
                    <div key={index} className="bg-[#111422] border border-[#30363d] rounded p-3.5 flex flex-col gap-2 relative overflow-hidden">
                        {/* Glow indicator line for the latest commit hash */}
                        {index === 0 && (
                            <div className="absolute top-0 left-0 w-full h-[2px] bg-[#a855f7] shadow-[0_0_8px_#a855f7]" />
                        )}
                        <div className="flex items-center justify-between text-[10px] tracking-wider font-bold">
                            <span className="text-[#a855f7] bg-[#a855f7]/10 px-2 py-0.5 rounded border border-[#a855f7]/20 font-mono">
                                commit {commit.hash}
                            </span>
                            <span className="text-[#8b949e]">
                                {commit.date} // {commit.author}
                            </span>
                        </div>
                        <div className="text-xs text-white leading-relaxed font-semibold mt-1">
                            {commit.message}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default function GitHistoryDashboard() {
    return (
        <main className="min-h-screen bg-[#060810] text-[#c9d1d9] p-4 sm:p-6 font-mono select-none">
            {/* Header Dashboard Control Banner */}
            <div className="flex flex-col gap-1 border-b border-[#30363d] pb-4 mb-5 max-w-[800px] mx-auto">
                <div className="flex justify-between items-center">
                    <h1 className="text-xs font-black tracking-[0.25em] text-[#a855f7] uppercase drop-shadow-[0_0_6px_rgba(168,85,247,0.3)]">
                        📜 REPOSITORY // COMMIT.HISTORY
                    </h1>
                    <a href="/" className="text-xs text-[#8b949e] hover:text-white font-bold decoration-none">
                        ✕ Close
                    </a>
                </div>
                <p className="text-[10px] text-[#4a5568] uppercase tracking-widest mt-1">
                    Live upstream pipeline commit timeline indexes read from Repo 1 shell.
                </p>
            </div>

            <Suspense fallback={
                <div className="text-center py-12 text-xs font-bold text-[#a855f7] tracking-widest animate-pulse">
                    ⚡ PARSING TERMINAL GIT LOG STREAMS...
                </div>
            }>
                <CommitHistoryListDeck />
            </Suspense>
        </main>
    );
}
