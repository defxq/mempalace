import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(request) {
    try {
        // Execute an explicit, sequenced Git upstream sync chain on your laptop's hard drive
        const gitRoutine = `
            cd ../repo-1-viewer
            git add data.json
            git commit -m "Manual sync pipeline triggered via mobile dashboard control deck" || true
            git push origin main
        `;

        await execAsync(gitRoutine);

        // Support direct browser re-routing headers if the call came from a native page form fallback
        return new Response(null, { 
            status: 302, 
            headers: { 'Location': '/?sync=success' } 
        });
    } catch (error) {
        console.error("Manual Git synchronization failed: ", error.message);
        return new Response(null, { 
            status: 302, 
            headers: { 'Location': '/?sync=failed' } 
        });
    }
}
