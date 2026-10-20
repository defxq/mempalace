import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const coreVaultPath = path.resolve(process.cwd(), '../repo-1-viewer/data.json');

// GET Method: Serves the hard-drive database file to your mobile device over Wi-Fi
export async function GET() {
    try {
        if (!fs.existsSync(coreVaultPath)) {
            return NextResponse.json([]);
        }
        const fileContent = fs.readFileSync(coreVaultPath, 'utf-8');
        return NextResponse.json(JSON.parse(fileContent || '[]'));
    } catch (error) {
        return NextResponse.json([]);
    }
}

// POST Method: Receives modified datasets from your mobile phone and overwrites data.json safely
export async function POST(request) {
    try {
        const fullLibraryPayload = await request.json();
        fs.writeFileSync(coreVaultPath, JSON.stringify(fullLibraryPayload, null, 2), 'utf-8');

        // Automatic background background Git synchronizations
        const gitRoutine = `
            cd ../repo-1-viewer
            git add data.json
            git commit -m "Automated ledger modifications via network-aware mobile UI"
            git push origin main
        `;

        execAsync(gitRoutine).catch(err => {
            console.error("Background Git origin sync failure: ", err.message);
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
