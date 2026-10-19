import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(request: Request) {
    try {
        const fullLibraryPayload = await request.json();
        
        // Use absolute directory bindings to ensure the server never loses the target path context
        const coreVaultPath = path.resolve(process.cwd(), '../repo-1-viewer/data.json');

        // Verify the file exists before writing to prevent destructive blanket overwrites
        let workingPayload = fullLibraryPayload;
        if (fs.existsSync(coreVaultPath)) {
            const currentDiskContent = fs.readFileSync(coreVaultPath, 'utf-8');
            if (currentDiskContent.trim()) {
                const existingData = JSON.parse(currentDiskContent);
                
                // Deduplicate items based on ID to ensure pure append actions
                const existingIds = new Set(existingData.map((item: any) => item.id));
                const newUniqueEntries = fullLibraryPayload.filter((item: any) => !existingIds.has(item.id));
                
                workingPayload = [...existingData, ...newUniqueEntries];
            }
        }

        // Overwrite disk file securely with the full combined ledger payload
        fs.writeFileSync(coreVaultPath, JSON.stringify(workingPayload, null, 2), 'utf-8');

        // Automate Git commit routines to keep your cloud origin in sync safely
        const gitRoutine = `
            cd ../repo-1-viewer
            git add data.json
            git commit -m "Automated ledger entry append via Editor Workspace UI"
            git push origin main
        `;

        execAsync(gitRoutine).catch(err => {
            console.error("Background Git origin sync failure: ", err.message);
        });

        return NextResponse.json({ success: true, message: "Vault updated on disk cleanly. Git syncing running." });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
