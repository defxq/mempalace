import fs from 'fs';
import path from 'path';
import { Suspense } from 'react';
import { headers } from 'next/headers';
import EditClient from './EditClient';

// FIXED: Moved the params resolution step here inside the tracking execution boundary
async function FetchSpecificLedgerNode(paramsPromise) {
    const resolvedParams = await paramsPromise;
    const targetRecordId = resolvedParams.id;
    
    await headers(); // Forces an immediate live server repaint on your telephone viewport
    
    let databasePayload = [];
    try {
        const coreVaultPath = path.resolve(process.cwd(), '../repo-1-viewer/data.json');
        if (fs.existsSync(coreVaultPath)) {
            const fileContent = fs.readFileSync(coreVaultPath, 'utf-8');
            databasePayload = JSON.parse(fileContent || '[]');
        }
    } catch (e) {
        console.error("Failed to read database parameters on server:", e.message);
    }

    const activeItemNode = databasePayload.find(item => item.id === targetRecordId);
    
    if (!activeItemNode) {
        return (
            <div className="min-h-screen bg-[#0d1117] text-[#f43f5e] p-6 font-mono flex flex-col gap-4 items-center justify-center text-xs">
                <p>❌ LEDGER TARGET ENTRY INDEX NOT FOUND IN DATABASE VECTORS.</p>
                <a href="/manage" className="text-[#58a6ff] underline">Return to Management Deck</a>
            </div>
        );
    }

    return <EditClient activeItemNode={activeItemNode} />;
}

// Master Route: Delivers a clean streaming placeholder to completely kill runtime console warnings
export default function IndependentEditorPage({ params }) {
    return (
        <Suspense fallback={
            <div style={{ backgroundColor: '#0d1117', color: '#8b949e', height: '100vh', display: 'flex', alignItems: 'center', justifycontent: 'center', fontFamily: 'monospace', fontSize: '12px' }}>
                ⚡ ASSEMBLING EXCLUSIVE EDITING VIEW CANVAS...
            </div>
        }>
            {FetchSpecificLedgerNode(params)}
        </Suspense>
    );
}
