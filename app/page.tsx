'use client';
import { useState, useEffect } from 'react';

export default function MobileWorkspaceEditor() {
    const [library, setLibrary] = useState([]);

    // Shared Category Global States
    const [categoryName, setCategoryName] = useState('Git Mechanics');
    const [customCategoryInput, setCustomCategoryInput] = useState('');
    const [subSection, setSubSection] = useState('General');

    // Flashcard Specific Fields
    const [baseCommand, setBaseCommand] = useState('');
    const [syntaxLine, setSyntaxLine] = useState('');
    const [flagEntries, setFlagEntries] = useState('');
    const [shortNotes, setShortNotes] = useState('');

    // Continuous Document Blog Fields
    const [articleTitle, setArticleTitle] = useState('');
    const [contentMarkdown, setContentMarkdown] = useState('');

    // Fetch baseline vault files from local Repo 1 server on render boot
    useEffect(() => {
        async function fetchVault() {
            try {
                const res = await fetch('http://localhost:8080/data.json');
                const data = await res.json();
                setLibrary(data);
            } catch (err) {
                console.warn("Baseline data.json context unavailable.");
            }
        }
        fetchVault();
    }, []);

    const activeCategories = [...new Set(library.map((item) => item.tab || item.category))].filter(Boolean);

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
            wrappedString = '<div class="code-block-wrapper" onclick="navigator.clipboard.writeText(this.querySelector(\'code\').innerText); alert(\'Command snippet captured to clipboard!\')"><pre><code>' + selection + '</code></pre></div>';
        }

        const updatedText = textarea.value.substring(0, start) + wrappedString + textarea.value.substring(end);
        setContentMarkdown(updatedText);
    };

    const handleSaveRecord = async (targetMode) => {
        const tabTarget = customCategoryInput.trim() || categoryName;

        if (targetMode === 'flashcard' && (!baseCommand || !syntaxLine)) {
            alert("Flashcard matrix logs require a base command and syntax definition.");
            return;
        }
        if (targetMode === 'blog' && (!articleTitle || !contentMarkdown)) {
            alert("Continuous blog workflow logs require a title tracking label and content strings.");
            return;
        }

        let newRecord = {
            id: String(Date.now()),
            tab: tabTarget,
            layoutMode: targetMode === 'flashcard' ? 'lookup' : 'concept',
            section: subSection.trim() || 'General'
        };

        if (targetMode === 'flashcard') {
            const structuredFlags = [];
            if (flagEntries.trim()) {
                flagEntries.split('\n').forEach(line => {
                    const sections = line.split(':');
                    if (sections.length >= 2) {
                        structuredFlags.push({ flag: sections.trim(), desc: sections.slice(1).join(':').trim() });
                    } else if (line.trim()) {
                        structuredFlags.push({ flag: line.trim(), desc: "Parameter execution enabled." });
                    }
                });
            }

            newRecord.command = baseCommand.trim();
            newRecord.syntax = syntaxLine.trim();
            newRecord.flags = structuredFlags.length > 0 ? structuredFlags : [{ flag: "Default", desc: "Standard lookup parameters." }];
            newRecord.notes = shortNotes.trim() || "Fast lookup command.";
        } else {
            newRecord.title = articleTitle.trim();
            newRecord.content = contentMarkdown;
        }

        const updatedDatabasePayload = [...library, newRecord];
        setLibrary(updatedDatabasePayload);

        try {
            const response = await fetch('/api/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedDatabasePayload)
            });
            const status = await response.json();
            if (status.success) alert(`Successfully logged item inside the [${tabTarget}] workspace tree ledger!`);
        } catch (err) {
            alert("Changes cached in active memory, but storage sync service went offline.");
        }

        setBaseCommand(''); setSyntaxLine(''); setFlagEntries(''); setShortNotes('');
        setArticleTitle(''); setContentMarkdown(''); setCustomCategoryInput('');
    };
    return (
        <main className="min-h-screen bg-[#0d1117] text-[#c9d1d9] p-4 sm:p-6 font-mono select-none">
            {/* 
               PURE CSS TOGGLE STATE ENGINE:
               We inject a hidden checkbox layout toggle element here. 
               We also add custom style strings directly below it so that the mobile browser's 
               hardware rendering stack swaps form views via raw CSS selector targets, bypassing JS state locks completely.
            */}
            <input type="checkbox" id="form-layout-toggle" className="hidden peer" />
            
            <style dangerouslySetInnerHTML={{__html: `
                #form-layout-toggle ~ #form-container #flashcard-form-pane { display: block; }
                #form-layout-toggle ~ #form-container #blog-form-pane { display: none; }
                
                #form-layout-toggle:checked ~ #form-container #flashcard-form-pane { display: none; }
                #form-layout-toggle:checked ~ #form-container #blog-form-pane { display: block; }

                #form-layout-toggle ~ header #btn-label-flashcard { background: #30363d; color: #fff; border: 1px solid #8b949e; }
                #form-layout-toggle ~ header #btn-label-blog { background: transparent; color: #8b949e; border: 1px solid transparent; }

                #form-layout-toggle:checked ~ header #btn-label-flashcard { background: transparent; color: #8b949e; border: 1px solid transparent; }
                #form-layout-toggle:checked ~ header #btn-label-blog { background: #30363d; color: #fff; border: 1px solid #8b949e; }
            `}} />

            {/* Mobile Dashboard Header Layout */}
            <header className="flex flex-col gap-3 border-b border-[#30363d] pb-4 mb-5">
                <h1 className="text-xs font-bold tracking-wider text-white uppercase">
                    ⚡ BLITZ // SYSTEM.LEDGER.EDITOR
                </h1>
                
                {/* NATIVE INTERACTION LABELS: Clicking these shifts the checkbox target value directly at the OS level */}
                <div className="flex bg-[#161b22] p-1 rounded border border-[#30363d] w-full relative z-50">
                    <label 
                        id="btn-label-flashcard"
                        htmlFor="form-layout-toggle"
                        className="flex-1 text-center py-2.5 rounded text-xs font-bold transition cursor-pointer select-none active:scale-95"
                    >
                        ⚡ CLI Matrix Cards
                    </label>
                    <label 
                        id="btn-label-blog"
                        htmlFor="form-layout-toggle"
                        className="flex-1 text-center py-2.5 rounded text-xs font-bold transition cursor-pointer select-none active:scale-95"
                    >
                        🧠 Continuous Blogs
                    </label>
                </div>
            </header>

            {/* Shared Configuration Selection Deck */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-md p-4 flex flex-col gap-4 max-w-[800px] mx-auto relative z-10 mb-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 flex flex-col gap-1.5">
                        <label className="text-[#8b949e] text-xs">Category Track:</label>
                        <select value={categoryName} onChange={(e) => setCategoryName(e.target.value)} className="bg-[#0d1117] border border-[#30363d] text-white p-2.5 rounded text-xs outline-none">
                            {activeCategories.length > 0 ? activeCategories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            )) : (
                                <>
                                    <option value="Linux Core">Linux Core</option>
                                    <option value="Networking">Networking</option>
                                    <option value="Git Mechanics">Git Mechanics</option>
                                    <option value="Git Deep Theory">Git Deep Theory</option>
                                </>
                            )}
                        </select>
                    </div>
                    <div className="flex-1 flex flex-col gap-1.5">
                        <label className="text-[#8b949e] text-xs">Or New Custom Category:</label>
                        <input type="text" value={customCategoryInput} onChange={(e) => setCustomCategoryInput(e.target.value)} placeholder="e.g. Docker Pipelines" className="bg-[#0d1117] border border-[#30363d] text-white p-2.5 rounded text-xs outline-none focus:border-[#58a6ff]" />
                    </div>
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-[#8b949e] text-xs">Skippable Sub-Section Mapping Anchor Index Link:</label>
                    <input type="text" value={subSection} onChange={(e) => setSubSection(e.target.value)} placeholder="e.g. account-removal, port-scanning" className="bg-[#0d1117] border border-[#30363d] text-white p-2.5 rounded text-xs outline-none focus:border-[#58a6ff]" />
                </div>
            </div>
            {/* MASTER FORM PANES DECK CONTAINER WRAPPER */}
            <div id="form-container" className="bg-[#161b22] border border-[#30363d] rounded-md p-4 max-w-[800px] mx-auto relative z-10">
                
                {/* FLASHCARD MODE LAYOUT VIEW PANEL BLOCK */}
                <div id="flashcard-form-pane" className="pt-2">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1 flex flex-col gap-1.5">
                                <label className="text-[#34d399] text-xs font-bold">Base Command Target Name:</label>
                                <input type="text" value={baseCommand} onChange={(e) => setBaseCommand(e.target.value)} placeholder="e.g. tar" className="bg-[#0d1117] border border-[#30363d] text-[#34d399] p-2.5 rounded text-xs outline-none" />
                            </div>
                            <div className="flex-1 flex flex-col gap-1.5">
                                <label className="text-[#34d399] text-xs font-bold">Full Execution Syntax Layout String:</label>
                                <input type="text" value={syntaxLine} onChange={(e) => setSyntaxLine(e.target.value)} placeholder="e.g. tar -czvf [archive.tar.gz] [target]" className="bg-[#0d1117] border border-[#30363d] text-white p-2.5 rounded text-xs outline-none" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[#8b949e] text-xs">Individual Flag Parameters List Array (flag : explanation | One per line):</label>
                            <textarea value={flagEntries} onChange={(e) => setFlagEntries(e.target.value)} rows={5} placeholder="-c : Creates a fresh backup archive container layout wrapper&#10;-z : Compresses file allocations using standard gzip formats" className="bg-[#010409] border border-[#30363d] text-[#e2e8f0] p-3 rounded text-xs leading-relaxed resize-none outline-none focus:border-[#58a6ff]"></textarea>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[#8b949e] text-xs">Quick Core Operational Summary Notes Details:</label>
                            <input type="text" value={shortNotes} onChange={(e) => setShortNotes(e.target.value)} placeholder="e.g. Compresses system files quickly across cloud environments." className="bg-[#0d1117] border border-[#30363d] text-white p-2.5 rounded text-xs outline-none focus:border-[#58a6ff]" />
                        </div>
                        <button type="button" onClick={() => handleSaveRecord('flashcard')} className="bg-[#238636] border border-[#2ea44f] text-white p-3 rounded font-bold text-xs hover:bg-[#2ea44f] transition tracking-wider uppercase cursor-pointer mt-2 active:scale-95 w-full">
                            Save Flashcard Entry ➔
                        </button>
                    </div>
                </div>

                {/* CONTINUOUS BLOG MODE LAYOUT VIEW PANEL BLOCK */}
                <div id="blog-form-pane" className="pt-2">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[#58a6ff] text-xs font-bold">Article Workflow / Blog Section Heading Title:</label>
                            <input type="text" value={articleTitle} onChange={(e) => setArticleTitle(e.target.value)} placeholder="e.g. Deep Dive: Understanding Git Under-The-Hood Architecture" className="bg-[#0d1117] border border-[#30363d] text-white p-2.5 rounded text-xs outline-none focus:border-[#58a6ff]" />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <div className="flex justify-between items-center mb-1">
                                <label className="text-[#8b949e] text-xs">Continuous Text Content Editor (Natively accepts returns):</label>
                                <div className="flex gap-2">
                                    <button type="button" onClick={() => injectCodeMarkup('inline')} className="bg-[#30363d] border border-[#30363d] text-[#f43f5e] text-[11px] px-2.5 py-1 rounded font-bold cursor-pointer select-none active:scale-95">
                                        [+ Inline]
                                    </button>
                                    <button type="button" onClick={() => injectCodeMarkup('block')} className="bg-[#30363d] border border-[#30363d] text-[#34d399] text-[11px] px-2.5 py-1 rounded font-bold cursor-pointer select-none active:scale-95">
                                        [+ Block]
                                    </button>
                                </div>
                            </div>
                            <textarea id="editor-textarea" value={contentMarkdown} onChange={(e) => setContentMarkdown(e.target.value)} rows={12} placeholder="Write paragraph descriptions or structural workflows. Highlight specific terms and hit the code buttons to wrap them clean without Obsidian syntax errors." className="bg-[#010409] border border-[#30363d] text-[#e2e8f0] p-4 rounded-lg text-xs leading-relaxed resize-none h-[280px] outline-none focus:border-[#22d3ee]"></textarea>
                        </div>
                        <button type="button" onClick={() => handleSaveRecord('blog')} className="bg-[#238636] border border-[#2ea44f] text-white p-3 rounded font-bold text-xs hover:bg-[#2ea44f] transition tracking-wider uppercase cursor-pointer mt-2 active:scale-95 w-full">
                            Save Blog Entry ➔
                        </button>
                    </div>
                </div>

            </div>
        </main>
    );
}
