'use client';
import { useState } from 'react';

export default function ManageClient({ initialLibrary }) {
    const [library, setLibrary] = useState(initialLibrary);
    const [searchQuery, setSearchString] = useState('');

    const handleNativeEraseSubmit = async (e, targetId) => {
        if (!confirm("Are you absolutely sure you want to permanently erase this ledger record?")) {
            e.preventDefault();
            return;
        }
        
        // Optimistically clean out the row instantly on your screen view mapping canvas
        setLibrary(prev => prev.filter(item => item.id !== targetId));
    };

    const filteredListings = library.filter(item => {
        const searchLower = searchQuery.toLowerCase();
        return (item.tab || '').toLowerCase().includes(searchLower) ||
               (item.section || '').toLowerCase().includes(searchLower) ||
               (item.command || '').toLowerCase().includes(searchLower) ||
               (item.title || '').toLowerCase().includes(searchLower);
    });

    return (
        <main className="min-h-screen bg-[#0d1117] text-[#c9d1d9] p-4 sm:p-6 font-mono select-none">
            {/* Dashboard Header */}
            <div className="flex flex-col gap-2 border-b border-[#30363d] pb-4 mb-5">
                <div className="flex justify-between items-center">
                    <h1 className="text-xs font-bold tracking-wider text-white uppercase">
                        ⚡ BLITZ // SYSTEM.MANAGEMENT.DECK
                    </h1>
                    <a href="/" className="text-xs text-[#58a6ff] hover:underline font-bold decoration-none">
                        ← Dashboard
                    </a>
                </div>
                <input 
                    type="text" 
                    value={searchQuery} 
                    onChange={(e) => setSearchString(e.target.value)} 
                    placeholder="Search by category, section, command, or title..." 
                    className="bg-[#010409] border border-[#30363d] text-white p-2.5 rounded text-xs outline-none focus:border-[#58a6ff] w-full mt-2"
                />
            </div>

            {/* MASTER RENDER LIST FOR EDITING AND DELETING */}
            <div className="flex flex-col gap-3 max-w-[800px] mx-auto">
                {filteredListings.length === 0 ? (
                    <p className="text-xs text-[#8b949e] text-center py-6">No matching records found in the database.</p>
                ) : (
                    filteredListings.map(item => {
                        const isCardMode = item.layoutMode === 'lookup' || item.command;

                        return (
                            <div key={item.id} className="bg-[#161b22] border border-[#30363d] rounded-md p-4 flex flex-col gap-3 transition">
                                <div className="flex flex-col gap-2">
                                    <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                                        <span className="bg-[#21262d] border border-[#30363d] px-2 py-0.5 rounded text-white font-bold">
                                            {item.tab || item.category}
                                        </span>
                                        <span className="bg-black/20 text-[#8b949e] px-2 py-0.5 rounded border border-[#30363d]">
                                            # {item.section || 'General'}
                                        </span>
                                        <span className={`ml-auto font-bold px-1.5 py-0.5 rounded ${isCardMode ? 'text-[#34d399] bg-[#34d399]/5' : 'text-[#58a6ff] bg-[#58a6ff]/5'}`}>
                                            {isCardMode ? '⚡ CARD' : '🧠 BLOG'}
                                        </span>
                                    </div>

                                    <div className="text-xs font-bold text-white mt-1">
                                        {isCardMode ? (item.command || item.syntax) : item.title}
                                    </div>

                                    {/* TOUCH-PROOF SUBNET CONTROL ACTIONS CONTAINER */}
                                    <div className="flex gap-2 border-t border-[#30363d] pt-2.5 mt-1 items-center">
                                        <a 
                                            href={`/edit/${item.id}`} 
                                            className="flex-1 text-center bg-[#21262d] border border-[#30363d] hover:border-[#8b949e] text-white py-1.5 rounded font-bold text-xs cursor-pointer select-none decoration-none active:scale-95 transition"
                                        >
                                            ✏️ Edit
                                        </a>

                                        {/* FIXED ACTION WRAPPER: Native server pipeline form execution kills subnet blocks */}
                                        <form 
                                            action="/api/delete" 
                                            method="POST" 
                                            onSubmit={(e) => handleNativeEraseSubmit(e, item.id)}
                                            className="m-0 p-0"
                                        >
                                            <input type="hidden" name="id" value={item.id} />
                                            <button 
                                                type="submit" 
                                                className="bg-transparent border border-transparent text-[#f43f5e] hover:underline px-4 py-1.5 rounded font-bold text-xs cursor-pointer active:scale-95 transition"
                                            >
                                                🗑️ Delete
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </main>
    );
}
