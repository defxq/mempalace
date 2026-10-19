'use client';
import { useState } from 'react';

export default function FlashcardForm({ onSave, activeCategories, categoryName, setCategoryName, customCategoryInput, setCustomCategoryInput, subSection, setSubSection }) {
    const [baseCommand, setBaseCommand] = useState('');
    const [syntaxLine, setSyntaxLine] = useState('');
    const [flagEntries, setFlagEntries] = useState('');
    const [shortNotes, setShortNotes] = useState('');

    const handleSubmit = () => {
        if (!baseCommand || !syntaxLine) {
            alert("Flashcard matrix logs require a base command and syntax definition.");
            return;
        }

        const structuredFlags = [];
        if (flagEntries.trim()) {
            flagEntries.split('\n').forEach(line => {
                const sections = line.split(':');
                if (sections.length >= 2) {
                    structuredFlags.push({ flag: sections[0].trim(), desc: sections.slice(1).join(':').trim() });
                } else if (line.trim()) {
                    structuredFlags.push({ flag: line.trim(), desc: "Parameter execution enabled." });
                }
            });
        }

        const data = {
            layoutMode: 'lookup',
            command: baseCommand.trim(),
            syntax: syntaxLine.trim(),
            flags: structuredFlags.length > 0 ? structuredFlags : [{ flag: "Default", desc: "Standard lookup parameters." }],
            notes: shortNotes.trim() || "Fast lookup command."
        };

        onSave(data);

        // Clear local inputs
        setBaseCommand('');
        setSyntaxLine('');
        setFlagEntries('');
        setShortNotes('');
    };

    return (
        <div className="flex flex-col gap-4 border-t border-[#30363d] pt-4">
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 flex flex-col gap-1.5">
                    <label className="text-[#34d399] text-xs font-bold">Base Command Target Name:</label>
                    <input type="text" value={baseCommand} onChange={(e) => setBaseCommand(e.target.value)} placeholder="e.g. tar" className="bg-[#0d1117] border border-[#30363d] text-[#34d399] p-2.5 rounded text-xs outline-none focus:border-[#34d399]" />
                </div>
                <div className="flex-1 flex flex-col gap-1.5">
                    <label className="text-[#34d399] text-xs font-bold">Full Execution Syntax Layout String:</label>
                    <input type="text" value={syntaxLine} onChange={(e) => setSyntaxLine(e.target.value)} placeholder="e.g. tar -czvf [archive.tar.gz]" className="bg-[#0d1117] border border-[#30363d] text-white p-2.5 rounded text-xs outline-none focus:border-[#34d399]" />
                </div>
            </div>
            <div className="flex flex-col gap-1.5">
                <label className="text-[#8b949e] text-xs">Individual Flags (flag : explanation | One per line):</label>
                <textarea value={flagEntries} onChange={(e) => setFlagEntries(e.target.value)} rows={5} placeholder="-c : Creates an archive&#10;-z : Uses gzip compression" className="bg-[#010409] border border-[#30363d] text-[#e2e8f0] p-3 rounded text-xs leading-relaxed resize-none outline-none focus:border-[#58a6ff]"></textarea>
            </div>
            <div className="flex flex-col gap-1.5">
                <label className="text-[#8b949e] text-xs">Quick Summary Notes Details:</label>
                <input type="text" value={shortNotes} onChange={(e) => setShortNotes(e.target.value)} placeholder="e.g. Compresses system files quickly across cloud environments." className="bg-[#0d1117] border border-[#30363d] text-white p-2.5 rounded text-xs outline-none focus:border-[#58a6ff]" />
            </div>
            <button type="button" onClick={handleSubmit} className="bg-[#238636] border border-[#2ea44f] text-white p-3 rounded font-bold text-xs hover:bg-[#2ea44f] transition tracking-wider uppercase cursor-pointer mt-2 active:scale-95">
                Save Flashcard Entry ➔
            </button>
        </div>
    );
}
