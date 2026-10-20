import fs from 'fs';
import path from 'path';
import { Suspense } from 'react';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getVaultDatabase } from '../actions';
import AddClientForm from './AddClientForm';

async function AddFormPrefetcher() {
    // CACHE BUSTER CORE ROUTINE:
    // Accessing headers inside the Suspense boundary handles cache busting correctly
    await headers();

    const baselineDatabase = await getVaultDatabase();
    const activeCategories = [...new Set(baselineDatabase.map((item) => item.tab || item.category))].filter(Boolean);

    // DIRECT SERVER ACTION PIPELINE
    async function executeHardDriveInsertion(formData) {
        'use server';
        
        const workspaceMode = formData.get('activeLayoutMode')?.toString() || 'flashcard';
        const categorySelection = formData.get('nodeCategorySelect')?.toString();
        const customCategory = formData.get('nodeCustomCategory')?.toString().trim();
        const chosenTab = customCategory || categorySelection || 'General';
        const sectionMapping = formData.get('nodeSection')?.toString().trim() || 'General';

        const coreVaultPath = path.resolve(process.cwd(), '../repo-1-viewer/data.json');
        let currentPayload = [];
        try {
            if (fs.existsSync(coreVaultPath)) {
                currentPayload = JSON.parse(fs.readFileSync(coreVaultPath, 'utf-8') || '[]');
            }
        } catch (e) {
            console.error("Collision protection tracker failure:", e.message);
        }

        const newRecordNode = {
            id: String(Date.now()),
            tab: chosenTab,
            layoutMode: workspaceMode === 'flashcard' ? 'lookup' : 'concept',
            section: sectionMapping
        };

        if (workspaceMode === 'flashcard') {
            const baseCommand = formData.get('nodeCommand')?.toString().trim() || '';
            const executionSyntax = formData.get('nodeSyntax')?.toString().trim() || '';
            const flagEntriesRaw = formData.get('nodeFlags')?.toString() || '';
            const coreNotes = formData.get('nodeNotes')?.toString().trim() || 'Quick reference.';

            const flagArray = [];
            if (flagEntriesRaw.trim()) {
                flagEntriesRaw.split('\n').forEach(line => {
                    const sections = line.split(':');
                    if (sections.length >= 2) {
                        flagArray.push({ flag: sections.trim(), desc: sections.slice(1).join(':').trim() });
                    } else if (line.trim()) {
                        flagArray.push({ flag: line.trim(), desc: "Parameter execution enabled." });
                    }
                });
            }

            newRecordNode.command = baseCommand;
            newRecordNode.syntax = executionSyntax;
            newRecordNode.flags = flagArray.length > 0 ? flagArray : [{ flag: "Default", desc: "Standard parameter." }];
            newRecordNode.notes = coreNotes;
        } else {
            const articleTitle = formData.get('nodeTitle')?.toString().trim() || 'Untitled Log Entry';
            const bodyContent = formData.get('nodeContent')?.toString() || '';

            newRecordNode.title = articleTitle;
            newRecordNode.content = bodyContent;
        }

        const compositeDatabaseArray = [...currentPayload, newRecordNode];
        fs.writeFileSync(coreVaultPath, JSON.stringify(compositeDatabaseArray, null, 2), 'utf-8');

        redirect('/manage');
    }

    return (
        <AddClientForm 
            activeCategories={activeCategories} 
            saveAction={executeHardDriveInsertion} 
        />
    );
}

// Master Route: Streams a placeholder background canvas to completely kill prerendering build warnings
export default function AddRecordGatekeeper() {
    return (
        <Suspense fallback={
            <div style={{ backgroundColor: '#060810', color: '#00f0ff', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace', fontSize: '12px', trackingWith: '0.25em' }}>
                ⚡ INITIALIZING LOG VIEW DESK ENGINE VECTOR...
            </div>
        }>
            <AddFormPrefetcher />
        </Suspense>
    );
}
