import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// This function runs strictly on your laptop's backend hard drive, bypassing all network/mobile socket limits
export async function GET() {
    try {
        const coreVaultPath = path.resolve(process.cwd(), '../repo-1-viewer/data.json');
        if (!fs.existsSync(coreVaultPath)) {
            return NextResponse.json([]);
        }
        const fileContent = fs.readFileSync(coreVaultPath, 'utf-8');
        return NextResponse.json(JSON.parse(fileContent || '[]'));
    } catch (error) {
        return NextResponse.json([]);
    }
}
