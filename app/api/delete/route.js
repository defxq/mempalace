import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const coreVaultPath = path.resolve(process.cwd(), '../repo-1-viewer/data.json');

export async function POST(request) {
    try {
        let targetId = null;
        const contentType = request.headers.get('content-type') || '';

        // Safely extract input parameters across both native form data and raw JSON payloads
        if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
            const formData = await request.formData();
            targetId = formData.get('id')?.toString();
        } else {
            const jsonBody = await request.json();
            targetId = jsonBody?.id;
        }
        
        if (!targetId) {
            return NextResponse.json({ success: false, error: "Missing Target ID Parameter" }, { status: 400 });
        }

        const fileContent = fs.readFileSync(coreVaultPath, 'utf-8');
        const currentLibrary = JSON.parse(fileContent || '[]');
        const updatedLibrary = currentLibrary.filter(item => item.id !== String(targetId));
        
        fs.writeFileSync(coreVaultPath, JSON.stringify(updatedLibrary, null, 2), 'utf-8');

        // Background push sync routines
        const gitRoutine = `
            cd ../repo-1-viewer
            git add data.json
            git commit -m "Automated ledger entry drop via secure network endpoint form wrapper"
            git push origin main
        `;
        execAsync(gitRoutine).catch(err => console.error("Git drop backup failure: ", err.message));

        // Support direct browser re-routing headers if the call came from a native page form fallback
        if (contentType.includes('form')) {
            return new Response(null, { status: 302, headers: { 'Location': '/manage' } });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
