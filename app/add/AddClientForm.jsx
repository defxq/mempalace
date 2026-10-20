'use client';
import { useState } from 'react';

export default function AddClientForm({ activeCategories, saveAction }) {
    // Standard React Switch State: 'flashcard' | 'blog'
    const [activeWorkspaceMode, setActiveWorkspaceMode] = useState('flashcard');
    const [contentMarkdown, setContentMarkdown] = useState('');

    const triggerModeToggle = (modeTarget) => {
        if (typeof document !== 'undefined' && document.activeElement) {
            document.activeElement.blur(); 
        }
        setActiveWorkspaceMode(modeTarget);
    };

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
            {/* Mobile Dashboard Header Layout */}
            <header className="flex flex-col gap-3 border-b border-[#30363d] pb-4 mb-5 max-w-[800px] mx-auto">
                <div className="flex justify-between items-center">
                    <h1 className="text-xs font-black tracking-[0.25em] text-[#00f0ff] uppercase drop-shadow-[0_0_6px_rgba(0,240,255,0.3)]">
                        ⚡ BLITZ // LOG.WORKSPACE
                    </h1>
                    <a href="/" className="text-xs text-[#8b949e] hover:text-white font-bold decoration-none">
                        ✕ Close
                    </a>
                </div>
                
                {/* Clean, Non-Mixed Tab Switcher Controls */}
                <div className="flex bg-[#111422] p-1 rounded border border-[#30363d] w-full relative z-50">
                    <button 
                        type="button" 
                        onClick={() => triggerModeToggle('flashcard')} 
                        className={`flex-1 text-center py-2.5 rounded text-xs font-bold transition cursor-pointer select-none active:scale-95 ${activeWorkspaceMode === 'flashcard' ? 'bg-[#30363d] text-white border border-[#8b949e]' : 'text-[#8b949e]'}`}
                    >
                        ⚡ CLI Matrix Cards
                    </button>
                    <button 
                        type="button" 
                        onClick={() => triggerModeToggle('blog')} 
                        className={`flex-1 text-center py-2.5 rounded text-xs font-bold transition cursor-pointer select-none active:scale-95 ${activeWorkspaceMode === 'blog' ? 'bg-[#30363d] text-white border border-[#8b949e]' : 'text-[#8b949e]'}`}
                    >
                        🧠 Continuous Blogs
                    </button>
                </div>
            </header>

            {/* MASTER NATIVE ACTION SUBMIT CONTAINER */}
            <form action={saveAction} className="max-w-[800px] mx-auto flex flex-col gap-4 relative z-10">
                {/* Hidden layout state tracker to tell your backend server action which mode is processing */}
                <input type="hidden" name="activeLayoutMode" value={activeWorkspaceMode} />

                {/* Shared Configuration Selection Deck */}
                <div className="bg-[#111422] border border-[#30363d] rounded p-4 flex flex-col gap-4 w-full">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 flex flex-col gap-1.5">
                            <label className="text-[#8b949e] text-xs">Category Track:</label>
                            <select name="nodeCategorySelect" className="bg-[#060810] border border-[#30363d] text-white p-2.5 rounded text-xs outline-none">
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
                            <input type="text" name="nodeCustomCategory" placeholder="e.g. Docker Pipelines" className="bg-[#060810] border border-[#30363d] text-white p-2.5 rounded text-xs outline-none focus:border-[#58a6ff]" />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[#8b949e] text-xs">Section Index:</label>
                        <input type="text" name="nodeSection" defaultValue="General" placeholder="e.g. account-removal" className="bg-[#060810] border border-[#30363d] text-white p-2.5 rounded text-xs outline-none focus:border-[#58a6ff]" />
                    </div>
                </div>

                {/* DECOUPLED INDEPENDENT COMPONENT RENDERING SECTION */}
                <div className="bg-[#111422] border border-[#30363d] rounded p-4 w-full">
                    {activeWorkspaceMode === 'flashcard' ? (
                        /* FLASHCARD MODE PANELS ONLY */
                        <div className="flex flex-col gap-4 animate-fadeIn">
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
                        /* BLOG MODE PANELS ONLY */
                        <div className="flex flex-col gap-4 animate-fadeIn">
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
