'use client';
import { useState } from 'react';

export default function CardsForm({ onSave }) {
    const [command, setCommand] = useState('');
    const [syntax, setSyntax] = useState('');
    const [flags, setFlags] = useState('');
    const [notes, setShortNotes] = useState('');

    const handleSubmit = () => {
        if (!command || !syntax) {
            alert("Flashcard matrices require a command and syntax rule.");
            return;
        }
        
        const flagArray = [];
        if (flags.trim()) {
            flags.split('\n').forEach(line => {
                const parts = line.split(':');
                if (parts.length >= 2) {
                    flagArray.push({ flag: parts[0].trim(), desc: parts.slice(1).join(':').trim() });
                } else if (line.trim()) {
                    flagArray.push({ flag: line.trim(), desc: "Parameter execution enabled." });
                }
            });
        }

        onSave({
            layoutMode: 'lookup',
            command: command.trim(),
            syntax: syntax.trim(),
            flags: flagArray.length > 0 ? flagArray : [{ flag: "Default", desc: "Standard parameter." }],
            notes: notes.trim() || "Quick reference lookup card."
        });

        setCommand('');
        setSyntax('');
        setFlags('');
        setShortNotes('');
    };

    return (
        <div className="flex flex-col gap-4 animate-fadeIn">
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 flex flex-col gap-1">
                    <label className="text-[#8b949e] text-xs font-semibold">Base Command:</label>
                    <input type="text" value={command} onChange={(e) => setCommand(e.target.value)} placeholder="e.g. stat" className="bg-[#010409] border border-[#30363d] text-white p-2 rounded text-xs outline-none focus:border-[#58a6ff]" />
                </div>
                <div className="flex-1 flex flex-col gap-1">
                    <label className="text-[#8b949e] text-xs font-semibold">Full Execution Syntax:</label>
                    <input type="text" value={syntax} onChange={(e) => setSyntax(e.target.value)} placeholder="e.g. stat [file|directory]" className="bg-[#010409] border border-[#30363d] text-white p-2 rounded text-xs outline-none focus:border-[#58a6ff]" />
                </div>
            </div>
            <div className="flex flex-col gap-1">
                <label className="text-[#8b949e] text-xs font-semibold">Flags Array (flag : definition | One per line):</label>
                <textarea value={flags} onChange={(e) => setFlags(e.target.value)} rows={4} placeholder="-c : Count duplicates&#10;-d : Show details" className="bg-[#010409] border border-[#30363d] text-[#c9d1d9] p-2.5 rounded text-xs resize-none outline-none focus:border-[#58a6ff]"></textarea>
            </div>
            <div className="flex flex-col gap-1">
                <label className="text-[#8b949e] text-xs font-semibold">Summary Reference Notes:</label>
                <input type="text" value={notes} onChange={(e) => setShortNotes(e.target.value)} placeholder="e.g. Inspects low-level filesystem inode details." className="bg-[#010409] border border-[#30363d] text-white p-2 rounded text-xs outline-none focus:border-[#58a6ff]" />
            </div>
            <button type="button" onClick={handleSubmit} className="bg-[#238636] border border-[#2ea44f] text-white p-2.5 rounded text-xs font-bold transition active:scale-[0.98] cursor-pointer mt-2 uppercase tracking-wider">
                Save Matrix Card ➔
            </button>
        </div>
    );
}
