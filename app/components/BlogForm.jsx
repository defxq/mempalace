'use client';
import { useState } from 'react';

export default function BlogForm({ onSave }) {
    const [articleTitle, setArticleTitle] = useState('');
    const [contentMarkdown, setContentMarkdown] = useState('');

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

    const handleSubmit = () => {
        if (!articleTitle || !contentMarkdown) {
            alert("Continuous blog workflow logs require a title tracking label and content strings.");
            return;
        }

        const data = {
            layoutMode: 'concept',
            title: articleTitle.trim(),
            content: contentMarkdown
        };

        onSave(data);

        // Clear local input states cleanly
        setArticleTitle('');
        setContentMarkdown('');
    };

    return (
        <div className="flex flex-col gap-4 border-t border-[#30363d] pt-4">
            <div className="flex flex-col gap-1.5">
                <label className="text-[#58a6ff] text-xs font-bold">Article Workflow / Blog Section Heading Title:</label>
                <input type="text" value={articleTitle} onChange={(e) => setArticleTitle(e.target.value)} placeholder="e.g. Deep Dive: Understanding Git Under-The-Hood Architecture" className="bg-[#0d1117] border border-[#30363d] text-white p-2.5 rounded text-xs outline-none focus:border-[#58a6ff]" />
            </div>

            <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center mb-1">
                    <label className="text-[#8b949e] text-xs">Continuous Text Content Editor (Natively accepts returns):</label>
                    <div className="flex gap-2">
                        <div role="button" tabIndex={0} onClick={() => injectCodeMarkup('inline')} className="bg-[#30363d] border border-[#30363d] text-[#f43f5e] text-[11px] px-2.5 py-1 rounded font-bold cursor-pointer select-none active:scale-95">
                            [+ Inline]
                        </div>
                        <div role="button" tabIndex={0} onClick={() => injectCodeMarkup('block')} className="bg-[#30363d] border border-[#30363d] text-[#34d399] text-[11px] px-2.5 py-1 rounded font-bold cursor-pointer select-none active:scale-95">
                            [+ Block]
                        </div>
                    </div>
                </div>
                <textarea id="editor-textarea" value={contentMarkdown} onChange={(e) => setContentMarkdown(e.target.value)} rows={12} placeholder="Write paragraph descriptions or structural workflows. Highlight specific terms and hit the code buttons to wrap them clean without Obsidian syntax errors." className="bg-[#010409] border border-[#30363d] text-[#e2e8f0] p-4 rounded-lg text-xs leading-relaxed resize-none h-[280px] outline-none focus:border-[#22d3ee]"></textarea>
            </div>

            <button type="button" onClick={handleSubmit} className="bg-[#238636] border border-[#2ea44f] text-white p-3 rounded font-bold text-xs hover:bg-[#2ea44f] transition tracking-wider uppercase cursor-pointer mt-2 active:scale-95">
                Save Blog Entry ➔
            </button>
        </div>
    );
}
