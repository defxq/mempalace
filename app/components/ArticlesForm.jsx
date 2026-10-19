'use client';
import { useState } from 'react';

export default function ArticlesForm({ onSave }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

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
        setContent(updatedText);
    };

    const handleSubmit = () => {
        if (!title || !content) {
            alert("Continuous workflows require a structural title and description content.");
            return;
        }

        onSave({
            layoutMode: 'concept',
            title: title.trim(),
            content: content
        });

        setTitle('');
        setContent('');
    };

    return (
        <div className="flex flex-col gap-4 animate-fadeIn">
            <div className="flex flex-col gap-1">
                <label className="text-[#8b949e] text-xs font-semibold">Article Workflow / Section Title:</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Deep Dive: Understanding Git Under-The-Hood Architecture" className="bg-[#010409] border border-[#30363d] text-white p-2 rounded text-xs outline-none focus:border-[#58a6ff]" />
            </div>

            <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center mb-1">
                    <label className="text-[#8b949e] text-xs font-semibold">Continuous Document Content:</label>
                    <div className="flex gap-1.5">
                        <button type="button" onClick={() => injectCodeMarkup('inline')} className="bg-[#21262d] border border-[#30363d] hover:border-[#8b949e] text-[#f43f5e] text-[11px] px-2 py-0.5 rounded font-bold cursor-pointer transition">
                            [+ Inline]
                        </button>
                        <button type="button" onClick={() => injectCodeMarkup('block')} className="bg-[#21262d] border border-[#30363d] hover:border-[#8b949e] text-[#34d399] text-[11px] px-2 py-0.5 rounded font-bold cursor-pointer transition">
                            [+ Block]
                        </button>
                    </div>
                </div>
                <textarea id="editor-textarea" value={content} onChange={(e) => setContent(e.target.value)} rows={12} placeholder="Write paragraph logs or detailed steps. Highlight text variables and use formatting layout helpers above safely." className="bg-[#010409] border border-[#30363d] text-[#c9d1d9] p-3 rounded text-xs leading-relaxed resize-none h-[280px] outline-none focus:border-[#58a6ff]"></textarea>
            </div>

            <button type="button" onClick={handleSubmit} className="bg-[#238636] border border-[#2ea44f] text-white p-2.5 rounded text-xs font-bold transition active:scale-[0.98] cursor-pointer mt-2 uppercase tracking-wider">
                Save Continuous Article ➔
            </button>
        </div>
    );
}
