'use client';
import { useState } from 'react';

export default function EditClient({ activeItemNode }) {
    const [editTab, setEditTab] = useState(activeItemNode.tab || activeItemNode.category || '');
    const [editSection, setEditSection] = useState(activeItemNode.section || 'General');
    const [editCommand, setEditCommand] = useState(activeItemNode.command || '');
    const [editSyntax, setEditSyntax] = useState(activeItemNode.syntax || '');
    const [editNotes, setEditNotes] = useState(activeItemNode.notes || '');
    const [editTitle, setEditTitle] = useState(activeItemNode.title || '');
    const [editContent, setEditContent] = useState(activeItemNode.content || '');

    const isCardView = activeItemNode.layoutMode === 'lookup' || activeItemNode.command;

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const hostOrigin = window.location.origin;
            const res = await fetch(`${hostOrigin}/api/save?t=${Date.now()}`);
            const internalLibrary = await res.json();

            const finalizedDataset = internalLibrary.map(dbItem => {
                if (dbItem.id === activeItemNode.id) {
                    const refreshedNode = { ...dbItem, tab: editTab.trim(), section: editSection.trim() };
                    if (isCardView) {
                        refreshedNode.command = editCommand.trim();
                        refreshedNode.syntax = editSyntax.trim();
                        refreshedNode.notes = editNotes.trim();
                    } else {
                        refreshedNode.title = editTitle.trim();
                        refreshedNode.content = editContent;
                    }
                    return refreshedNode;
                }
                return dbItem;
            });

                       const response = await fetch(`${hostOrigin}/api/save`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalizedDataset)
            });
            
            const status = await response.json();
            if (status.success) {
                // FIXED: Direct browser re-route clears cached parameters out of the layout stream
                alert("Changes saved onto hard disk successfully!");
                window.location.href = '/manage';
            }

        } catch (err) {
            alert("Network connection timed out.");
        }
    };

    return (
        <main className="min-h-screen bg-[#0d1117] text-[#c9d1d9] p-4 sm:p-6 font-mono select-none">
            <div className="flex flex-col gap-1 border-b border-[#30363d] pb-4 mb-5 max-w-[800px] mx-auto">
                <div className="flex justify-between items-center">
                    <h1 className="text-xs font-bold tracking-wider text-white uppercase">⚡ BLITZ // DEDICATED.NODE.EDITOR</h1>
                    <a href="/manage" className="text-xs text-[#8b949e] hover:text-white font-bold decoration-none">✕ Cancel</a>
                </div>
                <p className="text-[10px] text-[#8b949e]">Updating ledger node vector entry index: [ID: {activeItemNode.id}]</p>
            </div>

            <div className="max-w-[800px] mx-auto flex flex-col gap-4 relative z-10">
                
                {/* PRIMARY EDIT UPDATE FORM */}
                <form onSubmit={handleFormSubmit} className="bg-[#161b22] border border-[#30363d] rounded-md p-4 flex flex-col gap-4 w-full">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[#8b949e] text-xs">Category Track:</label>
                            <input type="text" value={editTab} onChange={(e) => setEditTab(e.target.value)} className="bg-[#0d1117] border border-[#30363d] text-white p-2.5 rounded text-xs outline-none focus:border-[#58a6ff]" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[#8b949e] text-xs">Section Index:</label>
                            <input type="text" value={editSection} onChange={(e) => setEditSection(e.target.value)} className="bg-[#0d1117] border border-[#30363d] text-white p-2.5 rounded text-xs outline-none focus:border-[#58a6ff]" />
                        </div>
                    </div>

                    {isCardView ? (
                        <div className="flex flex-col gap-4 border-t border-[#30363d] pt-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[#34d399] text-xs font-bold">Base Command Name:</label>
                                <input type="text" value={editCommand} onChange={(e) => setEditCommand(e.target.value)} className="bg-[#0d1117] border border-[#30363d] text-[#34d399] p-2.5 rounded text-xs outline-none" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[#34d399] text-xs font-bold">Execution Syntax Layout String:</label>
                                <input type="text" value={editSyntax} onChange={(e) => setEditSyntax(e.target.value)} className="bg-[#0d1117] border border-[#30363d] text-white p-2.5 rounded text-xs outline-none" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[#8b949e] text-xs">Quick Core Operational Summary Notes Details:</label>
                                <input type="text" value={editNotes} onChange={(e) => setEditNotes(e.target.value)} className="bg-[#0d1117] border border-[#30363d] text-white p-2.5 rounded text-xs outline-none" />
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4 border-t border-[#30363d] pt-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[#58a6ff] text-xs font-bold">Article Workflow / Section Title:</label>
                                <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="bg-[#0d1117] border border-[#30363d] text-[#58a6ff] p-2.5 rounded text-xs outline-none" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[#8b949e] text-xs">Continuous Document Content Area:</label>
                                <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} rows={12} className="bg-[#010409] border border-[#30363d] text-[#c9d1d9] p-4 rounded-lg text-xs leading-relaxed resize-none h-[280px] outline-none focus:border-[#22d3ee]"></textarea>
                            </div>
                        </div>
                    )}

                    <button type="submit" className="bg-[#238636] border border-[#2ea44f] text-white p-3 rounded font-bold text-xs hover:bg-[#2ea44f] transition tracking-wider uppercase cursor-pointer mt-2 active:scale-95 w-full">Commit Changes onto Hard Disk ➔</button>
                </form>

                {/* FIXED SECONDARY ACTION WRAPPER: Native server pipeline form execution kills subnet blocks */}
                <form 
                    action="/api/delete" 
                    method="POST" 
                    onSubmit={(e) => { if (!confirm("Are you absolutely sure you want to permanently erase this ledger record?")) e.preventDefault(); }}
                    className="m-0 p-0 w-full"
                >
                    <input type="hidden" name="id" value={activeItemNode.id} />
                    <button 
                        type="submit" 
                        className="bg-transparent border border-[#30363d] text-[#f43f5e] hover:bg-[#f43f5e]/10 p-3 rounded font-bold text-xs transition tracking-wider uppercase cursor-pointer w-full active:scale-95"
                    >
                        🗑️ Delete This Record Permanently
                    </button>
                </form>

            </div>
        </main>
    );
}
