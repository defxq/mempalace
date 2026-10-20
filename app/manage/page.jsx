import fs from 'fs';
import path from 'path';
import { Suspense } from 'react';
import { headers } from 'next/headers';
import ManageClient from './ManageClient';

// Clean Loader Component that safely handles the hard drive prefetch task
async function VaultDataPrefetcher() {
    // Accessing headers inside the Suspense boundary handles cache busting correctly
    await headers();
    
    let preloadedDatabase = [];
    try {
        const coreVaultPath = path.resolve(process.cwd(), '../repo-1-viewer/data.json');
        if (fs.existsSync(coreVaultPath)) {
            const fileContent = fs.readFileSync(coreVaultPath, 'utf-8');
            preloadedDatabase = JSON.parse(fileContent || '[]');
        }
    } catch (error) {
        console.error("Direct server file prefetch failed:", error.message);
    }

    return <ManageClient initialLibrary={preloadedDatabase} />;
}

// Master Route: Delivers a clean streaming placeholder to completely kill runtime console warnings
export default function ServerManagePage() {
    return (
        <Suspense fallback={
            <div style={{ backgroundColor: '#0d1117', color: '#8b949e', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace', fontSize: '12px' }}>
                ⚡ SECURING DATABASE LEDGER STREAM...
            </div>
        }>
            <VaultDataPrefetcher />
        </Suspense>
    );
}
