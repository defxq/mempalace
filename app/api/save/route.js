import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const coreVaultPath = path.resolve(process.cwd(), '../repo-1-viewer/data.json');

export async function GET() {
    try {
        if (!fs.existsSync(coreVaultPath)) return NextResponse.json([]);
        const fileContent = fs.readFileSync(coreVaultPath, 'utf-8');
        return NextResponse.json(JSON.parse(fileContent || '[]'));
    } catch (error) {
        return NextResponse.json([]);
    }
}

// POST: Modifies data.json strictly on local disk drive loops without touching GitHub
export async function POST(request) {
    try {
        const fullLibraryPayload = await request.json();
        fs.writeFileSync(coreVaultPath, JSON.stringify(fullLibraryPayload, null, 2), 'utf-8');

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
