'use client';
import { useState, useEffect } from 'react';

export default function AddClientForm({ activeCategories, categoryArchetypeMap, saveAction }) {
    // Dropdown track state settings
    const [selectedCategory, setSelectedCategory] = useState(activeCategories[0] || 'Linux Core');
    const [customCategory, setCustomCategory] = useState('');
    const [sectionIndex, setSectionIndex] = useState('General');

    // Master operational layout switch tracker: 'flashcard' | 'blog'
    const [activeWorkspaceMode, setActiveWorkspaceMode] = useState('flashcard');
    
    // Safety lock tracker handles locking navigation tabs out of sight
    const [isLayoutLocked, setIsLayoutLocked] = useState(false);
    const [contentMarkdown, setContentMarkdown] = useState('');

    // SMART INTERACTION GUARD ROUTINE:
    // Tracks adjustments across dropdown changes and text strings to lock design archetypes
    useEffect(() => {
        if (customCategory.trim() !== '') {
            // Unlocks toggling parameters for entirely fresh categories
            setIsLayoutLocked(false);
        } else {
            // Locks the layout view directly to the existing archetype saved inside your database
            const savedArchetype = categoryArchetypeMap[selectedCategory];
            if (savedArchetype) {
                setActiveWorkspaceMode(savedArchetype);
                setIsLayoutLocked(true);
            } else {
                setIsLayoutLocked(false);
            }
        }
    }, [selectedCategory, customCategory, categoryArchetypeMap]);

    const injectCodeMarkup = (type) => {
        const textarea = document.getElementById('editor-textarea');
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selection = textarea.value.substring(start, end);
        if (!selection) return;

        let wrappedString = '';
        if (type === 'inline') {
            wrappedString = `<span class="code-inline">${selection}</span>`;
        } else {
            wrappedString = `<div class="code-block-wrapper" onclick="navigator.clipboard.writeText(this.querySelector('code').innerText); alert('Command snippet captured to clipboard!')"><pre><code>${selection}</code></pre></div>`;
        }

        const updatedText = textarea.value.substring(0, start) + wrappedString + textarea.value.substring(end);
        setContentMarkdown(updatedText);
    };
    return (
        <main className="min-h-screen bg-[#060810] text-[#c9d1d9] p-4 sm:p-6 font-mono select-none">
            {/* Header Dashboard Control Banner Layout */}
            <header className="flex flex-col gap-3 border-b border-[#30363d] pb-4 mb-5 max-w-[800px] mx-auto">
                <div className="flex justify-between items-center">
                    <h1 className="text-xs font-black tracking-[0.25em] text-[#00f0ff] uppercase drop-shadow-[0_0_6px_rgba(0,240,255,0.3)]">
                        ⚡ MEMPALACE // GUARD.WORKSPACE
                    </h1>
                    <a href="/" className="text-xs text-[#8b949e] hover:text-white font-bold decoration-none">
                        ✕ Close
                    </a>
                </div>
                
                {/* 
                   DYNAMIC ARCHETYPE TAB SWITCHER:
                   If an existing category is chosen, this selector locks up visually and programmatically, 
                   preventing cross-type entries from polluting your database cards layout grid.
                */}
                <div className="flex bg-[#111422] p-1 rounded border border-[#30363d] w-full relative z-50">
                    <button 
                        type="button" 
                        disabled={isLayoutLocked}
                        onClick={() => setActiveWorkspaceMode('flashcard')} 
                        className={`flex-1 text-center py-2.5 rounded text-xs font-bold transition cursor-pointer select-none active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${activeWorkspaceMode === 'flashcard' ? 'bg-[#30363d] text-white border border-[#8b949e]' : 'text-[#8b949e]'}`}
                    >
                        ⚡ CLI Matrix Cards {isLayoutLocked && activeWorkspaceMode === 'flashcard' && '🔒'}
                    </button>
                    <button 
                        type="button" 
                        disabled={isLayoutLocked}
                        onClick={() => setActiveWorkspaceMode('blog')} 
                        className={`flex-1 text-center py-2.5 rounded text-xs font-bold transition cursor-pointer select-none active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${activeWorkspaceMode === 'blog' ? 'bg-[#30363d] text-white border border-[#8b949e]' : 'text-[#8b949e]'}`}
                    >
                        🧠 Continuous Blogs {isLayoutLocked && activeWorkspaceMode === 'blog' && '🔒'}
                    </button>
                </div>
                {isLayoutLocked && (
                    <p className="text-[10px] text-[#ffaa00] tracking-wide uppercase text-center mt-1 animate-pulse">
                        ⚠️ Category profile design archetype locked to protect model rendering consistency.
                    </p>
                )}
            </header>

            {/* MASTER NATIVE ACTION SUBMIT ACTION DECK */}
            <form action={saveAction} className="max-w-[800px] mx-auto flex flex-col gap-4 relative z-10">
                <input type="hidden" name="activeLayoutMode" value={activeWorkspaceMode} />

                {/* Configuration Input Panel */}
                <div className="bg-[#111422] border border-[#30363d] rounded p-4 flex flex-col gap-4 w-full">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 flex flex-col gap-1.5">
                            <label className="text-[#8b949e] text-xs">Category Track:</label>
                            <select 
                                name="nodeCategorySelect" 
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="bg-[#060810] border border-[#30363d] text-white p-2.5 rounded text-xs outline-none"
                            >
                                {activeCategories.length > 0 ? activeCategories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                )) : (
                                    <>
                                        <option value="Linux Core">Linux Core</option>
                                        <option value="Networking">Networking</option>
                                        <option value="Git Mechanics">Git Mechanics</option>
                                    </>
                                )}
                            </select>
                        </div>
                        <div className="flex-1 flex flex-col gap-1.5">
                            <label className="text-[#8b949e] text-xs">Or New Custom Category:</label>
                            <input 
                                type="text" 
                                name="nodeCustomCategory" 
                                value={customCategory}
                                onChange={(e) => setCustomCategory(e.target.value)}
                                placeholder="e.g. Docker Pipelines" 
                                className="bg-[#060810] border border-[#30363d] text-white p-2.5 rounded text-xs outline-none focus:border-[#58a6ff]" 
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[#8b949e] text-xs">Section Index:</label>
                        <input type="text" name="nodeSection" value={sectionIndex} onChange={(e) => setSectionIndex(e.target.value)} placeholder="e.g. account-removal" className="bg-[#060810] border border-[#30363d] text-white p-2.5 rounded text-xs outline-none focus:border-[#58a6ff]" />
                    </div>
                </div>

                {/* Form Rendering Canvas */}
                <div className="bg-[#111422] border border-[#30363d] rounded p-4 w-full">
                    {activeWorkspaceMode === 'flashcard' ? (
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1 flex flex-col gap-1.5">
                                    <label className="text-[#34d399] text-xs font-bold">Base Command Target Name:</label>
                                    <input type="text" name="nodeCommand" placeholder="e.g. tar" className="bg-[#060810] border border-[#30363d] text-[#34d399] p-2.5 rounded text-xs outline-none" />
                                </div>
                                <div className="flex-1 flex flex-col gap-1.5">
                                    <label className="text-[#34d399] text-xs font-bold">Full Execution Syntax Layout String:</label>
                                    <input type="text" name="nodeSyntax" placeholder="e.g. tar -czvf [archive.tar.gz]" className="bg-[#060810] border border-[#30363d] text-white p-2.5 rounded text-xs outline-none" />
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[#8b949e] text-xs">Individual Flag Parameters List Array:</label>
                                <textarea name="nodeFlags" rows={5} placeholder="-c : Creates archive wrapper&#10;-z : Gzip formats" className="bg-[#060810] border border-[#30363d] text-[#e2e8f0] p-3 rounded text-xs leading-relaxed resize-none outline-none focus:border-[#58a6ff]"></textarea>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[#8b949e] text-xs">Quick Core Operational Summary Notes Details:</label>
                                <input type="text" name="nodeNotes" placeholder="e.g. Compresses files quickly." className="bg-[#060810] border border-[#30363d] text-white p-2.5 rounded text-xs outline-none focus:border-[#58a6ff]" />
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[#58a6ff] text-xs font-bold">Article Workflow / Blog Section Heading Title:</label>
                                <input type="text" name="nodeTitle" placeholder="e.g. Deep Dive: Understanding Git Architecture" className="bg-[#060810] border border-[#30363d] text-white p-2.5 rounded text-xs outline-none focus:border-[#58a6ff]" />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <div className="flex justify-between items-center mb-1">
                                    <label className="text-[#8b949e] text-xs">Continuous Text Content Editor:</label>
                                    <div className="flex gap-2">
                                        <button type="button" onClick={() => injectCodeMarkup('inline')} className="bg-[#30363d] border border-[#30363d] text-[#f43f5e] text-[11px] px-2.5 py-1 rounded font-bold cursor-pointer active:scale-95">
                                            [+ Inline]
                                        </button>
                                        <button type="button" onClick={() => injectCodeMarkup('block')} className="bg-[#30363d] border border-[#30363d] text-[#34d399] text-[11px] px-2.5 py-1 rounded font-bold cursor-pointer active:scale-95">
                                            [+ Block]
                                        </button>
                                    </div>
                                </div>
                                <textarea 
                                    id="editor-textarea" 
                                    name="nodeContent" 
                                    value={contentMarkdown} 
                                    onChange={(e) => setContentMarkdown(e.target.value)} 
                                    rows={12} 
                                    placeholder="Write text formatting logs..." 
                                    className="bg-[#060810] border border-[#30363d] text-[#e2e8f0] p-4 rounded text-xs leading-relaxed resize-none h-[280px] outline-none focus:border-[#22d3ee]"
                                ></textarea>
                            </div>
                        </div>
                    )}

                    <button type="submit" className="bg-[#238636] border border-[#2ea44f] text-white p-3 rounded font-bold text-xs hover:bg-[#2ea44f] transition tracking-wider uppercase cursor-pointer mt-4 active:scale-95 w-full">
                        Commit Entry parameters ➔
                    </button>
                </div>
            </form>
        </main>
    );
}
